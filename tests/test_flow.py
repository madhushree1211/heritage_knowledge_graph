import os
import sys

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.graph.db_client import GraphDatabaseClient
from backend.app.nlp.query_parser import QueryParser
from backend.app.retrieval.hybrid_search import HybridSearchEngine
from backend.app.rag.answer_generator import AnswerGenerator

def run_tests():
    print("==================================================")
    print("Running Cultural Heritage Graph & Search Tests...")
    print("==================================================")
    
    # 1. DB Client Setup
    data_path = os.path.join("data", "sample", "tamil_nadu_heritage.json")
    client = GraphDatabaseClient(data_path)
    print(f"Graph initialized: {not client.use_neo4j} fallback local engine.")
    
    # 2. NLP Parser Verification
    parser = QueryParser()
    test_queries = [
        "Show temples in Tamil Nadu associated with the Chola period and identify their architectural characteristics.",
        "Which temples were commissioned by Rajaraja Chola I?",
        "Compare Brihadisvara Temple and Airavatesvara Temple.",
        "What is the relationship between Rajaraja Chola I, the Chola dynasty, and Brihadisvara Temple?"
    ]
    
    print("\nTesting NLP Query Parser:")
    for query in test_queries:
        parsed = parser.parse(query)
        print(f"\n[Raw Query]: {query}")
        print(f"  - Intent: {parsed['intent']}")
        print(f"  - Generated Cypher: {parsed['cypher']}")
        
    # 3. Hybrid Search Retrieval Verification
    print("\nTesting Hybrid Search Engine:")
    search_engine = HybridSearchEngine(client)
    results = search_engine.search("monumental vimana towers in chola period", limit=3)
    
    for r in results:
        node = r["node"]
        print(f"  - Node: {node['properties']['name']} ({node['label']}) | Score: {r['score']:.4f}")
        print(f"    Reason: {r['match_reason']}")
        
    # 4. RAG Answer Verification
    print("\nTesting RAG Answer Generator (Template Mode):")
    generator = AnswerGenerator(client)
    
    # Pick Rajaraja query
    q = "Which temples were commissioned by Rajaraja Chola I?"
    parsed = parser.parse(q)
    # Execute query
    graph_res = client.query(parsed["cypher"])
    retrieved = [{"node": r["t"]} for r in graph_res if "t" in r]
    
    ans = generator.generate(q, parsed, retrieved)
    print(f"\n[Query]: {q}")
    print(f"[Answer]:\n{ans['answer']}")
    print(f"[Sources]: {ans['sources']}")
    
    print("\n==================================================")
    print("All tests completed successfully!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
