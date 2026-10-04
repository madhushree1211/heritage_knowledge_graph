import type { HeritageNode } from "../types";
import { Scale, Trash2, ArrowRightLeft } from "lucide-react";
import { t } from "../services/localization";
import type { Language } from "../services/localization";

interface ComparisonPageProps {
  compareList: HeritageNode[];
  onRemoveFromCompare: (nodeId: string) => void;
  onSelectSuggestion: (ids: string[]) => void;
  lang: Language;
}

export default function ComparisonPage({
  compareList,
  onRemoveFromCompare,
  onSelectSuggestion,
  lang
}: ComparisonPageProps) {
  const getCompareValue = (node: HeritageNode, field: string): string => {
    const props = node.properties;
    const nodeId = node.id || props.id || "";
    
    switch (field) {
      case "period":
        return props.period || (lang === "ta" ? "சோழர் காலம் (கி.பி. 11 ஆம் நூற்றாண்டு)" : lang === "hi" ? "चोल काल (11वीं सदी ईस्वी)" : "Chola Period (11th c. CE)");
      case "location":
        return props.location && props.district
          ? `${props.location}, ${props.district}`
          : (lang === "ta" ? "தென்னிந்தியா" : lang === "hi" ? "दक्षिण भारत" : "South India");
      case "ruler":
        if (nodeId === "brihadisvara") return lang === "ta" ? "முதலாம் ராஜராஜ சோழன்" : lang === "hi" ? "राजराज चोल प्रथम" : "Rajaraja Chola I";
        if (nodeId === "gangaikonda_cholapuram") return lang === "ta" ? "முதலாம் ராஜேந்திர சோழன்" : lang === "hi" ? "राजेंद्र चोल प्रथम" : "Rajendra Chola I";
        if (nodeId === "airavatesvara") return lang === "ta" ? "இரண்டாம் ராஜராஜ சோழன்" : lang === "hi" ? "राजराज चोल द्वितीय" : "Rajaraja Chola II";
        if (nodeId === "shore_temple" || nodeId === "kailasanathar") return lang === "ta" ? "இரண்டாம் நரசிம்மவர்மன் (ராஜசிம்மன்)" : lang === "hi" ? "नरसिंहवर्मन द्वितीय (राजसिंह)" : "Narasimhavarman II (Rajasimha)";
        return props.ruler || (lang === "ta" ? "அறியப்படவில்லை" : lang === "hi" ? "अज्ञात" : "Unknown");
      case "deity":
        return props.deity || (lang === "ta" ? "சிவன்" : lang === "hi" ? "शिव" : "Shiva");
      case "style":
        return lang === "ta" ? "திராவிடக் கட்டிடக்கலை" : lang === "hi" ? "द्रविड़ वास्तुकला" : "Dravidian Architecture";
      case "features":
        if (nodeId === "brihadisvara") {
          return lang === "ta" ? "216 அடி உயர விமானம், முழு கிரானைட் கட்டுமானம், தஞ்சை கல்வெட்டுகள்" : 
                 lang === "hi" ? "216 फीट ऊंचा विमान, पूर्ण ग्रेनाइट, तंजौर शिलालेख" : 
                 "216-foot Vimana, granite, Thanjavur Inscriptions";
        }
        if (nodeId === "gangaikonda_cholapuram") {
          return lang === "ta" ? "182 அடி வளைந்த விமானம், மென்மையான பெண்மை வடிவ வளைவுகள்" : 
                 lang === "hi" ? "182 फीट घुमावदार विमान, नारीत्व रूप की वक्रता" : 
                 "182-foot curved Vimana, feminine lines";
        }
        if (nodeId === "airavatesvara") {
          return lang === "ta" ? "பாடும் படிகள், குதிரை-யானை இழுக்கும் தேர் வடிவிலான மண்டபம்" : 
                 lang === "hi" ? "संगीतमय सीढ़ियाँ, घोड़ों और हाथियों द्वारा खींचा जाने वाला रथ मंडप" : 
                 "Singing steps, horse-chariot Mandapa";
        }
        if (nodeId === "shore_temple") {
          return lang === "ta" ? "கடற்கரை முகம், கிரானைட் கற்றளி மற்றும் ரத வடிவம்" : 
                 lang === "hi" ? "समुद्र तट के सामने, ग्रेनाइट संरचनात्मक रथ शैली" : 
                 "Beach front, granite structural ratha style";
        }
        if (nodeId === "kailasanathar") {
          return lang === "ta" ? "மணற்கல் கட்டமைப்பு, காஞ்சியின் பழமையான கற்கோயில்" : 
                 lang === "hi" ? "बलुआ पत्थर की संरचना, कांची का सबसे पुराना संरचनात्मक मंदिर" : 
                 "Sandstone structure, oldest structural Kanchi temple";
        }
        return props.features || (lang === "ta" ? "தூண் மண்டபம், கோபுரம்" : lang === "hi" ? "स्तंभों वाला मंडप, गोपुरम" : "Pillared Mandapa, Gopuram");
      case "status":
        return props.heritage_status || (lang === "ta" ? "பாதுகாக்கப்பட்ட பாரம்பரிய சின்னம்" : lang === "hi" ? "संरक्षित विरासत स्थल" : "Protected Heritage Site");
      case "source":
        return props.source || (lang === "ta" ? "தொல்லியல் துறை ஆவணம்" : lang === "hi" ? "पुरातत्व विभाग रिकॉर्ड" : "Verified Archive Record");
      default:
        return "Not Mapped";
    }
  };

  const fields = [
    { key: "period", label: lang === "ta" ? "வரலாற்றுக் காலம்" : lang === "hi" ? "ऐतिहासिक काल" : "Historical Period" },
    { key: "location", label: lang === "ta" ? "இருப்பிடம்" : lang === "hi" ? "भौगोलिक स्थिति" : "Geographic Location" },
    { key: "ruler", label: lang === "ta" ? "கட்டிய மன்னர்" : lang === "hi" ? "निर्माता (शासक)" : "Commissioned By (Ruler)" },
    { key: "deity", label: lang === "ta" ? "மூலவர் தெய்வம்" : lang === "hi" ? "मुख्य देवता" : "Primary Deity" },
    { key: "style", label: lang === "ta" ? "கட்டடக்கலை பாணி" : lang === "hi" ? "वास्तुकला शैली" : "Architectural Style" },
    { key: "features", label: lang === "ta" ? "முக்கிய சிறப்பம்சங்கள்" : lang === "hi" ? "मुख्य विशेषताएं" : "Signature Feature(s)" },
    { key: "status", label: lang === "ta" ? "பாரம்பரிய நிலை" : lang === "hi" ? "विरासत की स्थिति" : "Heritage Status" },
    { key: "source", label: lang === "ta" ? "சரிபார்க்கப்பட்ட ஆதாரம்" : lang === "hi" ? "सत्यापित स्रोत" : "Verified Source Record" },
  ];

  const suggestions = [
    {
      title: lang === "ta" ? "சோழர் காலக் கலைப் படைப்புகள்" : lang === "hi" ? "चोल काल की उत्कृष्ट कृतियाँ" : "Chola Masterpieces",
      ids: ["brihadisvara", "airavatesvara"],
      desc: "Brihadisvara vs Airavatesvara"
    },
    {
      title: lang === "ta" ? "தந்தை - மகன் மரபுகள்" : lang === "hi" ? "पिता और पुत्र की विरासत" : "Father & Son Legacies",
      ids: ["brihadisvara", "gangaikonda_cholapuram"],
      desc: "Thanjavur vs Gangaikonda"
    },
    {
      title: lang === "ta" ? "பல்லவர் காலக் கோயில்கள்" : lang === "hi" ? "पल्लव राजवंश के मंदिर" : "Pallava Dynastic Shrines",
      ids: ["shore_temple", "kailasanathar"],
      desc: "Shore Temple vs Kailasanathar"
    }
  ];

  if (compareList.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-cyber-bg/20 border border-cyber-border rounded-xl transition-colors duration-200">
        <Scale className="w-16 h-16 text-purple-500/40 mb-4 animate-pulse-slow" />
        <h3 className="text-lg font-bold text-gray-100 mb-2">{t("compare.title", lang)}</h3>
        <p className="text-sm text-gray-400 max-w-md text-center mb-6 font-sans">
          {t("compare.placeholder_desc", lang)}
        </p>

        <div className="w-full max-w-lg font-sans">
          <div className="text-xs uppercase font-mono tracking-widest font-semibold text-purple-400 mb-3 text-center">
            {t("compare.suggestions", lang)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(sug.ids)}
                className="flex flex-col items-center justify-center p-4 bg-cyber-card border border-cyber-border rounded-xl hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all text-center cursor-pointer"
              >
                <ArrowRightLeft className="w-5 h-5 text-purple-400 mb-2" />
                <span className="text-xs font-bold text-gray-200">{sug.title}</span>
                <span className="text-[10px] text-gray-400 mt-1">{sug.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-2xl transition-colors duration-200">
      {/* Header bar */}
      <div className="p-4 border-b border-cyber-border bg-cyber-bg/50 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-purple-400" />
          <h2 className="font-bold text-gray-100 font-serif">{t("compare.title", lang)}</h2>
        </div>
        <span className="text-xs text-gray-400 font-medium font-sans">
          {lang === "ta" ? `ஒப்பிடுதல்: ${compareList.length} கோயில்கள் (அதிகபட்சம் 3)` : 
           lang === "hi" ? `तुलना: ${compareList.length} मंदिर (अधिकतम 3)` : 
           `Comparing ${compareList.length} entities (Maximum 3)`}
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[600px] font-sans">
          <thead>
            <tr className="border-b border-cyber-border bg-cyber-bg/30">
              <th className="p-4 text-xs uppercase tracking-wider font-semibold font-mono text-purple-400 w-1/4">
                {t("compare.table_attr", lang)}
              </th>
              {compareList.map(node => (
                <th key={node.id} className="p-4 w-1/3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-200 text-sm">{node.properties.name}</div>
                      <div className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 font-bold">
                        {node.label}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCompare(node.id)}
                      className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => (
              <tr
                key={field.key}
                className={`border-b border-cyber-border/40 hover:bg-cyber-border/10 transition-colors ${
                  idx % 2 === 0 ? "bg-cyber-card" : "bg-cyber-bg/10"
                }`}
              >
                <td className="p-4 font-semibold text-xs text-gray-400 font-mono">
                  {field.label}
                </td>
                {compareList.map(node => (
                  <td key={node.id} className="p-4 text-xs text-gray-300 leading-relaxed">
                    {getCompareValue(node, field.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
