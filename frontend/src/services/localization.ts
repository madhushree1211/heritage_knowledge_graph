import type { HeritageNode, Subgraph } from "../types";

export type Language = "en" | "ta" | "hi";

export const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation Tabs
  "tab.search": {
    en: "Semantic Search",
    ta: "முகப்பு தேடல்",
    hi: "समानार्थी खोज"
  },
  "tab.graph": {
    en: "Graph Explorer",
    ta: "வரைபட வரைவி",
    hi: "ग्राफ एक्सप्लोरर"
  },
  "tab.compare": {
    en: "Comparison",
    ta: "ஒப்பீடு",
    hi: "तुलना"
  },
  "tab.catalog": {
    en: "Heritage Catalog",
    ta: "பாரம்பரிய பட்டியல்",
    hi: "धरोहर सूची"
  },
  "tab.logs": {
    en: "System Logs",
    ta: "கணினி பதிவுகள்",
    hi: "सिस्टम लॉग्स"
  },
  // Main Headers & Titles
  "header.title": {
    en: "Tamil Nadu Cultural Heritage Archive",
    ta: "தமிழ்நாடு கலாச்சார பாரம்பரிய காப்பகம்",
    hi: "तमिलनाडु सांस्कृतिक विरासत पुरालेख"
  },
  "header.subtitle": {
    en: "Kaveri Delta Imperial Archive & Historical Knowledge Graph",
    ta: "காவிரி டெல்டா பேரரசு ஆவணக் காப்பகம் மற்றும் வரலாற்று அறிவு வரைபடம்",
    hi: "कावेरी डेल्टा इंपीरियल आर्काइव और ऐतिहासिक ज्ञान ग्राफ"
  },
  "header.db_status": {
    en: "DATABASE ENGINE:",
    ta: "தரவுத்தள இயந்திரம்:",
    hi: "डेटाबेस इंजन:"
  },
  // Search Screen
  "search.title": {
    en: "Historical & Cultural Heritage Search",
    ta: "வரலாற்று மற்றும் கலாச்சார பாரம்பரிய தேடல்",
    hi: "ऐतिहासिक और सांस्कृतिक विरासत खोज"
  },
  "search.subtitle": {
    en: "Query the Tamil Nadu historical archive using natural language. The system retrieves linked genealogical dynasties, epigraphical records, and temple coordinate maps.",
    ta: "இயற்கையான மொழியைப் பயன்படுத்தி வரலாற்று காப்பகத்தைத் தேடுங்கள். கணினி வம்சாவளிகள், கல்வெட்டு பதிவுகள் மற்றும் வரைபடங்களை மீட்டெடுக்கிறது.",
    hi: "प्राकृतिक भाषा का उपयोग करके ऐतिहासिक पुरालेख खोजें। सिस्टम राजवंशों, शिलालेख अभिलेखों और मानचित्रों को पुनर्प्राप्त करता है।"
  },
  "search.placeholder": {
    en: "Show temples in Tamil Nadu associated with the Chola period...",
    ta: "சோழர் காலத்துடன் தொடர்புடைய தமிழ்நாட்டின் கோயில்களைக் காட்டு...",
    hi: "चोल काल से जुड़े तमिलनाडु के मंदिरों को दिखाएं..."
  },
  "search.button": {
    en: "Search Archive",
    ta: "காப்பகம் தேடு",
    hi: "पुरालेख खोजें"
  },
  "search.suggestions": {
    en: "SUGGESTED HISTORICAL ENQUIRIES",
    ta: "பரிந்துரைக்கப்படும் வரலாற்று வினவல்கள்",
    hi: "सुझाए गए ऐतिहासिक प्रश्न"
  },
  "search.explain_header": {
    en: "Explainable AI Routing (Intent classified)",
    ta: "விளக்கக்கூடிய AI ரூட்டிங் (நோக்கம் வகைப்படுத்தப்பட்டுள்ளது)",
    hi: "व्याख्या करने योग्य AI रूटिंग (वर्गीकृत इरादा)"
  },
  "search.graph_title": {
    en: "Interactive Local Subgraph View",
    ta: "ஊடாடும் உள்ளூர் வரைபடக் காட்சி",
    hi: "इंटरैक्टिव स्थानीय उप-ग्राफ दृश्य"
  },
  "search.graph_desc": {
    en: "Visual mapping showing only the matching entities and direct connecting links retrieved for this query.",
    ta: "இந்தத் தேடலுக்கு மீட்டெடுக்கப்பட்ட தொடர்புடைய உருப்படிகள் மற்றும் அவற்றின் நேரடி இணைப்புகளைக் காட்டும் வரைபடம்.",
    hi: "इस खोज के लिए पुनर्प्राप्त प्रासंगिक संस्थाओं और उनके सीधे लिंक दिखाने वाला मानचित्र।"
  },
  "search.graph_badge": {
    en: "Query Relations",
    ta: "தேடல் உறவுகள்",
    hi: "खोज संबंध"
  },
  // Graph Explorer Screen
  "graph.title": {
    en: "Tamil Nadu Heritage Map",
    ta: "தமிழ்நாடு பாரம்பரிய வரைபடம்",
    hi: "तमिलनाडु विरासत मानचित्र"
  },
  "graph.subtitle": {
    en: "Visual network layout of historical entities. Drag nodes, zoom/pan, click nodes to view details, and double click or drag to reorganize relationships.",
    ta: "வரலாற்று உருப்படிகளின் காட்சி நெட்வொர்க் தளவமைப்பு. உருப்படிகளை இழுக்கவும், பெரிதாக்கவும், விவரங்களைக் காண கிளிக் செய்யவும்.",
    hi: "ऐतिहासिक संस्थाओं का दृश्य नेटवर्क लेआउट। विवरण देखने के लिए क्लिक करें, ज़ूम करें और खींचें।"
  },
  "graph.stats": {
    en: "Total Active: {nodes} Nodes, {links} Links",
    ta: "மொத்தம்: {nodes} உருப்படிகள், {links} இணைப்புகள்",
    hi: "कुल सक्रिय: {nodes} नोड्स, {links} लिंक"
  },
  "graph.legend": {
    en: "Entity Legend",
    ta: "உருப்படிகளின் விளக்கம்",
    hi: "संस्था स्पष्टीकरण"
  },
  // Comparison Screen
  "compare.title": {
    en: "Heritage Architectural Comparison",
    ta: "பாரம்பரிய கட்டடக்கலை ஒப்பீடு",
    hi: "धरोहर स्थापत्य तुलना"
  },
  "compare.subtitle": {
    en: "Select and analyze monument properties, vimana heights, and construction materials side-by-side from the knowledge graph.",
    ta: "கோயில்களின் பண்புகள், கோபுர உயரங்கள் மற்றும் கட்டுமானப் பொருட்களை அருகருகே ஒப்பிட்டுப் பாருங்கள்.",
    hi: "ज्ञान ग्राफ से एक साथ स्मारकों के गुणों, विमान की ऊंचाइयों और निर्माण सामग्री का विश्लेषण करें।"
  },
  "compare.placeholder_title": {
    en: "No Sites Selected for Comparison",
    ta: "ஒப்பீட்டிற்கு எந்தக் கோயிலும் தேர்ந்தெடுக்கப்படவில்லை",
    hi: "तुलना के लिए कोई साइट नहीं चुनी गई"
  },
  "compare.placeholder_desc": {
    en: "Add up to 3 heritage sites from the search results, graph explorer, or catalog directory to compare their features side-by-side.",
    ta: "ஒப்பீடு செய்யத் தேடல் முடிவுகள் அல்லது பட்டியலிலிருந்து 3 கோயில்கள் வரை சேர்க்கவும்.",
    hi: "उनकी विशेषताओं की तुलना करने के लिए खोज परिणामों या सूची से 3 विरासत साइटों को जोड़ें।"
  },
  "compare.suggestions": {
    en: "Suggested Comparisons",
    ta: "பரிந்துரைக்கப்படும் ஒப்பீடுகள்",
    hi: "सुझाए गए तुलना विकल्प"
  },
  "compare.table_attr": {
    en: "Attribute",
    ta: "பண்பு",
    hi: "विशेषता"
  },
  // Catalog Screen
  "catalog.title": {
    en: "Heritage Entity Directory",
    ta: "பாரம்பரிய உருப்படிகளின் அடைவு",
    hi: "धरोहर इकाई निर्देशिका"
  },
  "catalog.subtitle": {
    en: "Browse the complete list of verified nodes structured in our Tamil Nadu Cultural Heritage Knowledge Graph database.",
    ta: "நமது அறிவு வரைபடத் தரவுத்தளத்தில் உள்ள 35 சரிபார்க்கப்பட்ட உருப்படிகளின் முழுமையான பட்டியலை உலாவுக.",
    hi: "हमारे ज्ञान ग्राफ डेटाबेस में संरचित 35 सत्यापित नोड्स की पूरी सूची ब्राउज़ करें।"
  },
  // Logs Screen
  "logs.title": {
    en: "System Telemetry & Database Logs",
    ta: "கணினி டெலிமெட்ரி மற்றும் தரவுத்தள பதிவுகள்",
    hi: "सिस्टम टेलीमेट्री और डेटाबेस लॉग"
  },
  "logs.subtitle": {
    en: "Real-time telemetry showing natural language query parsing, intent classification, dynamic Cypher query statements, and Knowledge Graph execution traces.",
    ta: "வினவல் பாகுபடுத்தல், நோக்கம் வகைப்பாடு மற்றும் டைனமிக் சைஃபர் வினவல் பதிவுகளின் நிகழ்நேர டெலிமெட்ரி.",
    hi: "क्वेरी पार्सिंग, इरादा वर्गीकरण और डायनेमिक साइफर क्वेरी लॉग के वास्तविक समय टेलीमेट्री।"
  },
  "logs.empty": {
    en: "No telemetry data recorded. Execute search queries in the Semantic Search Console to see system logs here.",
    ta: "டெலிமெட்ரி தரவு எதுவும் பதிவு செய்யப்படவில்லை. கணினிப் பதிவுகளைக் காண தேடல் வினவலை இயக்கவும்.",
    hi: "कोई टेलीमेट्री डेटा रिकॉर्ड नहीं किया गया। सिस्टम लॉग देखने के लिए सर्च क्वेरी चलाएं।"
  },
  // General Buttons & Labels
  "btn.compare": {
    en: "Compare",
    ta: "ஒப்பிடு",
    hi: "तुलना करें"
  },
  "btn.added": {
    en: "Added",
    ta: "சேர்க்கப்பட்டது",
    hi: "जोड़ा गया"
  },
  "btn.map": {
    en: "Map Entity",
    ta: "வரைபடத்தில் காண்க",
    hi: "मानचित्र पर लाएं"
  },
  "btn.compare_site": {
    en: "Compare Site",
    ta: "கோயிலை ஒப்பிடு",
    hi: "साइट की तुलना करें"
  },
  "btn.compare_added": {
    en: "Compare (Added)",
    ta: "ஒப்பீடு (சேர்க்கப்பட்டது)",
    hi: "तुलना (जोड़ा गया)"
  },
  "btn.close": {
    en: "Close",
    ta: "மூடு",
    hi: "बंद करें"
  },
  "label.description": {
    en: "Description & History",
    ta: "விளக்கம் மற்றும் வரலாறு",
    hi: "विवरण और इतिहास"
  },
  "label.map_alignment": {
    en: "Geographic Map Alignment",
    ta: "புவியியல் வரைபட அமைப்பு",
    hi: "भौगोलिक मानचित्र संरेखण"
  },
  "label.provenance": {
    en: "Verified Provenance / Source",
    ta: "சரிபார்க்கப்பட்ட ஆதாரம்",
    hi: "सत्यापित स्रोत"
  },
  "label.no_details": {
    en: "Click on any node in the graph explorer, catalog, or search results to visualize its parameters.",
    ta: "விவரங்களைக் காண வரைபடம், பட்டியல் அல்லது தேடல் முடிவுகளில் ஏதேனும் ஒரு உருப்படியைக் கிளிக் செய்க.",
    hi: "विवरण देखने के लिए ग्राफ, कैटलॉग या खोज परिणामों में किसी भी नोड पर क्लिक करें।"
  },
  "label.inspect": {
    en: "Inspect Heritage Details",
    ta: "பாரம்பரிய விவரங்களை ஆய்வு செய்",
    hi: "विरासत विवरण का निरीक्षण करें"
  }
};

