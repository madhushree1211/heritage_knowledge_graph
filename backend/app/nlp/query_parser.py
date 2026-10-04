import os
import re
from typing import Dict, Any, List, Tuple, Optional
import google.generativeai as genai
from openai import OpenAI

class QueryParser:
    def __init__(self):
        # Configure APIs if available
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
        self.openai_client = OpenAI(api_key=self.openai_key) if self.openai_key else None

        # Known entities for deterministic matching
        self.known_temples = {
            "brihadisvara": ["brihadisvara", "brihadeeswarar", "brihadeeswara", "peruvudaiyar kovil", "rajarajeswaram", "thanjavur temple"],
            "gangaikonda_cholapuram": ["gangaikonda cholapuram", "brihadisvara temple of gangaikondacholapuram", "gangaikondacholapuram"],
            "airavatesvara": ["airavatesvara", "darasuram temple", "darasuram"],
            "shore_temple": ["shore temple", "mamallapuram shore temple"],
            "kailasanathar": ["kailasanathar", "kanchi kailasanathar"],
            "meenakshi_amman": ["meenakshi amman", "meenakshi sundareswarar", "madurai meenakshi", "meenakshi temple"],
            "ranganathaswamy": ["ranganathaswamy", "srirangam kovil", "srirangam temple", "srirangam"]
        }
        
        self.known_persons = {
            "rajaraja_chola_i": ["rajaraja chola i", "rajaraja chola", "rajaraja i", "rajaraja"],
            "rajendra_chola_i": ["rajendra chola i", "rajendra chola", "rajendra i", "rajendra"],
            "rajaraja_chola_ii": ["rajaraja chola ii", "rajaraja ii"],
            "narasimhavarman_ii": ["narasimhavarman ii", "narasimhavarman", "rajasimha"]
        }

        self.known_dynasties = {
            "chola_dynasty": ["chola dynasty", "chola", "cholas"],
            "pallava_dynasty": ["pallava dynasty", "pallava", "pallavas"],
            "pandya_dynasty": ["pandya dynasty", "pandya", "pandyas"]
        }

        self.known_features = {
            "vimana": ["vimana", "vimanas", "temple tower", "tower over sanctum"],
            "gopuram": ["gopuram", "gopurams", "gateway tower"],
            "mandapa": ["mandapa", "mandapas", "pillared hall"],
            "monolithic_ratha": ["monolithic ratha", "ratha", "chariot"]
        }

        self.known_locations = {
            "thanjavur": ["thanjavur", "tanjore"],
            "gangaikonda_cholapuram_loc": ["gangaikonda cholapuram"],
            "darasuram": ["darasuram"],
            "mamallapuram": ["mamallapuram", "mahabalipuram"],
            "kanchipuram": ["kanchipuram", "conjeevaram"],
            "madurai": ["madurai"],
            "srirangam": ["srirangam"]
        }

    def parse(self, text: str) -> Dict[str, Any]:
        """
        Parses a natural-language query. If LLM is available, queries the LLM.
        Otherwise (or on failure), falls back to deterministic rule-based parsing.
        """
        text_lower = text.lower().strip()
        
        # Try LLM first if configured
        if self.gemini_key or self.openai_key:
            try:
                return self._parse_with_llm(text)
            except Exception as e:
                print(f"LLM Query parsing failed: {e}. Falling back to rule-based parser.")
                
        # Rule-based parser
        return self._parse_with_rules(text_lower)

    def _parse_with_rules(self, query: str) -> Dict[str, Any]:
        """
        Deterministic parser that scans keywords to identify intents, mapped entities, 
        and dynamically construct the most precise Cypher query.
        """
        result = {
            "intent": "ENTITY_SEARCH",
            "entities": [],
            "cypher": "",
            "explanation": "",
            "comparison": False
        }
        
        # Identify all known entities in query
        found_temples = []
        for tid, aliases in self.known_temples.items():
            if any(alias in query for alias in aliases):
                found_temples.append(tid)
                
        found_persons = []
        for pid, aliases in self.known_persons.items():
            if any(alias in query for alias in aliases):
                found_persons.append(pid)
                
        found_dynasties = []
        for did, aliases in self.known_dynasties.items():
            if any(alias in query for alias in aliases):
                found_dynasties.append(did)
                
        found_locations = []
        for lid, aliases in self.known_locations.items():
            if any(alias in query for alias in aliases):
                found_locations.append(lid)
                
        found_features = []
        for fid, aliases in self.known_features.items():
            if any(alias in query for alias in aliases):
                found_features.append(fid)

        # 1. Comparison Intent
        if "compare" in query or "comparison" in query or len(found_temples) > 1:
            matched = found_temples if found_temples else ["brihadisvara", "airavatesvara"]
            result["intent"] = "COMPARISON"
            result["comparison"] = True
            result["entities"] = matched
            list_str = ", ".join([f"'{t}'" for t in matched])
            result["cypher"] = f"MATCH (t:Temple) WHERE t.id IN [{list_str}] RETURN t"
            result["explanation"] = f"Comparing architectural aspects of: {', '.join([t.replace('_', ' ').title() for t in matched])}"
            return result

        # 2. Multi-hop / Relationship between two matched entities
        all_found_ids = found_temples + found_persons + found_dynasties + found_locations
        if len(all_found_ids) >= 2:
            id1, id2 = all_found_ids[0], all_found_ids[1]
            result["intent"] = "MULTI-HOP_RELATIONSHIP_SEARCH"
            result["entities"] = [id1, id2]
            # Cypher path search matching either labeled node
            result["cypher"] = f"MATCH path = (n1)-[*..3]-(n2) WHERE n1.id = '{id1}' AND n2.id = '{id2}' RETURN path"
            result["explanation"] = f"Traversing relationship path between {id1.replace('_', ' ').title()} and {id2.replace('_', ' ').title()}."
            return result

        # 3. Dedicated to / deity search
        if "deity" in query or "lord" in query or "god" in query or "shiva" in query or "vishnu" in query:
            deity = "shiva"
            if "vishnu" in query or "ranganatha" in query:
                deity = "vishnu"
            elif "meenakshi" in query or "parvati" in query:
                deity = "meenakshi"
            result["intent"] = "ENTITY_SEARCH"
            result["cypher"] = f"MATCH (t:Temple)-[r:DEDICATED_TO]->(d:Deity) WHERE d.id = '{deity}' OR t.deity = '{deity.title()}' RETURN t, r, d"
            result["explanation"] = f"Finding temples dedicated to the deity {deity.title()}."
            return result

        # 4. Commissioned by Rulers
        if found_persons:
            pid = found_persons[0]
            result["intent"] = "PERSON_SEARCH"
            result["entities"] = [pid]
            result["cypher"] = f"MATCH (t:Temple)-[r:COMMISSIONED_BY]->(p:Person) WHERE p.id = '{pid}' RETURN t, r, p"
            result["explanation"] = f"Locating temples commissioned by the ruler {pid.replace('_', ' ').title()}."
            return result

        # 5. Associated with Dynasties
        if found_dynasties:
            did = found_dynasties[0]
            result["intent"] = "DYNASTY_SEARCH"
            result["entities"] = [did]
            result["cypher"] = f"MATCH (t:Temple)-[r1:ASSOCIATED_WITH_DYNASTY]->(d:Dynasty) MATCH (t)-[r2:BUILT_DURING]->(p:HistoricalPeriod) WHERE d.id = '{did}' RETURN t, r1, d, r2, p"
            result["explanation"] = f"Retrieving cultural sites built by or associated with the {did.replace('_', ' ').title()}."
            return result

        # 6. Located in specific locations
        if found_locations:
            lid = found_locations[0]
            result["intent"] = "LOCATION_SEARCH"
            result["entities"] = [lid]
            result["cypher"] = f"MATCH (t:Temple)-[r:LOCATED_IN]->(l:Location) WHERE l.id = '{lid}' OR t.location = '{lid.replace('_loc', '').title()}' RETURN t, r, l"
            result["explanation"] = f"Searching for temples situated in or around {lid.replace('_loc', '').replace('_', ' ').title()}."
            return result

        # 7. Architectural features (vimana, gopuram, etc)
        if found_features:
            fid = found_features[0]
            result["intent"] = "ARCHITECTURAL_SEARCH"
            result["entities"] = [fid]
            result["cypher"] = f"MATCH (t:Temple)-[r:HAS_ARCHITECTURAL_FEATURE]->(f:ArchitecturalFeature) WHERE f.id = '{fid}' RETURN t, r, f"
            result["explanation"] = f"Searching for temple structures featuring a {fid.title()}."
            return result

        # 8. Inscription specific lookups
        if "inscription" in query or "records" in query or "copper" in query:
            result["intent"] = "ENTITY_SEARCH"
            result["cypher"] = "MATCH (t:Temple)-[r:HAS_INSCRIPTION]->(i:Inscription) RETURN t, r, i"
            result["explanation"] = "Retrieving temple epigraphical and copper-plate inscriptions."
            return result

        # 9. Architectural style lookups (Dravidian, rock cut, etc)
        if "architecture" in query or "style" in query or "design" in query:
            result["intent"] = "ARCHITECTURAL_SEARCH"
            result["cypher"] = "MATCH (t:Temple)-[r1:HAS_ARCHITECTURAL_STYLE]->(s:ArchitecturalStyle) MATCH (t)-[r2:HAS_ARCHITECTURAL_FEATURE]->(f:ArchitecturalFeature) RETURN t, r1, s, r2, f"
            result["explanation"] = "Retrieving South Indian architectural styles and features."
            return result

        # 10. Fallback Temple lookup
        if found_temples:
            tid = found_temples[0]
            result["intent"] = "ENTITY_SEARCH"
            result["entities"] = [tid]
            result["cypher"] = f"MATCH (t:Temple)-[r]->(b) WHERE t.id = '{tid}' RETURN t, r, b"
            result["explanation"] = f"Traversing graph connections for the {tid.replace('_', ' ').title()}."
            return result

        # Default fallback: Search all temples
        result["cypher"] = "MATCH (t:Temple) RETURN t"
        result["explanation"] = "Searching cultural heritage temples in Tamil Nadu."
        return result

    def _parse_with_llm(self, query: str) -> Dict[str, Any]:
        """
        Asks the LLM to analyze the natural-language query and return JSON.
        """
        system_prompt = """You are the NLP Query Parser for a Tamil Nadu Cultural Heritage Knowledge Graph.
Your task is to analyze the user's natural language question and output a JSON object with:
- "intent": One of ["ENTITY_SEARCH", "RELATIONSHIP_SEARCH", "LOCATION_SEARCH", "HISTORICAL_PERIOD_SEARCH", "ARCHITECTURAL_SEARCH", "PERSON_SEARCH", "DYNASTY_SEARCH", "COMPARISON", "MULTI-HOP_RELATIONSHIP_SEARCH"]
- "entities": A list of canonical entity IDs identified in the text (e.g., ["brihadisvara", "rajaraja_chola_i"])
- "cypher": A valid Cypher read-only query matching the schema below.
- "explanation": A brief user-friendly text of what we are querying.
- "comparison": Boolean indicating if this is a comparison request.

Allowed Schema:
- Nodes:
  (:Temple {id, name, alternate_names, description, location, district, state, latitude, longitude, deity, heritage_status, source})
  (:Person {id, name, title, reign_period, description, source})
  (:Dynasty {id, name, period, description, source})
  (:HistoricalPeriod {id, name, start_year, end_year, description, source})
  (:Location {id, name, district, state, latitude, longitude, source})
  (:ArchitecturalStyle {id, name, description, source})
  (:ArchitecturalFeature {id, name, description, source})
  (:Deity {id, name, description, source})
  (:Inscription {id, name, language, script, date, description, source})
  (:HistoricalEvent {id, name, date, description, source})

- Relationships:
  (:Temple)-[:LOCATED_IN]->(:Location)
  (:Temple)-[:BUILT_DURING]->(:HistoricalPeriod)
  (:Temple)-[:ASSOCIATED_WITH_DYNASTY]->(:Dynasty)
  (:Temple)-[:COMMISSIONED_BY]->(:Person)
  (:Person)-[:RULED_BY]->(:Dynasty)
  (:Temple)-[:DEDICATED_TO]->(:Deity)
  (:Temple)-[:HAS_ARCHITECTURAL_STYLE]->(:ArchitecturalStyle)
  (:Temple)-[:HAS_ARCHITECTURAL_FEATURE]->(:ArchitecturalFeature)
  (:Temple)-[:HAS_INSCRIPTION]->(:Inscription)
  (:Person)-[:ASSOCIATED_WITH_EVENT]->(:HistoricalEvent)
  (:Location)-[:NEAR]->(:Location)

Rule:
- Return ONLY valid JSON in your response. No markdown formatting.
- Ensure the Cypher is read-only (MATCH and RETURN, no MERGE, CREATE, or DELETE).
"""
        
        prompt = f"User Question: \"{query}\"\nParse and generate Cypher query:"
        
        if self.gemini_key:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(
                contents=prompt,
                config=genai.types.GenerationConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json"
                )
            )
            # parse JSON response
            import json
            return json.loads(response.text.strip())
            
        elif self.openai_client:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            import json
            return json.loads(response.choices[0].message.content.strip())

        raise RuntimeError("No LLM clients configured.")
