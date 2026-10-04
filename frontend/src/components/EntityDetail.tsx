import type { HeritageNode } from "../types";
import { X, Calendar, MapPin, Landmark, Scroll, Heart, ArrowRightLeft, Sparkles, BookOpen } from "lucide-react";
import { t } from "../services/localization";
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

interface EntityDetailProps {
  node: HeritageNode;
  onClose: () => void;
  onCompareToggle: (nodeId: string) => void;
  isInCompareList: boolean;
  onLocateInGraph?: (nodeId: string) => void;
  lang?: Language;
}

export default function EntityDetail({
  node,
  onClose,
  onCompareToggle,
  isInCompareList,
  onLocateInGraph,
  lang = "en"
}: EntityDetailProps) {
  const props = node.properties;
  const label = node.label;
  const imageUrl = HERITAGE_IMAGES[node.id] || (props.id ? HERITAGE_IMAGES[props.id] : undefined);

  const renderDetailField = (icon: React.ReactNode, labelText: string, value?: string | number | string[]) => {
    if (!value) return null;
    const displayVal = Array.isArray(value) ? value.join(", ") : value;
    return (
      <div className="flex items-start space-x-3 p-2 bg-cyber-bg/30 border border-cyber-border/40 rounded-lg hover:border-cyan-500/20 transition-colors">
        <div className="text-cyan-400 mt-0.5">{icon}</div>
        <div className="flex-1">
          <div className="text-[10px] text-gray-500 uppercase font-semibold font-mono tracking-wider">{labelText}</div>
          <div className="text-sm text-gray-300 font-medium">{displayVal}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-cyber-card border border-cyber-border rounded-xl flex flex-col shadow-2xl relative overflow-hidden transition-colors duration-200">
      {/* Detail Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-border bg-cyber-bg/50 transition-colors duration-200">
        <div className="flex items-center space-x-2">
          <span className="text-xl">
            {label.includes("கோவில்") || label.includes("मंदिर") || label === "Temple" ? "🛕" : ""}
            {label.includes("மன்னர்") || label.includes("शासक") || label === "Person" ? "👑" : ""}
            {label.includes("வம்சம்") || label.includes("राजवंश") || label === "Dynasty" ? "🛡️" : ""}
            {label.includes("இருப்பிடம்") || label.includes("स्थान") || label === "Location" ? "📍" : ""}
            {label.includes("கல்வெட்டு") || label.includes("शिलालेख") || label === "Inscription" ? "📜" : ""}
            {label.includes("நிகழ்வு") || label.includes("घटना") || label === "HistoricalEvent" ? "⚔️" : ""}
          </span>
          <div>
            <h3 className="font-bold text-gray-100 leading-tight">{props.name}</h3>
            <span className="text-[9px] uppercase tracking-widest font-bold text-cyan-400 font-mono">{label}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-cyan-400 hover:bg-cyber-border/50 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image Banner */}
      {imageUrl && (
        <div className="w-full h-44 overflow-hidden border-b border-cyber-border relative flex-shrink-0">
          <img src={imageUrl} alt={props.name} className="w-full h-full object-cover animate-fade-in" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] to-transparent opacity-60" />
        </div>
      )}

      {/* Detail Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {/* Entity Match Reason */}
        {node.match_reason && (
          <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-lg flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-cyan-300/80 leading-relaxed font-mono">
              <span className="text-cyan-400 font-bold">MATCH EXPLANATION:</span> {node.match_reason}
            </div>
          </div>
        )}

        {/* Node description */}
        {props.description && (
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500 uppercase font-semibold font-mono tracking-wider">{t("label.description", lang)}</div>
            <p className="text-xs text-gray-300 leading-relaxed text-justify bg-cyber-bg/20 p-3 rounded-lg border border-cyber-border/30">
              {props.description}
            </p>
          </div>
        )}

        {/* Geographic Embed Map */}
        {props.latitude && props.longitude && (
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500 uppercase font-semibold font-mono tracking-wider">{t("label.map_alignment", lang)}</div>
            <div className="w-full h-40 rounded-lg overflow-hidden border border-cyber-border/50 relative">
              <iframe
                title="OpenStreetMap Live Coordinates Embed"
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

        {/* Metadata grid based on Node label */}
        <div className="space-y-2">
          {/* Temple properties */}
          {(label === "Temple" || label === "கோவில்" || label === "मंदिर") && (
            <>
              {renderDetailField(<MapPin className="w-4 h-4" />, lang === "ta" ? "இருப்பிடம்" : lang === "hi" ? "स्थान" : "Location", props.location)}
              {renderDetailField(<Heart className="w-4 h-4" />, lang === "ta" ? "முதன்மைக் கடவுள்" : lang === "hi" ? "मुख्य देवता" : "Primary Deity", props.deity)}
              {renderDetailField(<Landmark className="w-4 h-4" />, lang === "ta" ? "பாரம்பரிய நிலை" : lang === "hi" ? "विरासत की स्थिति" : "Heritage Status", props.heritage_status)}
              {renderDetailField(<Calendar className="w-4 h-4" />, lang === "ta" ? "அமைவிடம்" : lang === "hi" ? "निर्देशांक" : "Coordinates", props.latitude && props.longitude ? `${props.latitude}° N, ${props.longitude}° E` : undefined)}
              {renderDetailField(<Scroll className="w-4 h-4" />, lang === "ta" ? "மாற்றுப் பெயர்கள்" : lang === "hi" ? "वैकल्पिक नाम" : "Alternate Aliases", props.alternate_names)}
            </>
          )}

          {/* Person properties */}
          {(label === "Person" || label === "மன்னர்" || label === "शासक") && (
            <>
              {renderDetailField(<Calendar className="w-4 h-4" />, lang === "ta" ? "ஆட்சிக் காலம்" : lang === "hi" ? "शासन काल" : "Reign Period", props.reign_period)}
              {renderDetailField(<Landmark className="w-4 h-4" />, lang === "ta" ? "பட்டம்/விருது" : lang === "hi" ? "उपाधि" : "Title", props.title)}
            </>
          )}

          {/* Dynasty properties */}
          {(label === "Dynasty" || label === "வம்சம்" || label === "राजवंश") && (
            <>
              {renderDetailField(<Calendar className="w-4 h-4" />, lang === "ta" ? "வம்சத்தின் காலம்" : lang === "hi" ? "राजवंश की अवधि" : "Dynasty Duration", props.period)}
            </>
          )}

          {/* Historical Period properties */}
          {(label === "HistoricalPeriod" || label === "காலம்") && (
            <>
              {renderDetailField(<Calendar className="w-4 h-4" />, lang === "ta" ? "கால இடைவெளி" : lang === "hi" ? "समय अंतराल" : "Time Interval", `${props.start_year} CE - ${props.end_year} CE`)}
            </>
          )}

          {/* Inscriptions properties */}
          {(label === "Inscription" || label === "கல்வெட்டு" || label === "शिलालेख") && (
            <>
              {renderDetailField(<Scroll className="w-4 h-4" />, lang === "ta" ? "மொழி" : lang === "hi" ? "भाषा" : "Language", props.language)}
              {renderDetailField(<Scroll className="w-4 h-4" />, lang === "ta" ? "எழுத்து முறை" : lang === "hi" ? "लिपि शैली" : "Script Style", props.script)}
              {renderDetailField(<Calendar className="w-4 h-4" />, lang === "ta" ? "வரலாற்றுத் தேதி" : lang === "hi" ? "ऐतिहासिक तिथि" : "Historical Date", props.date)}
            </>
          )}
          
          {/* Historical Event properties */}
          {(label === "HistoricalEvent" || label === "வரலாற்று நிகழ்வு" || label === "ऐतिहासिक घटना") && (
            <>
              {renderDetailField(<Calendar className="w-4 h-4" />, lang === "ta" ? "நிகழ்ந்த தேதி" : lang === "hi" ? "घटना की तिथि" : "Event Date", props.date)}
            </>
          )}

          {props.source && renderDetailField(<BookOpen className="w-4 h-4" />, t("label.provenance", lang), props.source)}
        </div>
      </div>

      {/* Action panel footer */}
      <div className="p-4 border-t border-cyber-border bg-cyber-bg/50 grid grid-cols-2 gap-2 transition-colors duration-200">
        <button
          onClick={() => onCompareToggle(node.id)}
          className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
            isInCompareList
              ? "bg-purple-950/40 border-purple-500/50 text-purple-300 hover:bg-purple-900/40"
              : "bg-cyber-bg border-cyber-border text-gray-300 hover:text-purple-400 hover:border-purple-500/30"
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>{isInCompareList ? t("btn.compare_added", lang) : t("btn.compare_site", lang)}</span>
        </button>

        {onLocateInGraph && (
          <button
            onClick={() => onLocateInGraph(node.id)}
            className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wider transition-all duration-300 shadow-md shadow-cyan-500/10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t("btn.map", lang)}</span>
          </button>
        )}
      </div>
    </div>
  );
}