export const ENTITY_TRANSLATIONS: Record<string, {
  name: Record<Language, string>;
  description: Record<Language, string>;
  location?: Record<Language, string>;
  deity?: Record<Language, string>;
  heritage_status?: Record<Language, string>;
  title?: Record<Language, string>;
  reign_period?: Record<Language, string>;
  period?: Record<Language, string>;
  language?: Record<Language, string>;
  script?: Record<Language, string>;
}> = {
  // Temples
  brihadisvara: {
    name: {
      en: "Brihadisvara Temple",
      ta: "பிரகதீஸ்வரர் கோவில் (பெரிய கோவில்)",
      hi: "बृहदीश्वर मंदिर"
    },
    description: {
      en: "Commissioned by Emperor Rajaraja Chola I and completed in 1010 CE, this temple is a masterpiece of Dravidian architecture. It features a massive 216-foot vimana (temple tower) and is entirely built of granite. It is a UNESCO World Heritage Site.",
      ta: "முதலாம் ராஜராஜ சோழனால் கட்டப்பட்டு கி.பி. 1010 இல் முடிக்கப்பட்ட இந்த கோயில் திராவிட கட்டிடக்கலையின் உச்சமாகும். இது 216 அடி உயரமுள்ள பிரம்மாண்ட விமானத்தைக் கொண்டுள்ளது மற்றும் முழுவதும் கிரானைட் கல்லால் ஆனது. இது யுனெஸ்கோ உலக பாரம்பரிய சின்னமாகும்.",
      hi: "सम्राट राजराजा चोल प्रथम द्वारा कमीशन किया गया और 1010 ईस्वी में पूरा हुआ, यह मंदिर द्रविड़ वास्तुकला की उत्कृष्ट कृति है। इसमें 216 फीट ऊंचा विमान (मंदिर का टॉवर) है और यह पूरी तरह से ग्रेनाइट से बना है। यह यूनेस्को विश्व धरोहर स्थल है।"
    },
    deity: { en: "Shiva", ta: "சிவன்", hi: "शिव" },
    location: { en: "Thanjavur", ta: "தஞ்சாவூர்", hi: "तंजौर" },
    heritage_status: { en: "UNESCO World Heritage Site", ta: "யுனெஸ்கோ உலக பாரம்பரிய தளம்", hi: "यूनेस्को विश्व धरोहर स्थल" }
  },
  gangaikonda_cholapuram: {
    name: {
      en: "Gangaikonda Cholapuram Temple",
      ta: "கங்கை கொண்ட சோழபுரம் கோவில்",
      hi: "गंगैकोंडचोलपुरम मंदिर"
    },
    description: {
      en: "Built by Rajendra Chola I to commemorate his victorious military campaign to the Ganges River. Completed around 1035 CE, this Shiva temple features a 182-foot vimana with a feminine curvature, contrasting with the masculine straight lines of the Thanjavur temple.",
      ta: "ராஜேந்திர சோழனால் கங்கை நதி வரையிலான தனது வெற்றிகரமான இராணுவப் பயணத்தின் நினைவாகக் கட்டப்பட்டது. கி.பி. 1035 இல் முடிக்கப்பட்ட இக்கோயில் 182 அடி உயரமான வளைந்த கோபுரத்தைக் கொண்டுள்ளது.",
      hi: "राजेंद्र चोल प्रथम द्वारा गंगा नदी के सफल सैन्य अभियान की स्मृति में निर्मित। 1035 ईस्वी के आसपास पूरा हुआ, यह शिव मंदिर तंजौर मंदिर के सीधे रेखाओं के विपरीत नारीत्व वक्रता वाले 182 फीट ऊंचे विमान से सुसज्जित है।"
    },
    deity: { en: "Shiva", ta: "சிவன்", hi: "शिव" },
    location: { en: "Gangaikonda Cholapuram", ta: "கங்கைகொண்ட சோழபுரம்", hi: "गंगैकोंडचोलपुरम" },
    heritage_status: { en: "UNESCO World Heritage Site", ta: "யுனெஸ்கோ உலக பாரம்பரிய தளம்", hi: "यूनेस्को विश्व धरोहर स्थल" }
  },
  airavatesvara: {
    name: {
      en: "Airavatesvara Temple",
      ta: "ஐராவதேஸ்வரர் கோவில்",
      hi: "ऐरावतेश्वर मंदिर"
    },
    description: {
      en: "Commissioned by Rajaraja Chola II in the 12th century CE, this temple is renowned for its exquisite stone carvings, chariot-shaped mandapa (hall) pulled by horses and elephants, and its singing steps. It is a UNESCO World Heritage Site.",
      ta: "12 ஆம் நூற்றாண்டில் இரண்டாம் ராஜராஜ சோழனால் கட்டப்பட்ட இக்கோயில் அதன் நேர்த்தியான கல் சிற்பங்கள், குதிரைகள் மற்றும் யானைகளால் இழுக்கப்படும் தேர் வடிவ மண்டபம் மற்றும் பாடும் படிகளுக்காகப் புகழ்பெற்றது.",
      hi: "12वीं शताब्दी ईस्वी में राजराजा चोल द्वितीय द्वारा कमीशन किया गया, यह मंदिर उत्कृष्ट पत्थर की नक्काशी, घोड़ों और हाथियों द्वारा खींचे जाने वाले रथ के आकार के मंडप और संगीतमय सीढ़ियों के लिए प्रसिद्ध है।"
    },
    deity: { en: "Shiva", ta: "சிவன்", hi: "शिव" },
    location: { en: "Darasuram", ta: "தாராசுரம்", hi: "दारासुरम" },
    heritage_status: { en: "UNESCO World Heritage Site", ta: "யுனெஸ்கோ உலக பாரம்பரிய தளம்", hi: "यूनेस्को विश्व धरोहर स्थल" }
  },
  shore_temple: {
    name: {
      en: "Shore Temple",
      ta: "கடற்கரைக் கோயில்",
      hi: "शोर मंदिर"
    },
    description: {
      en: "Built during the Pallava dynasty under Narasimhavarman II (Rajasimha) in the 8th century CE, this structural stone temple stands on the shore of the Bay of Bengal. It includes shrines dedicated to Shiva and Vishnu.",
      ta: "8 ஆம் நூற்றாண்டில் இரண்டாம் நரசிம்மவர்மன் (ராஜசிம்மன்) காலத்தில் பல்லவ வம்சத்தினரால் வங்காள விரிகுடாவின் கரையில் கட்டப்பட்ட கற்கோயில் ஆகும். இது சிவன் மற்றும் விஷ்ணுவின் சன்னதிகளை உள்ளடக்கியது.",
      hi: "8वीं शताब्दी ईस्वी में नरसिंहवर्मन द्वितीय (राजसिंह) के तहत पल्लव राजवंश के दौरान निर्मित, यह पत्थर का ढांचागत मंदिर बंगाल की खाड़ी के तट पर स्थित है। इसमें शिव और विष्णु को समर्पित मंदिर शामिल हैं।"
    },
    deity: { en: "Shiva and Vishnu", ta: "சிவன் மற்றும் விஷ்ணு", hi: "शिव और विष्णु" },
    location: { en: "Mamallapuram", ta: "மாமல்லபுரம்", hi: "महाबलिपुरम" },
    heritage_status: { en: "UNESCO World Heritage Site", ta: "யுனெஸ்கோ உலக பாரம்பரிய தளம்", hi: "यूनेस्को विश्व धरोहर स्थल" }
  },
  kailasanathar: {
    name: {
      en: "Kailasanathar Temple",
      ta: "கைலாசநாதர் கோவில்",
      hi: "कैलाशनाथ मंदिर"
    },
    description: {
      en: "The oldest structural temple in Kanchipuram, commissioned by Pallava King Rajasimha (Narasimhavarman II) in the early 8th century CE. Built using sandstone, it is famous for its intricate Dravidian carvings.",
      ta: "காஞ்சிபுரத்தில் உள்ள பழமையான கற்கோயில், 8 ஆம் நூற்றாண்டின் தொடக்கத்தில் பல்லவ மன்னர் ராஜசிம்மனால் (இரண்டாம் நரசிம்மவர்மன்) கட்டப்பட்டது. மணற்கல்லால் கட்டப்பட்ட இக்கோயில் நுணுக்கமான செதுக்கல்களுக்குப் பெயர் பெற்றது.",
      hi: "कांचीपुरम का सबसे पुराना संरचनात्मक मंदिर, जिसे 8वीं शताब्दी की शुरुआत में पल्लव राजा राजसिंह (नरसिंहवर्मन द्वितीय) ने कमीशन किया था। बलुआ पत्थर से बना यह मंदिर द्रविड़ नक्काशी के लिए प्रसिद्ध है।"
    },
    deity: { en: "Shiva", ta: "சிவன்", hi: "शिव" },
    location: { en: "Kanchipuram", ta: "காஞ்சிபுரம்", hi: "कांचीपुरम" },
    heritage_status: { en: "Protected Monument", ta: "பாதுகாக்கப்பட்ட சின்னம்", hi: "संरक्षित स्मारक" }
  },
  meenakshi_amman: {
    name: {
      en: "Meenakshi Amman Temple",
      ta: "மீனாட்சி அம்மன் கோவில்",
      hi: "मीनाक्षी अम्मन मंदिर"
    },
    description: {
      en: "A historic Hindu temple on the southern bank of the Vaigai River in Madurai. Features 14 towering gopurams and is dedicated to Meenakshi (Parvati) and Sundareswarar (Shiva). Rebuilt extensively in the 16-17th century CE.",
      ta: "மதுரையில் வைகை ஆற்றின் கரையில் அமைந்துள்ள வரலாற்றுச் சிறப்புமிக்க இந்து ஆலயம். இது 14 பிரம்மாண்ட கோபுரங்களைக் கொண்டுள்ளது மற்றும் மீனாட்சி அம்மன் மற்றும் சுந்தரேஸ்வரருக்கு அர்ப்பணிக்கப்பட்டுள்ளது.",
      hi: "मदुरै में वैगई नदी के दक्षिणी तट पर स्थित ऐतिहासिक हिंदू मंदिर। इसमें 14 ऊंचे गोपुरम हैं और यह मीनाक्षी (पार्वती) और सुंदरेश्वर (शिव) को समर्पित है।"
    },
    deity: { en: "Meenakshi (Parvati) and Sundareswarar (Shiva)", ta: "மீனாட்சி (பார்வதி) மற்றும் சுந்தரேஸ்வரர் (சிவன்)", hi: "मीनाक्षी (पार्वती) और सुंदरेश्वर (शिव)" },
    location: { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
    heritage_status: { en: "Active Cultural Landmark", ta: "செயலில் உள்ள கலாச்சார சின்னம்", hi: "सक्रिय सांस्कृतिक मील का पत्थर" }
  },
  ranganathaswamy: {
    name: {
      en: "Ranganathaswamy Temple",
      ta: "ரங்கநாதசுவாமி கோவில்",
      hi: "रंगनाथस्वामी मंदिर"
    },
    description: {
      en: "One of the largest temple complexes in the world, dedicated to Ranganatha (reclining Vishnu). Located on Srirangam island. It features 21 magnificent gopurams, including the 236-foot Rajagopuram.",
      ta: "உலகிலேயே செயல்படும் மிகப்பெரிய கோயில் வளாகங்களில் ஒன்று, திருவரங்க தீவில் அமைந்துள்ளது. அரங்கநாதருக்கு (அறிதுயில் கொள்ளும் விஷ்ணு) அர்ப்பணிக்கப்பட்ட இக்கோயில் 21 கோபுரங்களைக் கொண்டுள்ளது.",
      hi: "दुनिया के सबसे बड़े मंदिर परिसरों में से एक, रंगनाथ (शयन मुद्रा में विष्णु) को समर्पित। श्रीरंगम द्वीप पर स्थित है। इसमें 236 फीट ऊंचे राजगोपुरम सहित 21 शानदार गोपुरम हैं।"
    },
    deity: { en: "Vishnu", ta: "விஷ்ணு / அரங்கநாதர்", hi: "विष्णु" },
    location: { en: "Srirangam", ta: "ஸ்ரீரங்கம்", hi: "श्रीरंगम" },
    heritage_status: { en: "Active Worship Site", ta: "வழிபாட்டு தலம்", hi: "सक्रिय पूजा स्थल" }
  },
  koodal_azhagar: {
    name: {
      en: "Koodal Azhagar Temple",
      ta: "கூடல் அழகர் கோவில்",
      hi: "कूडल अज़हागर मंदिर"
    },
    description: {
      en: "An ancient Vishnu temple in Madurai, featuring the deity in three postures: sitting, standing, and reclining. Possesses beautiful wooden carvings and historical Pandya inscriptions.",
      ta: "மதுரையில் உள்ள பழமையான விஷ்ணு கோயில், அமர்ந்த, நின்ற மற்றும் கிடந்த கோலங்களில் பெருமாள் காட்சியளிக்கிறார். அழகான மரச் சிற்பங்கள் மற்றும் பாண்டியர் கால கல்வெட்டுகளைக் கொண்டுள்ளது.",
      hi: "मदुरै में एक प्राचीन विष्णु मंदिर, जिसमें तीन मुद्राओं में भगवान विराजमान हैं: बैठे, खड़े और लेटे हुए। सुंदर लकड़ी की नक्काशी और ऐतिहासिक पांड्य शिलालेख हैं।"
    },
    deity: { en: "Vishnu", ta: "விஷ்ணு", hi: "विष्णु" },
    location: { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
    heritage_status: { en: "Protected Monument", ta: "பாதுகாக்கப்பட்ட சின்னம்", hi: "संरक्षित स्मारक" }
  },
  vaikunta_perumal_uttiramerur: {
    name: {
      en: "Vaikunta Perumal Temple (Uttiramerur)",
      ta: "வைகுண்ட பெருமாள் கோவில் (உத்திரமேரூர்)",
      hi: "वैकुंठ पेरुमल मंदिर (उत्तरमेरूर)"
    },
    description: {
      en: "Famed for its stone assembly hall containing detailed inscriptions detailing the local democratic self-governing election system (Kudavolai) in the 10th century Chola period.",
      ta: "10 ஆம் நூற்றாண்டின் சோழர் காலத்தில் உள்ளூர் ஜனநாயக முறையில் குடவோலை தேர்தல் முறை பற்றி விளக்கும் உலகப் புகழ்பெற்ற கல்வெட்டுகள் உள்ள வரலாற்றுத் தலம்.",
      hi: "10वीं शताब्दी के चोल काल में स्थानीय लोकतांत्रिक स्वशासी चुनाव प्रणाली (कुदावोलाई) का विवरण देने वाले विस्तृत शिलालेखों से युक्त अपनी पत्थर की सभा के लिए प्रसिद्ध।"
    },
    deity: { en: "Vishnu", ta: "விஷ்ணு", hi: "विष्णु" },
    location: { en: "Kanchipuram", ta: "காஞ்சிபுரம் (உத்திரமேரூர்)", hi: "कांचीपुरम" },
    heritage_status: { en: "Protected Monument", ta: "பாதுகாக்கப்பட்ட சின்னம்", hi: "संरक्षित स्मारक" }
  },

  // Rulers
  rajaraja_chola_i: {
    name: { en: "Rajaraja Chola I", ta: "முதலாம் ராஜராஜ சோழன்", hi: "राजराज चोल प्रथम" },
    description: {
      en: "One of the greatest emperors of the Chola Empire who ruled between 985 and 1014 CE. He established Chola hegemony over South India and the Indian Ocean, and built the great Brihadisvara Temple.",
      ta: "கி.பி. 985 முதல் 1014 வரை ஆட்சி செய்த சோழப் பேரரசின் மாபெரும் மன்னர். தென்னிந்தியாவில் சோழர்களின் ஆதிக்கத்தை நிலைநாட்டியதுடன் உலகப் புகழ்பெற்ற தஞ்சை பெரிய கோயிலைக் கட்டினார்.",
      hi: "चोल साम्राज्य के सबसे महान सम्राटों में से एक जिन्होंने 985 और 1014 ईस्वी के बीच शासन किया। उन्होंने दक्षिण भारत और हिंद महासागर पर चोल आधिपत्य स्थापित किया और महान बृहदीश्वर मंदिर का निर्माण कराया।"
    },
    title: { en: "Mummudi Cholan", ta: "மும்முடிச் சோழன்", hi: "मुम्मुडी चोलन" },
    reign_period: { en: "985 CE - 1014 CE", ta: "கி.பி. 985 - 1014", hi: "985 ईस्वी - 1014 ईस्वी" }
  },
  rajendra_chola_i: {
    name: { en: "Rajendra Chola I", ta: "முதலாம் ராஜேந்திர சோழன்", hi: "राजेंद्र चोल प्रथम" },
    description: {
      en: "Son of Rajaraja Chola I, he expanded the empire to Northern India (Ganges) and Southeast Asia. He built Gangaikonda Cholapuram and established a massive naval empire.",
      ta: "முதலாம் ராஜராஜ சோழனின் மகன், இவர் சோழப் பேரரசை வட இந்தியா மற்றும் தென்கிழக்கு ஆசிய நாடுகளுக்கு விரிவுபடுத்தினார். கங்கைகொண்ட சோழபுரத்தைக் கட்டிய பெருமை இவருக்குரியது.",
      hi: "राजराज चोल प्रथम के पुत्र, उन्होंने साम्राज्य का विस्तार उत्तर भारत (गंगा) और दक्षिण-पूर्व एशिया तक किया। उन्होंने गंगैकोंडचोलपुरम का निर्माण किया और एक विशाल नौसैनिक साम्राज्य की स्थापना की।"
    },
    title: { en: "Gangaikonda Cholan", ta: "கங்கைகொண்ட சோழன்", hi: "गंगैकोंडा चोलन" },
    reign_period: { en: "1014 CE - 1044 CE", ta: "கி.பி. 1014 - 1044", hi: "1014 ईस्वी - 1044 ईस्वी" }
  },
  rajaraja_chola_ii: {
    name: { en: "Rajaraja Chola II", ta: "இரண்டாம் ராஜராஜ சோழன்", hi: "राजराज चोल द्वितीय" },
    description: {
      en: "Chola emperor of the 12th century CE, who commissioned the Airavatesvara Temple in Darasuram. He was a great patron of arts and Tamil literature.",
      ta: "12 ஆம் நூற்றாண்டின் சோழப் பேரரசர். தாராசுரம் ஐராவதேஸ்வரர் கோயிலைக் கட்டியவர். கலை மற்றும் தமிழ் இலக்கியங்களின் சிறந்த ஆதரவாளர்.",
      hi: "12वीं शताब्दी ईस्वी के चोल सम्राट, जिन्होंने दारासुरम में ऐरावतेश्वर मंदिर का निर्माण कराया था। वह कला और तमिल साहित्य के महान संरक्षक थे।"
    },
    title: { en: "Rajaraja Chola II", ta: "இரண்டாம் ராஜராஜ சோழன்", hi: "राजराज चोल द्वितीय" },
    reign_period: { en: "1146 CE - 1173 CE", ta: "கி.பி. 1146 - 1173", hi: "1146 ईस्वी - 1173 ईस्वी" }
  },
  narasimhavarman_ii: {
    name: { en: "Narasimhavarman II (Rajasimha)", ta: "இரண்டாம் நரசிம்மவர்மன் (ராஜசிம்மன்)", hi: "नरसिंहवर्मन द्वितीय (राजसिंह)" },
    description: {
      en: "A prominent Pallava king who ruled in the late 7th and early 8th century CE. He was responsible for building the Shore Temple at Mamallapuram and the Kailasanathar Temple at Kanchipuram.",
      ta: "7 ஆம் நூற்றாண்டின் பிற்பகுதியிலும் 8 ஆம் நூற்றாண்டின் முற்பகுதியிலும் ஆண்ட பல்லவ மன்னர். மாமல்லபுரம் கடற்கரைக் கோயில் மற்றும் காஞ்சிபுரம் கைலாசநாதர் கோயிலைக் கட்டியவர் இவரே.",
      hi: "एक प्रमुख पल्लव राजा जिन्होंने 7वीं शताब्दी के अंत और 8वीं शताब्दी की शुरुआत में शासन किया। वह महाबलिपुरम में शोर मंदिर और कांचीपुरम में कैलाशनाथ मंदिर के निर्माण के लिए जिम्मेदार थे।"
    },
    title: { en: "Rajasimha", ta: "ராஜசிம்மன் / காடுவெட்டி", hi: "राजसिंह" },
    reign_period: { en: "700 CE - 729 CE", ta: "கி.பி. 700 - 729", hi: "700 ईस्वी - 729 ईस्वी" }
  },

  // Dynasties
  chola_dynasty: {
    name: { en: "Chola Dynasty", ta: "சோழ வம்சம்", hi: "चोल राजवंश" },
    description: {
      en: "One of the longest-ruling dynasties in world history. Known for their structural stone temples, bronze sculptures, maritime trade conquests, and local self-government structures.",
      ta: "உலக வரலாற்றில் மிக நீண்ட காலம் ஆட்சி செய்த வம்சங்களில் ஒன்று. நேர்த்தியான கற்கோயில்கள், வெண்கலச் சிலைகள், கடல்சார் வணிகப் படையெடுப்புகள் மற்றும் உள்ளாட்சி அமைப்புகளுக்குப் பெயர் பெற்றது.",
      hi: "विश्व इतिहास में सबसे लंबे समय तक शासन करने वाले राजवंशों में से एक। अपने संरचनात्मक पत्थर के मंदिरों, कांस्य मूर्तियों, समुद्री व्यापार विजय और स्थानीय स्वशासन संरचनाओं के लिए जाना जाता है।"
    },
    period: { en: "3rd Century BCE - 13th Century CE", ta: "கி.மு. 3 ஆம் நூற்றாண்டு - கி.பி. 13 ஆம் நூற்றாண்டு", hi: "तीसरी शताब्दी ईसा पूर्व - 13वीं शताब्दी ईस्वी" }
  },
  pallava_dynasty: {
    name: { en: "Pallava Dynasty", ta: "பல்லவ வம்சம்", hi: "पल्लव राजवंश" },
    description: {
      en: "Ruled northern Tamil Nadu and parts of Andhra from Kanchipuram. Famous for pioneering rock-cut architecture, monolithic temples (Rathas), and starting the grand Dravidian temple style.",
      ta: "காஞ்சிபுரத்தைத் தலைநகரமாகக் கொண்டு வட தமிழகத்தையும் ஆந்திராவின் சில பகுதிகளையும் ஆண்ட வம்சம். பாறை குடைவரை கட்டிடக்கலை மற்றும் ஒற்றைக்கல் ரதங்களுக்குப் பெயர் பெற்றது.",
      hi: "कांचीपुरम से उत्तरी तमिलनाडु और आंध्र के कुछ हिस्सों पर शासन किया। रॉक-cut वास्तुकला, अखंड मंदिरों (रथों) और भव्य द्रविड़ मंदिर शैली की शुरुआत करने के लिए प्रसिद्ध है।"
    },
    period: { en: "3rd Century - 9th Century CE", ta: "கி.பி. 3 ஆம் நூற்றாண்டு - 9 ஆம் நூற்றாண்டு", hi: "तीसरी शताब्दी - 9वीं शताब्दी ईस्वी" }
  },
  pandya_dynasty: {
    name: { en: "Pandya Dynasty", ta: "பாண்டிய வம்சம்", hi: "पांड्य राजवंश" },
    description: {
      en: "Ancient dynasty ruling southern Tamil Nadu from Madurai. Famous for their patronage of Tamil Sangam literature, pearl trade, and construction of massive temple gopurams.",
      ta: "மதுரையைத் தலைநகரமாகக் கொண்டு தென் தமிழகத்தை ஆண்ட பழமையான வம்சம். தமிழ் சங்க இலக்கியங்களை வளர்த்தவர்கள், முத்து வர்த்தகம் மற்றும் பிரம்மாண்ட கோபுரங்களை அமைத்ததற்குப் புகழ்பெற்றவர்கள்.",
      hi: "मदुरै से दक्षिणी तमिलनाडु पर शासन करने वाला प्राचीन राजवंश। तमिल संगम साहित्य के संरक्षण, मोती व्यापार और विशाल मंदिर गोपुरमों के निर्माण के लिए प्रसिद्ध है।"
    },
    period: { en: "4th Century BCE - 16th Century CE", ta: "கி.மு. 4 ஆம் நூற்றாண்டு - கி.பி. 16 ஆம் நூற்றாண்டு", hi: "चौथी शताब्दी ईसा पूर्व - 16वीं शताब्दी ईस्वी" }
  },

  // Periods
  chola_period: {
    name: { en: "Chola Period", ta: "சோழர் காலம்", hi: "चोल काल" },
    description: {
      en: "The golden age of Tamil Nadu history, marked by high artistic achievement, temple architecture, bronze casting, and expansion of trade routes.",
      ta: "தமிழ்நாடு வரலாற்றின் பொற்காலம், சோழர் காலம் கலை மற்றும் கோயில் கட்டிடக்கலை சாதனைகளின் சிகரமாகும்.",
      hi: "तमिलनाडु के इतिहास का स्वर्ण युग, जो उच्च कलात्मक उपलब्धि, मंदिर वास्तुकला, कांस्य ढलाई और व्यापार मार्गों के विस्तार द्वारा चिह्नित है।"
    }
  },
  pallava_period: {
    name: { en: "Pallava Period", ta: "பல்லவர் காலம்", hi: "पल्लव काल" },
    description: {
      en: "The foundation era of South Indian temple architecture, marked by rock-cut caves, monolithic carvings in Mamallapuram, and early sandstone structural temples.",
      ta: "தென்னிந்திய கோயில் கட்டிடக்கலையின் அடித்தளக் காலம். பாறைக் குடைவரை குகைகள் மற்றும் மாமல்லபுரம் ஒற்றைக்கல் ரதங்கள் இக்காலத்தில் உருவாயின.",
      hi: "दक्षिण भारतीय मंदिर वास्तुकला का नींव काल, जो रॉक-कट गुफाओं, महाबलिपुरम में अखंड नक्काशी और शुरुआती बलुआ पत्थर के मंदिरों द्वारा चिह्नित है।"
    }
  },
  pandya_period: {
    name: { en: "Pandya Period", ta: "பாண்டியர் காலம்", hi: "पांड्य काल" },
    description: {
      en: "Characterized by the revival of Pandyan power in Madurai, conflict with Cholas, and the expansion of temple gateways (gopurams) to gargantuan proportions.",
      ta: "மதுரையில் பாண்டிய அதிகாரத்தின் மறுமலர்ச்சி மற்றும் பிரம்மாண்ட கோயில் நுழைவாயில் கோபுரங்களின் விரிவாக்கம் இக்காலத்தின் முக்கிய அம்சமாகும்.",
      hi: "मदुरै में पांड्य सत्ता के पुनरुद्धार, चोलों के साथ संघर्ष और मंदिर के प्रवेश द्वारों (गोपुरमों) के विशाल अनुपातों में विस्तार द्वारा चिह्नित।"
    }
  },

  // Locations
  thanjavur: {
    name: { en: "Thanjavur", ta: "தஞ்சாவூர்", hi: "तंजौर" },
    description: { en: "The historical capital of the Chola Empire, famous for the Brihadisvara Temple and classical arts.", ta: "சோழப் பேரரசின் வரலாற்றுத் தலைநகரம், பிரகதீஸ்வரர் கோயில் மற்றும் கலைகளுக்குப் புகழ்பெற்றது.", hi: "चोल साम्राज्य की ऐतिहासिक राजधानी, बृहदीश्वर मंदिर और शास्त्रीय कलाओं के लिए प्रसिद्ध।" }
  },
  gangaikonda_cholapuram_loc: {
    name: { en: "Gangaikonda Cholapuram", ta: "கங்கைகொண்ட சோழபுரம்", hi: "गंगैकोंडचोलपुरम" },
    description: { en: "Established by Rajendra Chola I as the capital of the Cholas after his military expeditions to the Ganges.", ta: "ராஜேந்திர சோழனால் கங்கை நதி வரையிலான வெற்றிகளுக்குப் பின் சோழர்களின் புதிய தலைநகரமாக நிறுவப்பட்டது.", hi: "राजेंद्र चोल प्रथम द्वारा गंगा के सैन्य अभियानों के बाद चोलों की राजधानी के रूप में स्थापित किया गया।" }
  },
  darasuram: {
    name: { en: "Darasuram", ta: "தாராசுரம்", hi: "दारासुरम" },
    description: { en: "A historical town near Kumbakonam, famous for housing the UNESCO site Airavatesvara Temple.", ta: "கம்பகோணம் அருகே உள்ள வரலாற்று நகரம், ஐராவதேஸ்வரர் கோயில் உள்ள தலம்.", hi: "कुंभकोणम के पास एक ऐतिहासिक शहर, जो यूनेस्को स्थल ऐरावतेश्वर मंदिर के लिए प्रसिद्ध है।" }
  },
  mamallapuram: {
    name: { en: "Mamallapuram (Mahabalipuram)", ta: "மாமல்லபுரம் (மகாபலிபுரம்)", hi: "महाबलिपुरम" },
    description: { en: "An ancient Pallava port city famous for its UNESCO group of monuments, rock-cut Rathas, and Shore Temple.", ta: "யுனெஸ்கோ நினைவுச் சின்னங்கள், பாறை குடைவரை ரதங்கள் மற்றும் கடற்கரைக் கோயிலுக்குப் புகழ்பெற்ற பழமையான பல்லவ துறைமுக நகரம்.", hi: "एक प्राचीन पल्लव बंदरगाह शहर जो अपने यूनेस्को स्मारकों के समूह, रॉक-कट रथों और शोर मंदिर के लिए प्रसिद्ध है।" }
  },
  kanchipuram: {
    name: { en: "Kanchipuram", ta: "காஞ்சிபுரம்", hi: "कांचीपुरम" },
    description: { en: "The capital of the Pallavas, historical center of education, silk weaving, and home to Kailasanathar Temple.", ta: "பல்லவர்களின் தலைநகரம், வரலாற்றுச் சிறப்புமிக்க கல்வி மையம், பட்டு நெசவு மற்றும் கைலாசநாதர் கோயில் உள்ள நகரம்.", hi: "पल्लवों की राजधानी, शिक्षा का ऐतिहासिक केंद्र, रेशम बुनाई और कैलाशनाथ मंदिर का घर।" }
  },
  madurai: {
    name: { en: "Madurai", ta: "மதுரை", hi: "मदुरै" },
    description: { en: "One of the oldest continuously inhabited cities in the world, capital of Pandyas, famous for Sangam Assemblies and Meenakshi Temple.", ta: "உலகின் பழமையான நகரங்களில் ஒன்று, பாண்டியர்களின் தலைநகரம், தமிழ்ச் சங்கங்கள் மற்றும் மீனாட்சி கோயிலுக்குப் புகழ்பெற்றது.", hi: "दुनिया के सबसे पुराने लगातार बसे शहरों में से एक, पांड्यों की राजधानी, तमिल संगम और मीनाक्षी मंदिर के लिए प्रसिद्ध।" }
  },
  srirangam: {
    name: { en: "Srirangam", ta: "ஸ்ரீரங்கம் (திருவரங்கம்)", hi: "श्रीरंगम" },
    description: { en: "A river island city in Tiruchirappalli, home to the massive Ranganathaswamy Temple complex.", ta: "திருச்சிராப்பள்ளிக்கு அருகே காவிரி ஆற்றுத் தீவில் அமைந்துள்ள நகரம், அரங்கநாதசுவாமி கோயில் உள்ள தலம்.", hi: "तिरुचिरापल्ली में एक नदी द्वीप शहर, जो विशाल रंगनाथस्वामी मंदिर परिसर का घर है।" }
  },

  // Architecture Terms
  dravidian_architecture: {
    name: { en: "Dravidian Architecture", ta: "திராவிடக் கட்டிடக்கலை", hi: "द्रविड़ वास्तुकला" },
    description: { en: "The architectural style characterized by pyramid-shaped temple towers (Vimanas), large gateway towers (Gopurams), and pillared halls (Mandapas).", ta: "பிரமிடு வடிவ கோபுரங்கள் (விமானங்கள்), நுழைவாயில் கோபுரங்கள் (கோபுரங்கள்) மற்றும் தூண் மண்டபங்களால் வகைப்படுத்தப்படும் கட்டிடக்கலை பாணி.", hi: "पिरामिड के आकार के मंदिर के टावरों (विमान), बड़े प्रवेश द्वार टावरों (गोपुरम) और स्तंभों वाले हॉल (मंडप) की विशेषता वाली वास्तुकला शैली।" }
  },
  vimana: {
    name: { en: "Vimana (Sanctum Tower)", ta: "விமானம் (கருவறை கோபுரம்)", hi: "विमान (गर्भगृह टावर)" },
    description: { en: "The towering pyramid-like structure built directly over the inner sanctum (garbhagriha) of a South Indian temple.", ta: "தென்னிந்தியக் கோயிலில் கருவறையின் மீது கட்டப்படும் பிரமிடு போன்ற கோபுரக் கட்டுமானம்.", hi: "दक्षिण भारतीय मंदिर के गर्भगृह के ठीक ऊपर निर्मित विशाल पिरामिड जैसी संरचना।" }
  },
  gopuram: {
    name: { en: "Gopuram (Gateway Tower)", ta: "கோபுரம் (நுழைவாயில் கோபுரம்)", hi: "गोपुरम (प्रवेश द्वार टावर)" },
    description: { en: "The monumental, highly decorated gateway tower at the entrance of a temple complex, a signature feature of Pandya architecture.", ta: "கோயில் வளாகத்தின் நுழைவாயிலில் அமைக்கப்படும் பிரம்மாண்டமான, அலங்கரிக்கப்பட்ட நுழைவாயில் கோபுரம்.", hi: "एक मंदिर परिसर के प्रवेश द्वार पर स्थित विशाल, अत्यधिक सजाया गया प्रवेश द्वार टावर, पांड्य वास्तुकला की एक हस्ताक्षर विशेषता।" }
  },
  mandapa: {
    name: { en: "Mandapa (Pillared Hall)", ta: "மண்டபம் (தூண் மண்டபம்)", hi: "मंडप (स्तंभों वाला हॉल)" },
    description: { en: "A pillared hall or pavilion for public rituals, assemblies, and dance performances in Dravidian temples.", ta: "கோயில் சடங்குகள், கூட்டங்கள் மற்றும் நாட்டிய நிகழ்வுகளுக்காக அமைக்கப்படும் தூண்களைக் கொண்ட பெரிய கூடம்.", hi: "द्रविड़ मंदिरों में सार्वजनिक अनुष्ठानों, सभाओं और नृत्य प्रदर्शनों के लिए एक स्तंभों वाला हॉल या मंडप।" }
  },
  monolithic_ratha: {
    name: { en: "Monolithic Ratha", ta: "ஒற்றைக்கல் ரதம் (தேர் வடிவக் கோவில்)", hi: "अखंड रथ (रथ मंदिर)" },
    description: { en: "A temple carved entirely from a single massive rock, as exemplified by the Five Rathas in Mamallapuram.", ta: "மாமல்லபுரம் பஞ்ச ரதங்கள் போல, ஒரே பாறையைக் குடைந்து செதுக்கப்படும் தேர் வடிவக் கோயில்.", hi: "एक विशाल चट्टान से तराशा गया मंदिर, जैसा कि महाबलिपुरम में पंच रथों द्वारा दर्शाया गया है।" }
  },

  // Deities
  shiva: {
    name: { en: "Shiva", ta: "சிவன்", hi: "शिव" },
    description: { en: "One of the principal deities of Hinduism, worshipped as the supreme destroyer and transformer in Shaivism.", ta: "சைவ சமயத்தின் முதன்மைக் கடவுள், அழித்தல் மற்றும் மறுஉருவாக்கத்தின் கடவுள்.", hi: "हिंदू धर्म के प्रमुख देवताओं में से एक, शैव धर्म में सर्वोच्च विनाशक और संहारक के रूप में पूजे जाते हैं।" }
  },
  vishnu: {
    name: { en: "Vishnu", ta: "விஷ்ணு / பெருமாள்", hi: "विष्णु" },
    description: { en: "The supreme deity of Vaishnavism, worshipped as the protector and preserver of the universe.", ta: "வைணவ சமயத்தின் முதன்மைக் கடவுள், பிரபஞ்சத்தைக் காக்கும் காக்கும் கடவுள்.", hi: "वैष्णव धर्म के सर्वोच्च देवता, ब्रह्मांड के संरक्षक और पालनकर्ता के रूप में पूजे जाते हैं।" }
  },

  // Inscriptions
  thanjavur_inscriptions: {
    name: { en: "Thanjavur Inscriptions", ta: "தஞ்சாவூர் பெரிய கோயில் கல்வெட்டுகள்", hi: "तंजौर शिलालेख" },
    description: { en: "A vast collection of Tamil inscriptions carved on the walls of Brihadisvara Temple, listing gifts, administrative orders, and names of temple dancers.", ta: "தஞ்சை பெரிய கோயில் சுவர்களில் செதுக்கப்பட்டுள்ள தமிழ் கல்வெட்டுகள், கொடைகள் மற்றும் நிர்வாக உத்தரவுகளை விவரிக்கின்றன.", hi: "बृहदीश्वर मंदिर की दीवारों पर उत्कीर्ण तमिल शिलालेखों का एक विशाल संग्रह, जिसमें उपहार, प्रशासनिक आदेश सूचीबद्ध हैं।" }
  },
  uttiramerur_inscriptions: {
    name: { en: "Uttiramerur Inscriptions", ta: "உத்திரமேரூர் கல்வெட்டுகள்", hi: "उत्तरमेरूर शिलालेख" },
    description: { en: "10th-century Chola inscriptions detailing the Kudavolai system of election and democratic village assemblies.", ta: "10 ஆம் நூற்றாண்டின் சோழர் கால கல்வெட்டு, இது கிராம சபைத் தேர்தல் முறையைப் பற்றி தெளிவாக விளக்குகிறது.", hi: "10वीं शताब्दी के चोल शिलालेख जिसमें चुनाव की कुदावोलाई प्रणाली और लोकतांत्रिक ग्राम सभाओं का विवरण है।" }
  },

  // Events
  coronation_rajaraja: {
    name: { en: "Coronation of Rajaraja Chola I", ta: "ராஜாரஜ சோழன் முடிசூட்டு விழா", hi: "राजराज चोल प्रथम का राज्याभिषेक" },
    description: { en: "The landmark historical event in 985 CE marking the ascension of Arulmozhi Varman to the Chola throne as Rajaraja Chola I.", ta: "கி.பி. 985 இல் அருள்மொழிவர்மன் இராஜராஜ சோழனாகச் சோழப் பேரரசின் அரியணை ஏறிய வரலாற்று நிகழ்வு.", hi: "985 ईस्वी में ऐतिहासिक घटना जो अरुलमोझी वर्मन के राजराज चोल प्रथम के रूप में चोल सिंहासन पर बैठने का प्रतीक है।" }
  },
  conquest_kadaram: {
    name: { en: "Conquest of Kadaram (Sumatra)", ta: "கடாரம் கொண்டான் கடற்படைப் படையெடுப்பு", hi: "कडारम विजय (सुमात्रा)" },
    description: { en: "The naval expedition launched by Rajendra Chola I in 1025 CE against the Srivijaya Empire in modern Malaysia and Indonesia.", ta: "கி.பி. 1025 இல் ராஜேந்திர சோழன் தென்கிழக்கு ஆசியாவின் ஸ்ரீவிஜய பேரரசுக்கு எதிராக நடத்திய மாபெரும் கடற்படைப் படையெடுப்பு.", hi: "1025 ईस्वी में राजेंद्र चोल प्रथम द्वारा आधुनिक मलेशिया और इंडोनेशिया में श्रीविजय साम्राज्य के खिलाफ शुरू किया गया नौसैनिक अभियान।" }
  }
};

// Translate UI labels
export function t(key: string, lang: Language): string {
  const translations = UI_TRANSLATIONS[key];
  if (!translations) return key;
  return translations[lang] || translations["en"] || key;
}

// Helper to translate Heritage Node properties dynamically
export function translateNode(node: HeritageNode, lang: Language): HeritageNode {
  if (lang === "en" || !node || !node.properties) return node;

  const entityId = node.id || node.properties.id || "";
  const translation = ENTITY_TRANSLATIONS[entityId];
  if (!translation) return node;

  const propsCopy = { ...node.properties };

  // Translate Name
  if (translation.name && translation.name[lang]) {
    propsCopy.name = translation.name[lang];
  }
  // Translate Description
  if (translation.description && translation.description[lang]) {
    propsCopy.description = translation.description[lang];
  }
  // Translate Location name
  if (translation.location && translation.location[lang]) {
    propsCopy.location = translation.location[lang];
  }
  // Translate Deity
  if (translation.deity && translation.deity[lang]) {
    propsCopy.deity = translation.deity[lang];
  }
  // Translate Heritage Status
  if (translation.heritage_status && translation.heritage_status[lang]) {
    propsCopy.heritage_status = translation.heritage_status[lang];
  }
  // Translate Title (if Person)
  if (translation.title && translation.title[lang]) {
    propsCopy.title = translation.title[lang];
  }
  // Translate Reign period (if Person)
  if (translation.reign_period && translation.reign_period[lang]) {
    propsCopy.reign_period = translation.reign_period[lang];
  }
  // Translate Dynasty duration (if Dynasty)
  if (translation.period && translation.period[lang]) {
    propsCopy.period = translation.period[lang];
  }

  // Also translate node label/type if appropriate (e.g. for display badges)
  const translatedLabel = node.label === "Temple" ? (lang === "ta" ? "கோவில்" : "मंदिर") :
                          node.label === "Person" ? (lang === "ta" ? "மன்னர்" : "शासक") :
                          node.label === "Dynasty" ? (lang === "ta" ? "வம்சம்" : "राजवंश") :
                          node.label === "Location" ? (lang === "ta" ? "இருப்பிடம்" : "स्थान") :
                          node.label === "Inscription" ? (lang === "ta" ? "கல்வெட்டு" : "शिलालेख") :
                          node.label === "HistoricalEvent" ? (lang === "ta" ? "வரலாற்று நிகழ்வு" : "ऐतिहासिक घटना") :
                          node.label;

  return {
    ...node,
    label: translatedLabel,
    properties: propsCopy
  };
}

// Helper to translate whole subgraphs
export function translateSubgraph(subgraph: Subgraph | null | undefined, lang: Language): Subgraph {
  if (!subgraph || !subgraph.nodes) return { nodes: [], relationships: [] };
  return {
    ...subgraph,
    nodes: subgraph.nodes.map(node => translateNode(node, lang))
  };
}
