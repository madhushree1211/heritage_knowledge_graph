import re
import json
import networkx as nx
from typing import Dict, List, Any, Tuple, Set

class LocalGraphEngine:
    def __init__(self, data_path: str = None):
        self.graph = nx.MultiDiGraph()
        self.nodes_by_id: Dict[str, Dict[str, Any]] = {}
        # Keep an index of nodes by label
        self.nodes_by_label: Dict[str, Set[str]] = {}
        if data_path:
            self.load_from_json(data_path)

    def add_node(self, node_id: str, label: str, properties: Dict[str, Any]):
        self.nodes_by_id[node_id] = {
            "id": node_id,
            "label": label,
            "properties": properties
        }
        if label not in self.nodes_by_label:
            self.nodes_by_label[label] = set()
        self.nodes_by_label[label].add(node_id)
        self.graph.add_node(node_id, label=label, **properties)

    def add_edge(self, start_id: str, end_id: str, edge_type: str, properties: Dict[str, Any] = None):
        if not properties:
            properties = {}
        self.graph.add_edge(start_id, end_id, key=edge_type, type=edge_type, **properties)

    def load_from_json(self, json_path: str):
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Load nodes
            for node_data in data.get("nodes", []):
                node_type = node_data.get("type")
                props = node_data.get("properties", {})
                node_id = props.get("id")
                if node_id:
                    self.add_node(node_id, node_type, props)
                    
            # Load edges
            for edge_data in data.get("relationships", []):
                start = edge_data.get("start")
                end = edge_data.get("end")
                rel_type = edge_data.get("type")
                if start and end and rel_type:
                    self.add_edge(start, end, rel_type)
        except Exception as e:
            print(f"Error loading local graph from JSON: {e}")

    def get_node(self, node_id: str) -> Dict[str, Any]:
        return self.nodes_by_id.get(node_id)

    def query(self, cypher_query: str) -> List[Dict[str, Any]]:
        """
        Executes a simple subset of Cypher queries locally.
        Supported patterns:
        - MATCH (n:Label) RETURN n
        - MATCH (a:LabelA)-[:REL_TYPE]->(b:LabelB) [WHERE a.prop = 'val'] RETURN a, b
        - MATCH (a)-[r]->(b) WHERE a.id = 'val' RETURN a, r, b
        - MATCH (a)-[:REL_TYPE]->(b) WHERE a.name = 'val' RETURN b
        - MATCH path = (a)-[*..3]-(b) WHERE a.id = 'val' AND b.id = 'val' RETURN path
        """
        # Clean query whitespace
        query = re.sub(r'\s+', ' ', cypher_query).strip()
        
        # 1. Path search: MATCH path = (a)-[*..3]-(b)
        path_match = re.search(
            r'MATCH\s+path\s*=\s*\(([^)]+)\)-\[\*\.\.(\d+)\]-\(([^)]+)\)\s+WHERE\s+(.+?)\s+RETURN\s+path', 
            query, 
            re.IGNORECASE
        )
        if path_match:
            var_a, max_depth, var_b, where_clause = path_match.groups()
            max_depth = int(max_depth)
            
            # Extract IDs from where clause
            # e.g., a.id = "rajaraja_chola_i" AND b.id = "brihadisvara"
            id_a_match = re.search(r'\b' + re.escape(var_a) + r'\.(id|name)\s*=\s*["\']([^"\']+)["\']', where_clause)
            id_b_match = re.search(r'\b' + re.escape(var_b) + r'\.(id|name)\s*=\s*["\']([^"\']+)["\']', where_clause)
            
            if id_a_match and id_b_match:
                key_a, val_a = id_a_match.groups()
                key_b, val_b = id_b_match.groups()
                
                # Resolve nodes
                start_nodes = self._find_nodes_by_prop(key_a, val_a)
                end_nodes = self._find_nodes_by_prop(key_b, val_b)
                
                results = []
                for start in start_nodes:
                    for end in end_nodes:
                        # Find simple paths (convert graph to undirected for matching relationship paths)
                        undirected_graph = self.graph.to_undirected()
                        try:
                            paths = nx.all_simple_paths(undirected_graph, start, end, cutoff=max_depth)
                            for p in paths:
                                path_nodes = []
                                path_edges = []
                                for i in range(len(p)):
                                    path_nodes.append(self.nodes_by_id[p[i]])
                                    if i < len(p) - 1:
                                        # Find edge in original graph
                                        u, v = p[i], p[i+1]
                                        # Edge could be u->v or v->u
                                        edge_data = None
                                        if self.graph.has_edge(u, v):
                                            for k, data in self.graph[u][v].items():
                                                edge_data = {"start": u, "end": v, "type": k}
                                                break
                                        elif self.graph.has_edge(v, u):
                                            for k, data in self.graph[v][u].items():
                                                edge_data = {"start": v, "end": u, "type": k}
                                                break
                                        if edge_data:
                                            path_edges.append(edge_data)
                                results.append({
                                    "path": {
                                        "nodes": path_nodes,
                                        "relationships": path_edges
                                    }
                                })
                        except Exception as e:
                            print(f"Pathfinding error: {e}")
                return results

        # 2. MATCH (n:Label) RETURN n
        simple_match = re.search(r'MATCH\s+\(([^)]+):([^)]+)\)\s+RETURN\s+(\1)', query, re.IGNORECASE)
        if simple_match:
            var_name = simple_match.group(1)
            label = simple_match.group(2)
            results = []
            node_ids = self.nodes_by_label.get(label, set())
            for nid in node_ids:
                results.append({var_name: self.nodes_by_id[nid]})
            return results

        # 3. MATCH (a:LabelA)-[:REL_TYPE]->(b:LabelB) [WHERE ...] RETURN a, b
        edge_match = re.search(
            r'MATCH\s+\(([^:]+):?([^)]*)\)-\[:([^\]]+)\]->\(([^:]+):?([^)]*)\)(?:\s+WHERE\s+(.+?))?\s+RETURN\s+(.+)',
            query,
            re.IGNORECASE
        )
        if edge_match:
            var_a, label_a, rel_type, var_b, label_b, where_clause, return_clause = edge_match.groups()
            return_vars = [v.strip() for v in return_clause.split(',')]
            
            results = []
            # Iterate through all edges
            for u, v, key, data in self.graph.edges(keys=True, data=True):
                # Filter by edge type
                if key != rel_type:
                    continue
                
                node_a = self.nodes_by_id.get(u)
                node_b = self.nodes_by_id.get(v)
                if not node_a or not node_b:
                    continue
                
                # Filter by labels if specified
                if label_a and node_a["label"] != label_a:
                    continue
                if label_b and node_b["label"] != label_b:
                    continue
                
                # Check WHERE conditions if present
                matched = True
                if where_clause:
                    matched = self._eval_where(where_clause, {var_a: node_a, var_b: node_b})
                
                if matched:
                    res_row = {}
                    if var_a in return_vars:
                        res_row[var_a] = node_a
                    if var_b in return_vars:
                        res_row[var_b] = node_b
                    # Support returning edge type/properties
                    results.append(res_row)
            return results

        # 4. MATCH (a)-[r]->(b) WHERE a.id = 'val' RETURN a, r, b
        star_match = re.search(
            r'MATCH\s+\(([^)]+)\)-\[([^\]]+)\]->\(([^)]+)\)\s+WHERE\s+(.+?)\s+RETURN\s+(.+)',
            query,
            re.IGNORECASE
        )
        if star_match:
            var_a, var_r, var_b, where_clause, return_clause = star_match.groups()
            return_vars = [v.strip() for v in return_clause.split(',')]
            
            results = []
            # Extract id to narrow search
            id_a_match = re.search(r'\b' + re.escape(var_a) + r'\.id\s*=\s*["\']([^"\']+)["\']', where_clause)
            id_b_match = re.search(r'\b' + re.escape(var_b) + r'\.id\s*=\s*["\']([^"\']+)["\']', where_clause)
            
            search_edges = []
            if id_a_match:
                node_id = id_a_match.group(1)
                if self.graph.has_node(node_id):
                    # Outgoing edges from node_id
                    for u, v, key, data in self.graph.out_edges(node_id, keys=True, data=True):
                        search_edges.append((u, v, key, data))
            elif id_b_match:
                node_id = id_b_match.group(1)
                if self.graph.has_node(node_id):
                    # Incoming edges to node_id
                    for u, v, key, data in self.graph.in_edges(node_id, keys=True, data=True):
                        search_edges.append((u, v, key, data))
            else:
                search_edges = list(self.graph.edges(keys=True, data=True))
                
            for u, v, key, data in search_edges:
                node_a = self.nodes_by_id.get(u)
                node_b = self.nodes_by_id.get(v)
                if not node_a or not node_b:
                    continue
                
                # Check WHERE conditions
                matched = self._eval_where(where_clause, {var_a: node_a, var_b: node_b})
                
                if matched:
                    res_row = {}
                    if var_a in return_vars:
                        res_row[var_a] = node_a
                    if var_b in return_vars:
                        res_row[var_b] = node_b
                    if var_r in return_vars:
                        res_row[var_r] = {"type": key, "start": u, "end": v}
                    results.append(res_row)
            return results

        # 5. MATCH (a) WHERE a.id IN [...] RETURN a
        in_match = re.search(
            r'MATCH\s+\(([^)]+)\)\s+WHERE\s+(\1)\.id\s+IN\s+\[(.*?)\]\s+RETURN\s+(\1)',
            query,
            re.IGNORECASE
        )
        if in_match:
            var_a, _, ids_str, _ = in_match.groups()
            ids = [i.strip(' "\'') for i in ids_str.split(',')]
            results = []
            for nid in ids:
                node = self.nodes_by_id.get(nid)
                if node:
                    results.append({var_a: node})
            return results

        # Empty fallback
        return []

    def _find_nodes_by_prop(self, prop_name: str, value: str) -> List[str]:
        results = []
        for nid, node in self.nodes_by_id.items():
            if prop_name == "id" and nid == value:
                results.append(nid)
            elif prop_name == "name" and node["properties"].get("name") == value:
                results.append(nid)
            elif prop_name == "name" and value in node["properties"].get("alternate_names", []):
                results.append(nid)
        return results

    def _eval_where(self, where_clause: str, context: Dict[str, Any]) -> bool:
        # Evaluates simple where clauses like:
        # a.id = "val" AND b.state = "state"
        # Support operations: = (equals), IN (list)
        conjunctions = re.split(r'\s+AND\s+', where_clause, flags=re.IGNORECASE)
        
        for conj in conjunctions:
            conj = conj.strip()
            # 1. Equals: var.prop = "val"
            eq_match = re.match(r'([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s*=\s*["\']([^"\']+)["\']', conj)
            if eq_match:
                var, prop, val = eq_match.groups()
                node = context.get(var)
                if not node:
                    return False
                # check properties
                actual_val = node.get(prop) if prop in ["id", "label"] else node["properties"].get(prop)
                if actual_val != val:
                    # check alternate names
                    if prop == "name" and val in node["properties"].get("alternate_names", []):
                        pass
                    else:
                        return False
                continue
                
            # 2. IN list: var.id IN ["a", "b"]
            in_match = re.match(r'([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\s+IN\s+\[(.*?)\]', conj, re.IGNORECASE)
            if in_match:
                var, prop, list_str = in_match.groups()
                vals = [v.strip(' "\'') for v in list_str.split(',')]
                node = context.get(var)
                if not node:
                    return False
                actual_val = node.get(prop) if prop in ["id", "label"] else node["properties"].get(prop)
                if actual_val not in vals:
                    return False
                continue
                
        return True
