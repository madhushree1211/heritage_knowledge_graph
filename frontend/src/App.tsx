import { useState, useEffect } from "react";
import type { HeritageNode, Subgraph } from "./types";
import { getEntireGraph } from "./services/api";
import SearchInterface from "./components/SearchInterface";
import GraphVisualizer from "./components/GraphVisualizer";
import ComparisonPage from "./components/ComparisonPage";
import EntityDetail from "./components/EntityDetail";
import { Landmark, Compass, Scale, LayoutGrid, Cpu, ShieldCheck } from "lucide-react";
import { t, translateNode, translateSubgraph } from "./services/localization";
import type { Language } from "./services/localization";

export default function App() {
  const [activeTab, setActiveTab] = useState<"search" | "graph" | "compare" | "catalog" | "logs">("search");
  const [selectedEntity, setSelectedEntity] = useState<HeritageNode | null>(null);
  const [compareList, setCompareList] = useState<HeritageNode[]>([]);
  const [fullGraph, setFullGraph] = useState<Subgraph>({ nodes: [], relationships: [] });
  const [loadingGraph, setLoadingGraph] = useState<boolean>(true);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const addLog = (msg: string) => {
    setSystemLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-40));
  };

  // Fetch full graph on startup
  useEffect(() => {
    async function loadGraph() {
      try {
        setLoadingGraph(true);
        const data = await getEntireGraph();
        setFullGraph(data);
        setLoadingGraph(false);
      } catch (err) {
        console.error("Failed to load initial graph", err);
        setLoadingGraph(false);
      }
    }
    loadGraph();
  }, []);

  const handleNodeClick = (node: HeritageNode) => {
    setSelectedEntity(node);
  };

  const handleCompareToggle = (nodeId: string) => {
    const node = fullGraph.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setCompareList(prev => {
      const isAlreadyIn = prev.some(n => n.id === nodeId);
      if (isAlreadyIn) {
        return prev.filter(n => n.id !== nodeId);
      } else {
        if (prev.length >= 3) {
          alert("Maximum of 3 sites can be compared at a time.");
          return prev;
        }
        return [...prev, node];
      }
    });
  };

  const handleSelectSuggestion = async (ids: string[]) => {
    const selectedNodes = fullGraph.nodes.filter(n => ids.includes(n.id));
    setCompareList(selectedNodes);
  };

  const handleLocateInGraph = (nodeId: string) => {
    const node = fullGraph.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedEntity(node);
      setActiveTab("graph");
    }
  };

  const isSelectedInCompare = (nodeId: string) => {
    return compareList.some(n => n.id === nodeId);
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col transition-colors duration-200">
      {/* Top Banner Navigation Bar */}
      <header className="bg-cyber-card border-b border-cyber-border px-6 py-4 flex items-center justify-between shadow-lg transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="bg-cyan-500/10 p-2 border border-cyan-500/30 rounded-lg">
            <Landmark className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100 tracking-wide font-serif">
              {t("header.title", lang)}
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider font-sans uppercase flex items-center space-x-1">
              <span>{t("header.subtitle", lang)}</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 font-serif">
          {[
            { id: "search", label: t("tab.search", lang), icon: <Compass className="w-4 h-4" /> },
            { id: "graph", label: t("tab.graph", lang), icon: <Landmark className="w-4 h-4" /> },
            { id: "compare", label: t("tab.compare", lang), icon: <Scale className="w-4 h-4" /> },
            { id: "catalog", label: t("tab.catalog", lang), icon: <LayoutGrid className="w-4 h-4" /> },
            { id: "logs", label: t("tab.logs", lang), icon: <Cpu className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-cyan-600/15 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/5"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-gray-200 hover:bg-cyber-border/40"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Actions header group */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="bg-cyber-bg border border-cyber-border text-gray-300 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
          >
            <option value="en">🇬🇧 English</option>
            <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
            <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
          </select>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
            className="flex items-center justify-center p-2 bg-cyber-bg border border-cyber-border rounded-lg text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-sans text-xs cursor-pointer select-none"
            title="Toggle Light/Dark Theme"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Database Status indicator */}
          <div className="flex items-center space-x-2 bg-cyber-bg px-3 py-1.5 border border-cyber-border rounded-lg text-[10px] font-sans transition-colors duration-200">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400 tracking-wider">{t("header.db_status", lang)}</span>
            <span className="text-cyan-400 font-bold uppercase">NetworkX / Local</span>
          </div>
        </div>
      </header>

      {/* Main split-screen panel container */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Side: Active Screen content */}
        <div className="flex-1 flex flex-col overflow-y-auto pr-1">
          {activeTab === "search" && (
            <SearchInterface
              onNodeClick={handleNodeClick}
              addLog={addLog}
              lang={lang}
            />
          )}

          {activeTab === "graph" && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl flex items-center justify-between transition-colors duration-200">
                <div>
                  <h2 className="text-base font-bold text-gray-100">{t("graph.title", lang)}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t("graph.subtitle", lang)}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-gray-500">
                  {t("graph.stats", lang)
                    .replace("{nodes}", String(fullGraph.nodes.length))
                    .replace("{links}", String(fullGraph.relationships.length))}
                </div>
              </div>
              <div className="flex-1 relative min-h-[450px]">
                {loadingGraph ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-cyber-card border border-cyber-border rounded-xl transition-colors duration-200">
                    <span className="text-sm font-mono text-gray-400">Loading graph topology...</span>
                  </div>
                ) : (
                  <GraphVisualizer
                    graph={translateSubgraph(fullGraph, lang)}
                    onNodeClick={handleNodeClick}
                    selectedNodeId={selectedEntity?.id}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "compare" && (
            <ComparisonPage
              compareList={compareList.map(node => translateNode(node, lang))}
              onRemoveFromCompare={handleCompareToggle}
              onSelectSuggestion={handleSelectSuggestion}
              lang={lang}
            />
          )}

          {activeTab === "catalog" && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl transition-colors duration-200">
                <h2 className="text-base font-bold text-gray-100">{t("catalog.title", lang)}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("catalog.subtitle", lang)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {fullGraph.nodes.map(node => {
                  const translatedNode = translateNode(node, lang);
                  return (
                    <div
                      key={translatedNode.id}
                      onClick={() => handleNodeClick(node)}
                      className="p-4 bg-cyber-card border border-cyber-border rounded-xl hover:border-cyan-500/40 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
                            {translatedNode.label}
                          </span>
                          <span className="text-lg">
                            {node.label === "Temple" && "🛕"}
                            {node.label === "Person" && "👑"}
                            {node.label === "Dynasty" && "🛡️"}
                            {node.label === "Location" && "📍"}
                            {node.label === "Inscription" && "📜"}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-200 text-sm mb-1">{translatedNode.properties.name}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {translatedNode.properties.description || "No detailed description currently mapped in index."}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-cyber-border/40 pt-3 mt-3">
                        <span className="text-[10px] text-gray-500">
                          {translatedNode.properties.location || translatedNode.properties.period || "South India"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompareToggle(translatedNode.id);
                          }}
                          className={`text-[9px] uppercase tracking-wider font-bold py-1 px-2.5 rounded border transition-all ${
                            isSelectedInCompare(translatedNode.id)
                              ? "bg-purple-950/40 border-purple-500/50 text-purple-400"
                              : "bg-cyber-bg border-cyber-border text-gray-400 hover:text-purple-400 hover:border-purple-500/30"
                          }`}
                        >
                          {isSelectedInCompare(translatedNode.id) ? t("btn.added", lang) : t("btn.compare", lang)}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl transition-colors duration-200">
                <h2 className="text-base font-bold text-gray-100">{t("logs.title", lang)}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("logs.subtitle", lang)}
                </p>
              </div>
              <div className="flex-1 bg-[#05070c] border border-cyber-border rounded-xl p-5 shadow-inner overflow-y-auto flex flex-col justify-between font-mono text-xs text-emerald-400 min-h-[400px]">
                <div className="space-y-1.5 overflow-y-auto max-h-[500px] pr-2">
                  {systemLogs.length === 0 ? (
                    <div className="text-gray-600 italic">{t("logs.empty", lang)}</div>
                  ) : (
                    systemLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-cyber-border/20 pb-1 flex items-start space-x-2">
                        <span className="text-cyan-500 flex-shrink-0">▶</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-cyber-border/40 pt-3 mt-4 flex items-center justify-between text-[10px] text-gray-500">
                  <span>ENGINE STATUS: SQLite/NetworkX Local Graph Engine (CONNECTED)</span>
                  <span>REAL-TIME STREAMING ACTIVE</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Modal Popup overlay for Entity Details */}
      {selectedEntity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-all"
          onClick={() => setSelectedEntity(null)}
        >
          <div 
            className="w-full max-w-2xl max-h-[85vh] bg-cyber-card border border-cyber-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <EntityDetail
              node={translateNode(selectedEntity, lang)}
              onClose={() => setSelectedEntity(null)}
              onCompareToggle={handleCompareToggle}
              isInCompareList={isSelectedInCompare(selectedEntity.id)}
              onLocateInGraph={(id) => {
                handleLocateInGraph(id);
                setSelectedEntity(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
