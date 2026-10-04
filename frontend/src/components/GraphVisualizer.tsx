import { useState, useEffect, useRef } from "react";
import type { HeritageNode, HeritageRelationship, Subgraph } from "../types";
import { ZoomIn, ZoomOut, Maximize2, Filter, Info } from "lucide-react";

interface GraphVisualizerProps {
  graph: Subgraph;
  onNodeClick: (node: HeritageNode) => void;
  selectedNodeId?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
  showLegend?: boolean;
}

export default function GraphVisualizer({
  graph,
  onNodeClick,
  selectedNodeId,
  width = 800,
  height = 500,
  showLegend = true,
}: GraphVisualizerProps) {
  const [nodes, setNodes] = useState<HeritageNode[]>([]);
  const [relationships, setRelationships] = useState<HeritageRelationship[]>([]);
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>({
    Temple: true,
    Person: true,
    Dynasty: true,
    HistoricalPeriod: true,
    Location: true,
    ArchitecturalStyle: true,
    ArchitecturalFeature: true,
    Deity: true,
    Inscription: true,
    HistoricalEvent: true,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Node Color mapping
  const getNodeColor = (label: string): string => {
    switch (label) {
      case "Temple": return "#eab308"; // Amber
      case "Person": return "#3b82f6"; // Blue
      case "Dynasty": return "#a855f7"; // Purple
      case "HistoricalPeriod": return "#10b981"; // Emerald
      case "Location": return "#ef4444"; // Red
      case "ArchitecturalStyle": return "#06b6d4"; // Cyan
      case "ArchitecturalFeature": return "#ec4899"; // Pink
      case "Deity": return "#f59e0b"; // Orange
      case "Inscription": return "#84cc16"; // Lime
      case "HistoricalEvent": return "#6366f1"; // Indigo
      default: return "#94a3b8"; // Slate
    }
  };

  // Node emoji representation
  const getNodeEmoji = (label: string): string => {
    switch (label) {
      case "Temple": return "🛕";
      case "Person": return "👑";
      case "Dynasty": return "🛡️";
      case "HistoricalPeriod": return "⏳";
      case "Location": return "📍";
      case "ArchitecturalStyle": return "📐";
      case "ArchitecturalFeature": return "🏛️";
      case "Deity": return "☀️";
      case "Inscription": return "📜";
      case "HistoricalEvent": return "⚔️";
      default: return "ℹ️";
    }
  };

  // Initialize and Sync Graph Data
  useEffect(() => {
    if (!graph || !graph.nodes) return;

    // Filter nodes by category visibility toggles
    const filteredNodes = graph.nodes.filter(n => visibleLabels[n.label] !== false);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredRels = graph.relationships.filter(
      r => nodeIds.has(r.start) && nodeIds.has(r.end)
    );

    // Deep copy and initialize positions in a circle layout
    const initializedNodes = filteredNodes.map((n, i) => {
      // Retain existing position if present (e.g. during updates)
      const existing = nodes.find(ex => ex.id === n.id);
      if (existing && existing.x !== undefined) {
        return { ...n, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy };
      }

      // Calculate circle coordinate
      const angle = (i / filteredNodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      return {
        ...n,
        x: width / 2 + radius * Math.cos(angle) + (Math.random() - 0.5) * 20,
        y: height / 2 + radius * Math.sin(angle) + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
      };
    });

    setNodes(initializedNodes);
    setRelationships(filteredRels);
    
    // Reset centering pan/zoom slightly adjusted for subgraph size
    setPan({ x: 0, y: 0 });
    setZoom(graph.nodes.length > 15 ? 0.75 : 0.95);
  }, [graph, visibleLabels]);

  // Physics Simulation Loop
  useEffect(() => {
    if (nodes.length === 0) return;

    const runSimulation = () => {
      setNodes(prevNodes => {
        const nextNodes = prevNodes.map(n => ({ ...n }));
        const nodeMap = new Map(nextNodes.map(n => [n.id, n]));

        const kSpring = 0.02; // Soft spring strength to allow wide spread
        const restLength = 220; // Increased from 120 for double the space
        const kRepulsion = 5000; // Increased from 1500 for massive repulsion
        const damping = 0.85; // Friction damping
        const gravity = 0.005; // Centering force reduced from 0.02 to prevent central congestion

        // 1. Center of Gravity pulling towards center of view
        const centerX = width / 2;
        const centerY = height / 2;
        
        for (let n of nextNodes) {
          if (n.id === draggedNode) continue;
          n.vx = (n.vx || 0) + (centerX - (n.x || 0)) * gravity;
          n.vy = (n.vy || 0) + (centerY - (n.y || 0)) * gravity;
        }

        // 2. Repulsion Force between all node pairs
        for (let i = 0; i < nextNodes.length; i++) {
          const nodeA = nextNodes[i];
          for (let j = i + 1; j < nextNodes.length; j++) {
            const nodeB = nextNodes[j];
            
            const dx = (nodeB.x || 0) - (nodeA.x || 0);
            const dy = (nodeB.y || 0) - (nodeA.y || 0);
            const distSq = dx * dx + dy * dy + 0.1;
            const dist = Math.sqrt(distSq);

            if (dist < 700) {
              const force = kRepulsion / distSq;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (nodeA.id !== draggedNode) {
                nodeA.vx = (nodeA.vx || 0) - fx;
                nodeA.vy = (nodeA.vy || 0) - fy;
              }
              if (nodeB.id !== draggedNode) {
                nodeB.vx = (nodeB.vx || 0) + fx;
                nodeB.vy = (nodeB.vy || 0) + fy;
              }
            }
          }
        }

        // 3. Attraction Forces along edges
        for (let rel of relationships) {
          const nodeA = nodeMap.get(rel.start);
          const nodeB = nodeMap.get(rel.end);
          if (!nodeA || !nodeB) continue;

          const dx = (nodeB.x || 0) - (nodeA.x || 0);
          const dy = (nodeB.y || 0) - (nodeA.y || 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;

          const force = (dist - restLength) * kSpring;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (nodeA.id !== draggedNode) {
            nodeA.vx = (nodeA.vx || 0) + fx;
            nodeA.vy = (nodeA.vy || 0) + fy;
          }
          if (nodeB.id !== draggedNode) {
            nodeB.vx = (nodeB.vx || 0) - fx;
            nodeB.vy = (nodeB.vy || 0) - fy;
          }
        }

        // 4. Update Node Positions with Damping
        for (let n of nextNodes) {
          if (n.id === draggedNode) continue;
          n.vx = (n.vx || 0) * damping;
          n.vy = (n.vy || 0) * damping;
          n.x = (n.x || 0) + n.vx;
          n.y = (n.y || 0) + n.vy;

          // Boundary constraint
          n.x = Math.max(20, Math.min(width - 20, n.x));
          n.y = Math.max(20, Math.min(height - 20, n.y));
        }

        return nextNodes;
      });

      animationRef.current = requestAnimationFrame(runSimulation);
    };

    animationRef.current = requestAnimationFrame(runSimulation);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [nodes.length, relationships, draggedNode]);

  // Drag and Pan event handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current) {
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
    } else if (draggedNode && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      // Calculate mouse position inside SVG taking pan and zoom into account
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      setNodes(prev =>
        prev.map(n => (n.id === draggedNode ? { ...n, x: mouseX, y: mouseY } : n))
      );
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNode(nodeId);
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom(prev => {
      const next = direction === "in" ? prev + 0.15 : prev - 0.15;
      return Math.max(0.2, Math.min(2.5, next));
    });
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1.0);
  };

  const toggleVisibility = (label: string) => {
    setVisibleLabels(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div className="relative bg-cyber-card border border-cyber-border rounded-xl overflow-hidden shadow-2xl h-full flex flex-col">
      {/* Top Toolbar controls */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => handleZoom("in")}
          className="p-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-cyber-bg/80 border border-cyber-border rounded-lg text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 backdrop-blur-sm transition-all"
          title="Reset Fit"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Legend & Filter Panel */}
      {showLegend && (
        <div className="absolute top-4 right-4 z-10 bg-cyber-bg/80 border border-cyber-border rounded-xl p-3 backdrop-blur-sm text-xs w-48 shadow-lg max-h-[85%] overflow-y-auto">
          <div className="flex items-center space-x-1 mb-2 border-b border-cyber-border pb-1 font-semibold text-cyan-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Entity Legend</span>
          </div>
          <div className="space-y-1.5">
            {Object.keys(visibleLabels).map(label => (
              <label
                key={label}
                className="flex items-center space-x-2 cursor-pointer hover:bg-cyber-border/40 p-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={visibleLabels[label]}
                  onChange={() => toggleVisibility(label)}
                  className="rounded border-gray-600 bg-cyber-bg text-cyan-500 focus:ring-cyan-500 w-3 h-3"
                />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getNodeColor(label) }}
                />
                <span className="text-gray-300 font-medium">{getNodeEmoji(label)} {label.replace("Architectural", "Arch ")}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <div className="flex-1 w-full bg-cyber-bg/40 cyber-grid cursor-grab active:cursor-grabbing select-none relative">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <Info className="w-12 h-12 mb-2 text-cyber-border animate-pulse" />
            <p className="text-sm">No connected entities are currently mapped.</p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full"
          >
            {/* Edge arrows marker */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--graph-arrow)" />
              </marker>
              <marker
                id="arrow-hover"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#cda752" />
              </marker>
            </defs>

            {/* Transform Group (Pan & Zoom) */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Draw Edges */}
              {relationships.map((rel, index) => {
                const startNode = nodes.find(n => n.id === rel.start);
                const endNode = nodes.find(n => n.id === rel.end);
                
                if (!startNode || !endNode) return null;
                
                const sx = startNode.x || 0;
                const sy = startNode.y || 0;
                const ex = endNode.x || 0;
                const ey = endNode.y || 0;

                const isSelected = startNode.id === selectedNodeId || endNode.id === selectedNodeId;

                return (
                  <g key={`rel-${index}`} className="group/edge">
                    {/* Interactive hover line */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke="transparent"
                      strokeWidth="10"
                      className="cursor-pointer"
                    />
                    {/* Visual Line */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={ex}
                      y2={ey}
                      stroke={isSelected ? "#cda752" : "var(--graph-line)"}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={isSelected ? "4 2" : "none"}
                      markerEnd={isSelected ? "url(#arrow-hover)" : "url(#arrow)"}
                      className="transition-all duration-300"
                    />
                    {/* Edge Label - Constantly Visible for Clear Mappings */}
                    <g className="pointer-events-none select-none">
                      <rect
                        x={(sx + ex) / 2 - 38}
                        y={(sy + ey) / 2 - 8}
                        width="76"
                        height="11"
                        rx="2"
                        fill="#1c1a17"
                        stroke="#3d3428"
                        strokeWidth="0.8"
                      />
                      <text
                        x={(sx + ex) / 2}
                        y={(sy + ey) / 2}
                        fill="#cda752"
                        fontSize="6.5"
                        fontWeight="700"
                        textAnchor="middle"
                        className="font-mono tracking-wider uppercase"
                      >
                        {rel.type.replace(/_/g, " ")}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {nodes.map(node => {
                const nx = node.x || 0;
                const ny = node.y || 0;
                const isSelected = node.id === selectedNodeId;
                const hasScore = node.score !== undefined;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${nx}, ${ny})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(node);
                    }}
                    onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                    className="cursor-pointer group/node"
                  >
                    {/* Glowing pulse ring if selected */}
                    {isSelected && (
                      <circle
                        r="24"
                        fill="transparent"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Glow ring */}
                    <circle
                      r="18"
                      fill="rgba(15, 22, 34, 0.9)"
                      stroke={isSelected ? "#06b6d4" : getNodeColor(node.label)}
                      strokeWidth={isSelected ? 3 : 1.8}
                      className="group-hover/node:stroke-white transition-colors shadow-lg"
                    />

                    {/* Node Emoji */}
                    <text
                      y="4"
                      fontSize="14"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {getNodeEmoji(node.label)}
                    </text>

                    {/* Node Match Score tag */}
                    {hasScore && (
                      <g transform="translate(14, -14)">
                        <circle r="7.5" fill="#10b981" />
                        <text
                          y="2.5"
                          fontSize="7"
                          fill="white"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {Math.round((node.score || 0) * 100)}
                        </text>
                      </g>
                    )}

                    {/* Node Text Label */}
                    <text
                      y="32"
                      fontSize="10"
                      fontWeight={isSelected ? "bold" : "500"}
                      fill={isSelected ? "#38bdf8" : "#f1f5f9"}
                      textAnchor="middle"
                      className="pointer-events-none select-none group-hover/node:fill-cyan-400 transition-colors drop-shadow"
                    >
                      {node.properties.name}
                    </text>
                    {/* Node category label */}
                    <text
                      y="41"
                      fontSize="7"
                      fill="#64748b"
                      textAnchor="middle"
                      className="pointer-events-none select-none uppercase font-semibold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}
