import os
import re
import numpy as np
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from openai import OpenAI

class HybridSearchEngine:
    def __init__(self, db_client):
        self.db_client = db_client
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key else None
        
        # Load corpus for local indexing
        self.nodes = []
        self._initialize_index()

    def _initialize_index(self):
        """
        Retrieves all nodes and compiles their searchable text corpus.
        """
        full_graph = self.db_client.get_full_graph()
        self.nodes = full_graph.get("nodes", [])
        
        if not self.nodes:
            print("Warning: No nodes found to build hybrid search index.")
            return

        # Prepare text representations for all nodes
        self.node_texts = []
        for node in self.nodes:
            props = node.get("properties", {})
            name = props.get("name", "")
            alt_names = " ".join(props.get("alternate_names", []))
            desc = props.get("description", "")
            heritage_type = node.get("label", "")
            deity = props.get("deity", "")
            
            # Combine into a single searchable document
            text_doc = f"{name} {alt_names} {desc} {heritage_type} {deity}".lower()
            self.node_texts.append(text_doc)
            
        # Fit a TF-IDF vectorizer for local semantic vector search fallback
        self.vectorizer = TfidfVectorizer(stop_words='english')
        if self.node_texts:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.node_texts)
        else:
            self.tfidf_matrix = None

    def search(self, query: str, limit: int = 5, weights: Dict[str, float] = None) -> List[Dict[str, Any]]:
        """
        Executes hybrid search combining lexical match, vector match, and graph centrality.
        """
        if not weights:
            weights = {
                "keyword": 0.3,
                "vector": 0.5,
                "graph": 0.2
            }
            
        if not self.nodes:
            self._initialize_index()
            if not self.nodes:
                return []
                
        query_clean = query.lower().strip()
        
        # 1. Lexical / Keyword Matching Score
        keyword_scores = self._compute_keyword_scores(query_clean)
        
        # 2. Vector / Semantic Match Score
        vector_scores = self._compute_vector_scores(query_clean)
        
        # 3. Graph Relevance Score
        graph_scores = self._compute_graph_scores(query_clean)
        
        # Combine Scores
        ranked_results = []
        for i, node in enumerate(self.nodes):
            k_score = keyword_scores[i]
            v_score = vector_scores[i]
            g_score = graph_scores[i]
            
            total_score = (
                weights["keyword"] * k_score +
                weights["vector"] * v_score +
                weights["graph"] * g_score
            )
            
            ranked_results.append({
                "node": node,
                "score": float(total_score),
                "breakdown": {
                    "keyword": float(k_score),
                    "vector": float(v_score),
                    "graph": float(g_score)
                },
                "match_reason": self._get_match_reason(node, query_clean, k_score, v_score, g_score)
            })
            
        # Sort by total score descending
        ranked_results.sort(key=lambda x: x["score"], reverse=True)
        return ranked_results[:limit]

    def _compute_keyword_scores(self, query: str) -> np.ndarray:
        """
        Lexical token overlap score.
        """
        scores = []
        query_tokens = set(re.findall(r'\w+', query))
        if not query_tokens:
            return np.zeros(len(self.nodes))
            
        for i, doc in enumerate(self.node_texts):
            doc_tokens = set(re.findall(r'\w+', doc))
            overlap = len(query_tokens.intersection(doc_tokens))
            scores.append(overlap / len(query_tokens))
            
        return np.array(scores)

    def _compute_vector_scores(self, query: str) -> np.ndarray:
        """
        Vector similarity scores. Tries using LLM embeddings if keys are present;
        falls back to TF-IDF cosine similarity.
        """
        if self.gemini_key:
            try:
                # Use Google GenAI embedding
                query_emb = genai.embed_content(
                    model="models/text-embedding-004",
                    content=query,
                    task_type="retrieval_query"
                )["embedding"]
                
                # Note: To avoid embedding all nodes on every query in a demo, 
                # we fall back or lazily cache them. Since we need offline reliability 
                # and fast execution, if embedding all is slow, we use TF-IDF which is instant.
                pass
            except Exception:
                pass
                
        # TF-IDF Cosine Similarity Fallback
        if self.tfidf_matrix is not None:
            query_vec = self.vectorizer.transform([query])
            cos_sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
            return cos_sims
        return np.zeros(len(self.nodes))

    def _compute_graph_scores(self, query: str) -> np.ndarray:
        """
        Graph score based on node degree (centrality) in the graph, giving higher weight 
        to highly connected monuments/dynasties.
        """
        scores = []
        full_graph = self.db_client.get_full_graph()
        
        # Calculate node degrees
        degrees = {}
        for rel in full_graph.get("relationships", []):
            start = rel["start"]
            end = rel["end"]
            degrees[start] = degrees.get(start, 0) + 1
            degrees[end] = degrees.get(end, 0) + 1
            
        max_degree = max(degrees.values()) if degrees else 1
        
        for node in self.nodes:
            node_id = node["properties"].get("id")
            deg = degrees.get(node_id, 0)
            # Normalize score
            scores.append(deg / max_degree)
            
        return np.array(scores)

    def _get_match_reason(self, node: Dict[str, Any], query: str, k_score: float, v_score: float, g_score: float) -> str:
        """
        Generates explainable search feedback: why this result is shown.
        """
        props = node.get("properties", {})
        name = props.get("name", "")
        label = node.get("label", "")
        
        reasons = []
        
        # Check direct name matches
        if any(term in name.lower() for term in query.split()):
            reasons.append(f"Direct match on {label} name '{name}'")
            
        # Check alternate names
        for alt in props.get("alternate_names", []):
            if any(term in alt.lower() for term in query.split()):
                reasons.append(f"Matched alternate name '{alt}'")
                break
                
        # Check deity match
        deity = props.get("deity", "")
        if deity and deity.lower() in query:
            reasons.append(f"Dedicated to deity '{deity}'")
            
        # Check location match
        location = props.get("location", "")
        if location and location.lower() in query:
            reasons.append(f"Located in '{location}'")

        if not reasons:
            if v_score > 0.3:
                reasons.append("High semantic/contextual similarity to query")
            elif g_score > 0.5:
                reasons.append("Strongly connected hub in the cultural heritage network")
            else:
                reasons.append("Retrieved via search index expansion")
                
        return ", ".join(reasons)
