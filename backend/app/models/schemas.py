from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SearchRequest(BaseModel):
    query: str = Field(..., description="The natural-language search query, e.g. 'Temples commissioned by Rajaraja Chola I'")
    lang: Optional[str] = Field("en", description="The language to generate response in ('en', 'ta', 'hi')")

class SearchResponse(BaseModel):
    answer: str = Field(..., description="The grounded, natural language RAG answer")
    matched_entities: List[Dict[str, Any]] = Field(default=[], description="List of matched heritage nodes")
    sources: List[str] = Field(default=[], description="Sources backing up the answer")
    graph: Dict[str, Any] = Field(..., description="A localized subgraph of matched entities and their direct relationships")
    explanation: str = Field(default="", description="Explainable search feedback: why this was matched")

class QueryRequest(BaseModel):
    cypher: str = Field(..., description="Cypher query statement to execute")

class CompareRequest(BaseModel):
    site_ids: List[str] = Field(..., description="List of site IDs to compare")
