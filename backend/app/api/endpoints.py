import os
import sys
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any, Set

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app.models.schemas import SearchRequest, SearchResponse, QueryRequest, CompareRequest
from app.graph.db_client import GraphDatabaseClient
from app.nlp.query_parser import QueryParser
from app.retrieval.hybrid_search import HybridSearchEngine
from app.rag.answer_generator import AnswerGenerator

router = APIRouter()

# Initialize core services
db_client = GraphDatabaseClient()
parser = QueryParser()
hybrid_search = HybridSearchEngine(db_client)
answer_generator = AnswerGenerator(db_client)

@router.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest):
    """
    NLP search endpoint that understands query intent, queries the graph,
    performs hybrid ranking, constructs a visual subgraph, and generates a grounded response.
    """
    try:
        query = request.query
        lang = request.lang or "en"
        
        # 1. NLP Query Parsing
        parsed = parser.parse(query)
        cypher = parsed.get("cypher", "")
        explanation = parsed.get("explanation", "")
        
        # 2. Graph Retrieval
        graph_results = []
        if cypher:
            print(f"Running parsed Cypher: {cypher}")
            graph_results = db_client.query(cypher)
            
        # 3. Hybrid Search Retrieval
        hybrid_results = hybrid_search.search(query, limit=5)
        
        # Merge entities from Graph and Hybrid retrieval
        matched_node_ids: Set[str] = set()
        matched_entities = []
        
        # Add hybrid search nodes (only if they are relevant matches > 0.02)
        for item in hybrid_results:
            if item["score"] <= 0.02:
                continue
            node = item["node"]
            nid = node["properties"].get("id")
            if nid and nid not in matched_node_ids:
                matched_node_ids.add(nid)
                # Attach score and match reason
                node_copy = dict(node)
                node_copy["score"] = item["score"]
                node_copy["match_reason"] = item["match_reason"]
                matched_entities.append(node_copy)
                
        # Add graph search nodes
        for record in graph_results:
            for k, v in record.items():
                if isinstance(v, dict) and "properties" in v:
                    nid = v["properties"].get("id")
                    if nid and nid not in matched_node_ids:
                        matched_node_ids.add(nid)
                        # Attach a default graph match score
                        node_copy = dict(v)
                        node_copy["score"] = 0.9
                        node_copy["match_reason"] = "Retrieved via relationship graph match"
                        matched_entities.append(node_copy)
                        
        # Check if we have absolutely no matching data
        if len(matched_node_ids) == 0:
            if lang == "ta":
                msg = "ஆவணக் காப்பகத்தில் உங்கள் கேள்விக்குத் தேவையான சரிபார்க்கப்பட்ட தகவல்கள் எதுவும் கிடைக்கவில்லை. சோழர், பல்லவர் அல்லது பாண்டியர் காலக் கோவில்கள் மற்றும் வரலாற்றுப் பகுதிகளைப் பற்றி கேட்கவும்."
            elif lang == "hi":
                msg = "संग्रह में आपके प्रश्न के लिए पर्याप्त सत्यापित इतिहास जानकारी नहीं मिली। कृपया चोल, पल्लव या पांड्य मंदिरों, शासकों और स्थानों के बारे में पूछें।"
            else:
                msg = "I couldn't find enough verified heritage information in the archive to answer that question. Please try asking about Tamil Nadu heritage, Chola, Pallava, or Pandya temples, rulers, and locations."
            
            return SearchResponse(
                answer=msg,
                matched_entities=[],
                sources=[],
                graph={"nodes": [], "relationships": []},
                explanation="No matching entities found in the Knowledge Graph for this query."
            )
            
        # 4. Local Subgraph Construction for Visuals
        subgraph = _build_local_subgraph(matched_node_ids)
        
        # 5. RAG Answer Generation
        # We pass both the parsed query metadata and matched entities as evidence
        generation_data = []
        for item in hybrid_results:
            if item["score"] > 0.02:
                generation_data.append({"node": item["node"]})
        for record in graph_results:
            generation_data.append(record)
            
        answer_data = answer_generator.generate(query, parsed, generation_data, lang)
        
        return SearchResponse(
            answer=answer_data["answer"],
            matched_entities=matched_entities,
            sources=answer_data["sources"],
            graph=subgraph,
            explanation=explanation
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/heritage/{node_id}")
async def get_heritage_detail(node_id: str):
    """
    Returns full properties of a node and its direct neighbors.
    """
    full_graph = db_client.get_full_graph()
    target_node = None
    
    for n in full_graph["nodes"]:
        if n["properties"].get("id") == node_id:
            target_node = n
            break
            
    if not target_node:
        raise HTTPException(status_code=404, detail=f"Heritage entity '{node_id}' not found.")
        
    # Get neighbors
    relationships = []
    neighbors = []
    neighbor_ids = set()
    
    for rel in full_graph["relationships"]:
        if rel["start"] == node_id or rel["end"] == node_id:
            relationships.append(rel)
            nbr_id = rel["end"] if rel["start"] == node_id else rel["start"]
            neighbor_ids.add(nbr_id)
            
    for n in full_graph["nodes"]:
        if n["properties"].get("id") in neighbor_ids:
            neighbors.append(n)
            
    return {
        "node": target_node,
        "relationships": relationships,
        "neighbors": neighbors
    }

@router.post("/semantic-search")
async def semantic_search_only(request: SearchRequest):
    """
    Standard ranked semantic lookup endpoint.
    """
    results = hybrid_search.search(request.query, limit=10)
    return results

@router.post("/query")
async def run_cypher_query(request: QueryRequest):
    """
    Executes raw read-only Cypher query against the active engine.
    """
    cypher = request.cypher.strip()
    
    # Security check: Read-only cypher guard
    write_keywords = ["create", "merge", "delete", "detach", "set", "remove", "drop"]
    cypher_lower = cypher.lower()
    for kw in write_keywords:
        # Check for word boundary
        if re.search(r'\b' + kw + r'\b', cypher_lower):
            raise HTTPException(status_code=403, detail=f"Operation '{kw}' is not allowed. Write actions are restricted.")
            
    try:
        records = db_client.query(cypher)
        return {"records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare")
async def compare_sites(request: CompareRequest):
    """
    Retrieves properties of specified site IDs side-by-side.
    """
    site_ids = request.site_ids
    full_graph = db_client.get_full_graph()
    
    compared_nodes = []
    for node in full_graph["nodes"]:
        node_id = node["properties"].get("id")
        if node_id in site_ids:
            compared_nodes.append(node)
            
    return {"sites": compared_nodes}

@router.get("/graph")
async def get_entire_graph():
    """
    Returns the complete knowledge graph for full map explorer.
    """
    try:
        return db_client.get_full_graph()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/related/{node_id}")
async def get_related_nodes(node_id: str):
    """
    Returns nodes related to node_id.
    """
    return await get_heritage_detail(node_id)

@router.get("/sources/{node_id}")
async def get_node_sources(node_id: str):
    """
    Retrieves sources for a specific heritage site node.
    """
    detail = await get_heritage_detail(node_id)
    node = detail.get("node", {})
    source = node.get("properties", {}).get("source", "No recorded source.")
    return {"node_id": node_id, "source": source}

def _build_local_subgraph(node_ids: Set[str]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Constructs a visual subgraph showing nodes in the set and all direct connections.
    """
    full_graph = db_client.get_full_graph()
    
    sub_nodes = []
    sub_rels = []
    sub_node_ids = set()
    
    # 1. Add target nodes
    for node in full_graph["nodes"]:
        nid = node["properties"].get("id")
        if nid in node_ids:
            sub_nodes.append(node)
            sub_node_ids.add(nid)
            
    # 2. Add relationships connecting these target nodes
    for rel in full_graph["relationships"]:
        start, end = rel["start"], rel["end"]
        if start in sub_node_ids and end in sub_node_ids:
            sub_rels.append(rel)
            
    # 3. If there is only 1 matched node, expand to at most 3 direct neighbor relationships for clean context
    if len(sub_node_ids) == 1:
        target_id = list(sub_node_ids)[0]
        neighbor_count = 0
        for rel in full_graph["relationships"]:
            start, end = rel["start"], rel["end"]
            if start == target_id or end == target_id:
                other_id = end if start == target_id else start
                # Cap at 3 neighbors to avoid graph congestion
                if neighbor_count < 3:
                    for node in full_graph["nodes"]:
                        if node["properties"].get("id") == other_id:
                            if other_id not in sub_node_ids:
                                sub_nodes.append(node)
                                sub_node_ids.add(other_id)
                            sub_rels.append(rel)
                            neighbor_count += 1
                            break
                            
    # 4. Filter duplicates
    unique_rels = []
    seen_rels = set()
    for r in sub_rels:
        rel_key = f"{r['start']}-{r['end']}-{r['type']}"
        if rel_key not in seen_rels:
            seen_rels.add(rel_key)
            unique_rels.append(r)
            
    return {
        "nodes": sub_nodes,
        "relationships": unique_rels
    }
