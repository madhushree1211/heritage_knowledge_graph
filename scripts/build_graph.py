import os
import sys
import json
from dotenv import load_dotenv

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.app.graph.db_client import GraphDatabaseClient

load_dotenv()

def build_knowledge_graph():
    print("Starting Knowledge Graph Ingestion and Build Pipeline...")
    
    # Load raw sample dataset
    data_path = os.path.join("data", "sample", "tamil_nadu_heritage.json")
    if not os.path.exists(data_path):
        print(f"Error: Raw sample dataset not found at {data_path}")
        return
        
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"Loaded {len(data.get('nodes', []))} nodes and {len(data.get('relationships', []))} relationships.")

    client = GraphDatabaseClient(data_path)
    
    if client.use_neo4j:
        print("Real Neo4j DB detected. Populating Neo4j graph...")
        # Clear existing DB
        print("Clearing existing Neo4j graph...")
        client.query("MATCH (n) DETACH DELETE n")
        
        # Create constraints and indexes
        print("Creating Neo4j constraints & indexes...")
        try:
            # Neo4j 4.x/5.x syntax for unique constraint
            client.query("CREATE CONSTRAINT unique_node_id IF NOT EXISTS FOR (n:Temple) REQUIRE n.id IS UNIQUE")
            client.query("CREATE CONSTRAINT unique_person_id IF NOT EXISTS FOR (n:Person) REQUIRE n.id IS UNIQUE")
            client.query("CREATE CONSTRAINT unique_dynasty_id IF NOT EXISTS FOR (n:Dynasty) REQUIRE n.id IS UNIQUE")
        except Exception as e:
            print(f"Warning during constraint creation (might already exist or syntax mismatch): {e}")

        # Ingest nodes
        print("Ingesting nodes...")
        for node in data.get("nodes", []):
            label = node["type"]
            props = node["properties"]
            
            # Formulate query
            # We use apoc or standard cypher set
            prop_keys = ", ".join([f"{k}: ${k}" for k in props.keys()])
            cypher = f"CREATE (n:{label} {{{prop_keys}}})"
            client.query(cypher, props)
            
        # Ingest relationships
        print("Ingesting relationships...")
        for rel in data.get("relationships", []):
            start = rel["start"]
            end = rel["end"]
            rel_type = rel["type"]
            
            # Find nodes and link them
            cypher = f"""
            MATCH (a) WHERE a.id = $start
            MATCH (b) WHERE b.id = $end
            CREATE (a)-[r:{rel_type}]->(b)
            """
            client.query(cypher, {"start": start, "end": end})
            
        print("Ingestion into Neo4j completed successfully!")
    else:
        print("Local graph engine in use. Verification complete! Data is correctly parsed and loaded.")
        
    client.close()

if __name__ == "__main__":
    build_knowledge_graph()
