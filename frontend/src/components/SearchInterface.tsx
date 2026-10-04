import { useState } from "react";
import { Search, Loader2, Sparkles, BookOpen, Route, AlertCircle } from "lucide-react";
import { search } from "../services/api";
import type { HeritageNode, SearchResponse } from "../types";
import GraphVisualizer from "./GraphVisualizer";
import { t, translateNode, translateSubgraph } from "../services/localization";
import type { Language } from "../services/localization";

const HERITAGE_IMAGES: Record<string, string> = {
  brihadisvara: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Brihadeeswarar_Temple_Full_View.jpg",
  gangaikonda_cholapuram: "https://upload.wikimedia.org/wikipedia/commons/4/48/GangaiKonda_Cholapuram%28Front_View%29.JPG",
  airavatesvara: "https://upload.wikimedia.org/wikipedia/commons/9/98/Airavatesvara_Temple_full_view.jpg",
  shore_temple: "https://upload.wikimedia.org/wikipedia/commons/4/44/Shore_Temple%2C_Mahabalipuram.jpg",
  kailasanathar: "https://upload.wikimedia.org/wikipedia/commons/3/32/Kailasanathar_Temple._Kanchipuram%2C_TamilNadu.jpg",
  meenakshi_amman: "https://upload.wikimedia.org/wikipedia/commons/3/32/Madurai_Meenakshi_Amman_Temple_Gopuram.jpg",
  ranganathaswamy: "https://upload.wikimedia.org/wikipedia/commons/7/75/Srirangam-Rajagopuram-1.jpg",
  
  // Rulers
  rajaraja_chola_i: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Rajaraja_mural.jpg",
  rajendra_chola_i: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Ardhanari_Gangaikonda.jpg",
  rajaraja_chola_ii: "https://upload.wikimedia.org/wikipedia/commons/9/98/Airavatesvara_Temple_full_view.jpg",
  narasimhavarman_ii: "https://upload.wikimedia.org/wikipedia/commons/4/44/Shore_Temple%2C_Mahabalipuram.jpg",
  
  // Dynasties
  chola_dynasty: "https://upload.wikimedia.org/wikipedia/commons/b/be/Chola_symbol_of_tiger.jpg",
  pallava_dynasty: "https://upload.wikimedia.org/wikipedia/commons/3/32/Kailasanathar_Temple._Kanchipuram%2C_TamilNadu.jpg",
  pandya_dynasty: "https://upload.wikimedia.org/wikipedia/commons/9/91/Goddess_Meenakshi_Wedding.JPG",
  
  // Locations
  thanjavur: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Brihadeeswarar_Temple_Full_View.jpg",
  gangaikonda_cholapuram_loc: "https://upload.wikimedia.org/wikipedia/commons/4/48/GangaiKonda_Cholapuram%28Front_View%29.JPG",
  darasuram: "https://upload.wikimedia.org/wikipedia/commons/9/98/Airavatesvara_Temple_full_view.jpg",
  mamallapuram: "https://upload.wikimedia.org/wikipedia/commons/a/af/Arjuna%27s_Penance_-_Mamallapuram.jpg",
  kanchipuram: "https://upload.wikimedia.org/wikipedia/commons/3/32/Kailasanathar_Temple._Kanchipuram%2C_TamilNadu.jpg",
  madurai: "https://upload.wikimedia.org/wikipedia/commons/3/32/Madurai_Meenakshi_Amman_Temple_Gopuram.jpg",
  srirangam: "https://upload.wikimedia.org/wikipedia/commons/7/75/Srirangam-Rajagopuram-1.jpg",
  
  koodal_azhagar: "https://upload.wikimedia.org/wikipedia/commons/3/32/Madurai_Meenakshi_Amman_Temple_Gopuram.jpg",
  vaikunta_perumal_uttiramerur: "https://upload.wikimedia.org/wikipedia/commons/3/32/Kailasanathar_Temple._Kanchipuram%2C_TamilNadu.jpg"
};

interface SearchInterfaceProps {
  onNodeClick: (node: HeritageNode) => void;
  addLog: (msg: string) => void;
  lang: Language;
}

