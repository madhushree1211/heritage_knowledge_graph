import os
import sys
from typing import List, Dict, Any
from dotenv import load_dotenv

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)
from app.graph.local_graph import LocalGraphEngine

load_dotenv()

class GraphDatabaseClient:
    def __init__(self, data_path: str = None):
        self.neo4j_driver = None
        self.local_engine = None
        self.use_neo4j = False
        
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER")
        password = os.getenv("NEO4J_PASSWORD")
        
        if uri and user and password:
            try:
                from neo4j import GraphDatabase
                self.neo4j_driver = GraphDatabase.driver(uri, auth=(user, password))
                # Test connection
                self.neo4j_driver.verify_connectivity()
                self.use_neo4j = True
                print("Successfully connected to Neo4j database!")
            except Exception as e:
                print(f"Failed to connect to Neo4j: {e}. Falling back to local in-memory graph.")
                self.use_neo4j = False
        
        if not self.use_neo4j:
            # Locate default sample data if not provided
            if not data_path:
                project_root = os.path.dirname(backend_dir)
                data_path = os.path.join(project_root, "data", "sample", "tamil_nadu_heritage.json")
            
            print(f"Initializing LocalGraphEngine with data from: {data_path}")
            self.local_engine = LocalGraphEngine(data_path)

    def close(self):
        if self.neo4j_driver:
            self.neo4j_driver.close()

    def query(self, cypher_query: str, parameters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Executes Cypher queries either on Neo4j or on the LocalGraphEngine.
        """
        if not parameters:
            parameters = {}
            
        if self.use_neo4j:
            try:
                with self.neo4j_driver.session() as session:
                    result = session.run(cypher_query, parameters)
                    return [record.data() for record in result]
            except Exception as e:
                print(f"Neo4j query error: {e}. Retrying with local graph.")
                # Fallback to local if neo4j fails during execution
                if not self.local_engine:
                    current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
                    data_path = os.path.join(current_dir, "data", "sample", "tamil_nadu_heritage.json")
                    self.local_engine = LocalGraphEngine(data_path)
                return self.local_engine.query(cypher_query)
        else:
            # Inline parameter substitution for local engine (parameters are usually sparse in read queries)
            processed_query = cypher_query
            for k, v in parameters.items():
                if isinstance(v, str):
                    processed_query = processed_query.replace(f"${k}", f"'{v}'")
                elif isinstance(v, list):
                    list_str = ", ".join([f"'{item}'" for item in v])
                    processed_query = processed_query.replace(f"${k}", f"[{list_str}]")
                else:
                    processed_query = processed_query.replace(f"${k}", str(v))
            return self.local_engine.query(processed_query)

    def get_full_graph(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        Helper method to export the entire graph nodes and edges for visualization.
        """
        if self.use_neo4j:
            cypher = "MATCH (n)-[r]->(m) RETURN n, r, m"
            records = self.query(cypher)
            
            nodes = {}
            relationships = []
            
            for rec in records:
                n = rec.get("n", {})
                m = rec.get("m", {})
                r = rec.get("r", {})
                
                # Neo4j objects usually have 'id', 'labels', 'properties'
                # Let's extract properties and labels
                n_id = n.get("id") or n.element_id
                m_id = m.get("id") or m.element_id
                
                if n_id not in nodes:
                    nodes[n_id] = {
                        "id": n_id,
                        "label": list(n.labels)[0] if n.labels else "Unknown",
                        "properties": dict(n)
                    }
                if m_id not in nodes:
                    nodes[m_id] = {
                        "id": m_id,
                        "label": list(m.labels)[0] if m.labels else "Unknown",
                        "properties": dict(m)
                    }
                    
                relationships.append({
                    "start": n_id,
                    "end": m_id,
                    "type": r.type
                })
            
            # Add disconnected nodes
            unconnected = self.query("MATCH (n) WHERE NOT (n)--() RETURN n")
            for rec in unconnected:
                n = rec.get("n", {})
                n_id = n.get("id") or n.element_id
                if n_id not in nodes:
                    nodes[n_id] = {
                        "id": n_id,
                        "label": list(n.labels)[0] if n.labels else "Unknown",
                        "properties": dict(n)
                    }
            
            return {
                "nodes": list(nodes.values()),
                "relationships": relationships
            }
        else:
            nodes = list(self.local_engine.nodes_by_id.values())
            relationships = []
            for u, v, key in self.local_engine.graph.edges(keys=True):
                relationships.append({
                    "start": u,
                    "end": v,
                    "type": key
                })
            return {
                "nodes": nodes,
                "relationships": relationships
            }
