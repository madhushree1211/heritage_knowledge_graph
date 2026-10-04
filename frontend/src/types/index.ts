export interface HeritageNode {
  id: string;
  label: string; // Node type: Temple, Person, Dynasty, etc.
  properties: {
    id: string;
    name: string;
    description?: string;
    alternate_names?: string[];
    location?: string;
    district?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    deity?: string;
    heritage_status?: string;
    source?: string;
    title?: string;
    reign_period?: string;
    period?: string;
    start_year?: string;
    end_year?: string;
    language?: string;
    script?: string;
    date?: string;
    image_url?: string;
    ruler?: string;
    features?: string;
    [key: string]: any;
  };
  // Optional physics properties for visualization
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  score?: number;
  match_reason?: string;
}

export interface HeritageRelationship {
  start: string;
  end: string;
  type: string;
}

export interface Subgraph {
  nodes: HeritageNode[];
  relationships: HeritageRelationship[];
}

export interface SearchResponse {
  answer: string;
  matched_entities: HeritageNode[];
  sources: string[];
  graph: Subgraph;
  explanation: string;
}