export default function SearchInterface({
  onNodeClick,
  addLog,
  lang
}: SearchInterfaceProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);

  const handleEntityJump = (entityId: string) => {
    // Fake node search payload to trigger details overlay directly
    onNodeClick({
      id: entityId,
      label: "Person",
      properties: { name: entityId.replace(/_/g, " ").toUpperCase(), id: entityId }
    });
  };

  // Render lineage/dynasty flowchart if requested (Chola / Pallava rulers hierarchy)
  const renderVisualContext = (q: string, res: SearchResponse) => {
    const qLower = q.toLowerCase();
    
    // Only display dynamic flowcharts if explicitly looking up dynastic lineage/family
    const isDynastySearch = qLower.includes("family") || qLower.includes("dynasty") || qLower.includes("lineage") || qLower.includes("succession") || qLower.includes("வம்சம்") || qLower.includes("वंश");
    
    if (isDynastySearch && (qLower.includes("chola") || qLower.includes("சோழ"))) {
      const builtMonTitle = lang === "ta" ? "கட்டிய கோயில்:" : lang === "hi" ? "निर्मित स्मारक:" : "Built monument:";
      const sonTitle = lang === "ta" ? "↓ (மகன் & வாரிசு)" : lang === "hi" ? "↓ (पुत्र और उत्तराधिकारी)" : "↓ (Son & Heir)";
      const successorTitle = lang === "ta" ? "↓ (பிற்கால வாரிசு)" : lang === "hi" ? "↓ (बाद का उत्तराधिकारी)" : "↓ (Later Successor)";

      return (
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-2xl space-y-4">
          <div className="border-b border-cyber-border pb-2">
            <h3 className="font-bold text-gray-100 text-sm font-serif">
              {lang === "ta" ? "சோழ வம்ச பரம்பரை விளக்கப்படம்" : lang === "hi" ? "चोल राजवंश वंशावली चार्ट" : "Chola Dynasty Lineage Flowchart"}
            </h3>
            <p className="text-[10px] text-gray-400">
              {lang === "ta" ? "பெரிய கோயில் கட்டிய முக்கிய சோழ மன்னர்களின் காலவரிசை:" : lang === "hi" ? "महान मंदिरों का निर्माण कराने वाले चोल शासकों का कालक्रम:" : "Chronological succession of major Chola rulers who built great living temples:"}
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-2 max-w-md mx-auto">
            {/* Box 1 */}
            <div className="w-full bg-cyber-bg/60 border border-cyber-border rounded-lg p-3 hover:border-cyan-500/30 transition-colors flex items-center justify-between">
              <div>
                <div className="text-[8px] uppercase tracking-wider font-mono text-cyan-400 font-bold">
                  {lang === "ta" ? "மன்னர் (கி.பி. 985 - 1014)" : lang === "hi" ? "शासक (985 - 1014 ईस्वी)" : "Ruler (985 - 1014 CE)"}
                </div>
                <div className="text-xs font-bold text-gray-200">
                  {lang === "ta" ? "முதலாம் ராஜராஜ சோழன்" : lang === "hi" ? "राजराज चोल प्रथम" : "Rajaraja Chola I"}
                </div>
                <div className="text-[9px] text-gray-400 font-medium">
                  {lang === "ta" ? "சோழப் பேரரசை விரிவுபடுத்தியவர், தஞ்சை பெரிய கோயிலைக் கட்டினார்." : lang === "hi" ? "साम्राज्य का विस्तार किया, बृहदीश्वर मंदिर का निर्माण कराया।" : "Expanded the empire, built the grand Thanjavur Brihadisvara Temple."}
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <img src={HERITAGE_IMAGES.brihadisvara} className="w-10 h-8 object-cover rounded border border-cyber-border/40" />
                <div className="flex flex-col items-end">
                  <span className="text-[7px] uppercase font-mono text-yellow-500 font-bold">{builtMonTitle}</span>
                  <span className="text-[10px] text-yellow-400 hover:underline cursor-pointer font-bold" onClick={() => handleEntityJump("brihadisvara")}>
                    {lang === "ta" ? "பிரகதீஸ்வரர் 🛕" : lang === "hi" ? "बृहदीश्वर 🛕" : "Brihadisvara 🛕"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-cyan-400 text-xs animate-pulse">{sonTitle}</div>
            
            {/* Box 2 */}
            <div className="w-full bg-cyber-bg/60 border border-cyber-border rounded-lg p-3 hover:border-cyan-500/30 transition-colors flex items-center justify-between">
              <div>
                <div className="text-[8px] uppercase tracking-wider font-mono text-cyan-400 font-bold">
                  {lang === "ta" ? "மன்னர் (கி.பி. 1014 - 1044)" : lang === "hi" ? "शासक (1014 - 1044 ईस्वी)" : "Ruler (1014 - 1044 CE)"}
                </div>
                <div className="text-xs font-bold text-gray-200">
                  {lang === "ta" ? "முதலாம் ராஜேந்திர சோழன்" : lang === "hi" ? "राजेंद्र चोल प्रथम" : "Rajendra Chola I"}
                </div>
                <div className="text-[9px] text-gray-400 font-medium">
                  {lang === "ta" ? "கங்கை மற்றும் கடாரம் வரை வென்றவர், கங்கைகொண்ட சோழபுரத்தைக் கட்டினார்." : lang === "hi" ? "गंगा और सुमात्रा पर विजय प्राप्त की, गंगैकोंडचोलपुरम का निर्माण कराया।" : "Captured Ganges & Sumatra, built Gangaikonda Cholapuram Temple."}
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <img src={HERITAGE_IMAGES.gangaikonda_cholapuram} className="w-10 h-8 object-cover rounded border border-cyber-border/40" />
                <div className="flex flex-col items-end">
                  <span className="text-[7px] uppercase font-mono text-yellow-500 font-bold">{builtMonTitle}</span>
                  <span className="text-[10px] text-yellow-400 hover:underline cursor-pointer font-bold" onClick={() => handleEntityJump("gangaikonda_cholapuram")}>
                    {lang === "ta" ? "கங்கைகொண்ட 🛕" : lang === "hi" ? "गंगैकोंडा 🛕" : "Gangaikonda 🛕"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-cyan-400 text-xs animate-pulse">{successorTitle}</div>
            
            {/* Box 3 */}
            <div className="w-full bg-cyber-bg/60 border border-cyber-border rounded-lg p-3 hover:border-cyan-500/30 transition-colors flex items-center justify-between">
              <div>
                <div className="text-[8px] uppercase tracking-wider font-mono text-cyan-400 font-bold">
                  {lang === "ta" ? "மன்னர் (கி.பி. 1146 - 1173)" : lang === "hi" ? "शासक (1146 - 1173 ईस्वी)" : "Ruler (1146 - 1173 CE)"}
                </div>
                <div className="text-xs font-bold text-gray-200">
                  {lang === "ta" ? "இரண்டாம் ராஜராஜ சோழன்" : lang === "hi" ? "राजराज चोल द्वितीय" : "Rajaraja Chola II"}
                </div>
                <div className="text-[9px] text-gray-400 font-medium">
                  {lang === "ta" ? "தாராசுரம் ஐராவதேஸ்வரர் கோயிலைக் கட்டியவர், கலைகளின் ஆதரவாளர்." : lang === "hi" ? "दारासुरम में ऐरावतेश्वर मंदिर का निर्माण कराया, कला के संरक्षक थे।" : "Built Airavatesvara Temple in Darasuram, patron of stone carving."}
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <img src={HERITAGE_IMAGES.airavatesvara} className="w-10 h-8 object-cover rounded border border-cyber-border/40" />
                <div className="flex flex-col items-end">
                  <span className="text-[7px] uppercase font-mono text-yellow-500 font-bold">{builtMonTitle}</span>
                  <span className="text-[10px] text-yellow-400 hover:underline cursor-pointer font-bold" onClick={() => handleEntityJump("airavatesvara")}>
                    {lang === "ta" ? "ஐராவதேஸ்வரர் 🛕" : lang === "hi" ? "ऐरावतेश्वर 🛕" : "Airavatesvara 🛕"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // For all other queries (temples, places, etc.), render a visual profile card (NO flowcharts)
    const rawTarget = res.matched_entities.find(n => n.label === "Temple" || n.label === "Location" || n.label === "Person" || n.label === "Dynasty" || n.label === "கோவில்" || n.label === "இருப்பிடம்" || n.label === "मंदिर" || n.label === "स्थान");
    const targetNode = rawTarget ? translateNode(rawTarget, lang) : null;
    
    if (targetNode) {
      const props = targetNode.properties;
      const imageUrl = props.image_url || HERITAGE_IMAGES[targetNode.id] || (props.id ? HERITAGE_IMAGES[props.id] : undefined);
      
      return (
        <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-2xl space-y-4">
          <div className="border-b border-cyber-border pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400">🛕</span>
              <h3 className="font-bold text-gray-100 text-sm">{props.name}</h3>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-400 font-mono">{targetNode.label}</span>
          </div>

          {/* Banner Image */}
          {imageUrl && (
            <div className="w-full h-44 overflow-hidden rounded-lg border border-cyber-border/60 relative">
              <img src={imageUrl} alt={props.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] to-transparent opacity-60" />
            </div>
          )}

          {/* Short Description */}
          {props.description && (
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-semibold font-mono tracking-wider">{t("label.description", lang)}</div>
              <p className="text-xs text-gray-300 leading-relaxed text-justify bg-cyber-bg/40 p-3 rounded-lg border border-cyber-border/30">
                {props.description}
              </p>
            </div>
          )}

          {/* Coordinates Map Embed */}
          {props.latitude && props.longitude && (
            <div className="space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-semibold font-mono tracking-wider">{t("label.map_alignment", lang)}</div>
              <div className="w-full h-40 rounded-lg overflow-hidden border border-cyber-border/50 relative">
                <iframe
                  title="OpenStreetMap Search Live Coordinates Embed"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${props.longitude - 0.015}%2C${props.latitude - 0.015}%2C${props.longitude + 0.015}%2C${props.latitude + 0.015}&layer=mapnik&marker=${props.latitude}%2C${props.longitude}`}
                  className="grayscale-[30%] invert-[90%] hue-rotate-180 brightness-[85%] border-0"
                />
              </div>
              <div className="text-[8px] font-mono text-gray-500 text-right">
                OSM Coordinates: {props.latitude}° N, {props.longitude}° E
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  const parseCitations = (text: string): React.ReactNode => {
    const regex = /\[([^\]]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const citationText = match[1];
      parts.push(
        <span 
          key={match.index} 
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded text-[8px] font-bold font-mono tracking-wider bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 select-all hover:bg-cyan-900/60 transition-colors"
          title="Grounded graph source verified"
        >
          {citationText}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const sampleQueries = lang === "ta" ? [
    "சோழர் காலத்துடன் தொடர்புடைய தமிழ்நாட்டின் கோயில்கள் மற்றும் அவற்றின் கட்டடக்கலை பண்புகளைக் காட்டு.",
    "முதலாம் ராஜராஜ சோழனால் கட்டப்பட்ட கோயில்கள் எவை?",
    "தஞ்சாவூர் அருகிலுள்ள சோழர் கால கோயில்களைக் கண்டுபிடி.",
    "சோழர் கால கோயில்களில் பொதுவாகக் காணப்படும் கட்டடக்கலை சிறப்புகள் என்ன?",
    "முதலாம் ராஜேந்திர சோழனுடன் தொடர்புடைய கோயில்கள் எவை?",
    "முதலாம் ராஜராஜ சோழன், சோழ வம்சம் மற்றும் பிரகதீஸ்வரர் கோயிலுக்கு இடையிலான தொடர்பைக் காட்டு.",
    "பிரகதீஸ்வரர் கோயில் மற்றும் ஐராவதேஸ்வரர் கோயிலை ஒப்பிடுக.",
    "சோழர் கால கல்வெட்டுகள் கொண்ட வரலாற்றுச் சிறப்புமிக்க கோயில்கள் எவை?"
  ] : lang === "hi" ? [
    "चोल काल से जुड़े तमिलनाडु के मंदिरों और उनकी स्थापत्य विशेषताओं को दिखाएं।",
    "राजराज चोल प्रथम द्वारा किन मंदिरों का निर्माण कराया गया था?",
    "तंजौर के पास चोल मंदिरों को खोजें।",
    "चोल मंदिरों में कौन सी स्थापत्य विशेषताएं आम हैं?",
    "राजेंद्र चोल प्रथम से कौन से मंदिर जुड़े हैं?",
    "राजराज चोल प्रथम, चोल राजवंश और बृहदीश्वर मंदिर के बीच संबंध दिखाएं।",
    "बृहदीश्वर मंदिर और ऐरावतेश्वर मंदिर की तुलना करें।",
    "किन ऐतिहासिक मंदिरों में चोल काल से संबंधित शिलालेख हैं?"
  ] : [
    "Show temples in Tamil Nadu associated with the Chola period and identify their architectural characteristics.",
    "Which temples were commissioned by Rajaraja Chola I?",
    "Find Chola temples near Thanjavur.",
    "What architectural characteristics are common among Chola temples?",
    "Which temples are associated with Rajendra Chola I?",
    "Show the relationship between Rajaraja Chola I, the Chola dynasty, and Brihadisvara Temple.",
    "Compare Brihadisvara Temple and Airavatesvara Temple.",
    "Which historical temples have inscriptions related to the Chola period?"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    const startTime = Date.now();
    addLog(`Incoming Request: [POST] Query='${searchQuery}' Lang='${lang}'`);
    addLog("Step 1: NLP Intent & Entity extraction triggered...");

    try {
      const data = await search(searchQuery, lang);
      setResult(data);
      
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      addLog(`Step 2: Intent classified successfully: [${data.explanation || "SEARCH"}]`);
      addLog(`Step 3: Graph queried. Matched ${data.matched_entities.length} nodes & links.`);
      addLog(`Step 4: Answer generated with ${data.sources.length} citations.`);
      addLog(`Completed in ${elapsed}s. Hydrating visual components.`);
    } catch (err: any) {
      setError(err.message || "An error occurred during query execution.");
      addLog(`Error occurred: ${err.message || "Search failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Search form controls */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-6 shadow-2xl relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />
        <h2 className="text-xl font-bold text-gray-100 mb-2 flex items-center space-x-2 font-serif">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>{t("search.title", lang)}</span>
        </h2>
        <p className="text-xs text-gray-400 mb-4 max-w-2xl font-sans">
          {t("search.subtitle", lang)}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex space-x-2 font-sans"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder", lang)}
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg py-3 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg text-sm flex items-center space-x-2 shadow-md shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === "ta" ? "தேடுகிறது..." : lang === "hi" ? "खोज रहा है..." : "Searching..."}</span>
              </>
            ) : (
              <span>{t("search.button", lang)}</span>
            )}
          </button>
        </form>

        {/* Suggestion pill buttons */}
        <div className="mt-4 font-sans">
          <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-500/80 mb-2">
            {t("search.suggestions", lang)}
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {sampleQueries.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearch(s)}
                className="bg-cyber-bg/50 border border-cyber-border/80 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 text-xs px-2.5 py-1.5 rounded-md text-left transition-all max-w-xs md:max-w-md truncate cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="flex items-center justify-center p-12 bg-cyber-card border border-cyber-border rounded-xl transition-colors duration-200">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <div className="text-xs font-mono text-gray-400 text-center animate-pulse">
              <p>{lang === "ta" ? "வரலாற்று கல்வெட்டுகள் மற்றும் அறிவு வரைபடத்தை ஆய்வு செய்கிறது..." : lang === "hi" ? "ऐतिहासिक शिलालेखों और ज्ञान ग्राफ का विश्लेषण कर रहा है..." : "Analyzing historical inscriptions and Knowledge Graph topology..."}</p>
              <p className="text-[10px] text-gray-500 mt-1">{lang === "ta" ? "நிலையான RAG பதிலைப் பெறுகிறது" : lang === "hi" ? "सत्यापित RAG प्रतिक्रिया प्राप्त की जा रही है" : "Generating grounded RAG response"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Query Execution Error display container */}
      {error && (
        <div className="bg-red-950/20 border border-red-500/40 rounded-xl p-5 flex items-start space-x-3 text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm font-serif">{lang === "ta" ? "தேடல் தோல்வி" : lang === "hi" ? "खोज विफल रही" : "Query Execution Failed"}</h3>
            <p className="text-xs text-red-300/80 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Search results content layout grid */}
      {!loading && !error && result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left: AI Grounded Answer + Matched entities */}
          <div className="flex flex-col space-y-4">
            <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-2xl space-y-4 transition-colors duration-200">
              <div className="border-b border-cyber-border pb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 font-serif">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-gray-100 text-sm">
                    {lang === "ta" ? "சரிபார்க்கப்பட்ட RAG பதில்" : lang === "hi" ? "सत्यापित RAG उत्तर" : "Grounded RAG Response"}
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Grounded Context</span>
              </div>
              
              <div className="text-xs text-gray-300 leading-relaxed text-justify space-y-3 font-sans prose prose-invert max-w-none">
                {parseCitations(result.answer)}
              </div>

              {/* Source listings */}
              {result.sources && result.sources.length > 0 && (
                <div className="border-t border-cyber-border/40 pt-3 mt-3">
                  <div className="text-[9px] uppercase font-bold tracking-widest text-cyan-500 mb-1.5">
                    {t("label.provenance", lang)}
                  </div>
                  <ul className="space-y-1">
                    {result.sources.map((src, i) => (
                      <li key={i} className="text-[9px] text-gray-400 font-mono flex items-center space-x-1.5">
                        <span className="text-cyan-500">📎</span>
                        <span>[Source {i + 1}]: {src}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Matched Entities list */}
            {result.matched_entities && result.matched_entities.length > 0 && (
              <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-2xl space-y-3 transition-colors duration-200">
                <div className="border-b border-cyber-border pb-2">
                  <h3 className="font-bold text-gray-100 text-xs font-serif">
                    {lang === "ta" ? "மீட்டெடுக்கப்பட்ட வரலாற்று உருப்படிகள்" : lang === "hi" ? "पुनर्प्राप्त ऐतिहासिक संस्थाएं" : "Retrieved Historical Entities"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {result.matched_entities.map((node) => {
                    const translatedNode = translateNode(node, lang);
                    return (
                      <div
                        key={translatedNode.id}
                        onClick={() => onNodeClick(node)}
                        className="p-3 bg-cyber-bg/40 border border-cyber-border rounded-lg hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {node.label === "Temple" && "🛕"}
                            {node.label === "Person" && "👑"}
                            {node.label === "Dynasty" && "🛡️"}
                            {node.label === "Location" && "📍"}
                            {node.label === "Inscription" && "📜"}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-gray-200">{translatedNode.properties.name}</h4>
                            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-wider">{translatedNode.label}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-gray-500">
                          {translatedNode.properties.location || translatedNode.properties.period || "South India"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explainable match logic container */}
            {result.explanation && (
              <div className="bg-cyber-card/60 border border-cyber-border rounded-xl p-4 flex items-start space-x-3 transition-colors duration-200">
                <Route className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-cyan-400">
                    {t("search.explain_header", lang)}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{result.explanation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Detailed understandable visualizing output */}
          <div className="flex flex-col space-y-4">
            {renderVisualContext(query, result)}

            {/* Localized sub-graph visualizer showing matching query nodes and relationships */}
            {result.graph && result.graph.nodes && result.graph.nodes.length > 0 && (
              <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 shadow-2xl space-y-3 transition-colors duration-200">
                <div className="border-b border-cyber-border pb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-serif">
                    <span className="text-cyan-400">🕸️</span>
                    <h3 className="font-bold text-gray-100 text-sm">{t("search.graph_title", lang)}</h3>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">{t("search.graph_badge", lang)}</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  {t("search.graph_desc", lang)}
                </p>
                <div className="h-[250px] relative rounded-lg overflow-hidden border border-cyber-border/40 bg-cyber-bg/60">
                  <GraphVisualizer
                    graph={translateSubgraph(result.graph, lang)}
                    onNodeClick={onNodeClick}
                    width={400}
                    height={250}
                    showLegend={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
