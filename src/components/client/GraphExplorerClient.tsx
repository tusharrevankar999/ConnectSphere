'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GraphNode, GraphEdge } from '@/types';
import { 
  GitMerge, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Code
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface GraphExplorerClientProps {
  initialNodes: GraphNode[];
  initialEdges: GraphEdge[];
}

export const GraphExplorerClient: React.FC<GraphExplorerClientProps> = ({ initialNodes, initialEdges }) => {
  const [nodes] = useState<GraphNode[]>(initialNodes);
  const [edges] = useState<GraphEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(initialNodes[0] || null);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { toast } = useToast();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const filteredNodes = selectedType === 'All'
    ? nodes
    : nodes.filter((n) => n.type === selectedType);

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const activeEdges = edges.filter(
    (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  const getNodePositions = () => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const positions: Record<string, { x: number; y: number }> = {};
    positions['nexus-center'] = { x: centerX, y: centerY };

    const outerNodes = filteredNodes.filter((n) => n.id !== 'nexus-center');
    const totalOuter = outerNodes.length;

    outerNodes.forEach((node, idx) => {
      const angle = (idx / totalOuter) * 2 * Math.PI;
      let radius = 220;
      if (node.type === 'Startup') radius = 170;
      if (node.type === 'Founder') radius = 240;
      if (node.type === 'Investor') radius = 260;
      if (node.type === 'Mentor') radius = 200;
      if (node.type === 'Technology') radius = 210;
      if (node.type === 'Industry') radius = 270;

      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return positions;
  };

  const nodePositions = getNodePositions();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoomLevel, zoomLevel);

      activeEdges.forEach((edge) => {
        const start = nodePositions[edge.source];
        const end = nodePositions[edge.target];
        if (!start || !end) return;

        const isHighlighted = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = isHighlighted ? '#2563EB' : '#E2E8F0';
        ctx.lineWidth = isHighlighted ? 2.5 : 1;
        ctx.setLineDash(isHighlighted ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      filteredNodes.forEach((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return;

        const isSelected = selectedNode?.id === node.id;
        const radius = isSelected ? node.val + 4 : node.val;

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 8, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(37, 99, 235, 0.15)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.shadowColor = 'rgba(15, 23, 42, 0.1)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        ctx.font = isSelected ? 'bold 12px Plus Jakarta Sans, sans-serif' : '500 11px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = isSelected ? '#0F172A' : '#64748B';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + radius + 16);
      });

      ctx.restore();
    };

    render();
  }, [filteredNodes, activeEdges, zoomLevel, panOffset, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const clickY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

    for (const node of filteredNodes) {
      const pos = nodePositions[node.id];
      if (!pos) continue;
      const dist = Math.hypot(clickX - pos.x, clickY - pos.y);
      if (dist <= node.val + 6) {
        setSelectedNode(node);
        toast({ title: `Selected ${node.label}`, description: `Loaded schema for type ${node.type}` });

        return;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const connectedEdges = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GitMerge className="w-7 h-7 text-blue-600" /> Interactive Graph Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">2D Topology visualization mapping entity relations in CognoDB graph format.</p>

        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Founder
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Startup
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Investor
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Mentor
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" /> Tech
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 px-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Industry
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Filter Type:</span>
          {['All', 'Founder', 'Startup', 'Investor', 'Mentor', 'Technology', 'Industry'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.5))}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-md h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full"
          />

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Showing {filteredNodes.length} Entities & {activeEdges.length} Edges
          </div>
        </div>

        <Card className="space-y-6 flex flex-col justify-between h-[600px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                    Selected Graph Entity
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedNode.label}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedNode.subtitle}</p>
                </div>
                <Badge variant="blue" size="md">{selectedNode.type}</Badge>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entity Parameters</h4>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Entity ID:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedNode.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Entity Rank / Weight:</span>
                    <span className="font-bold text-blue-600">{selectedNode.val}</span>
                  </div>

                  {selectedNode.details && Object.entries(selectedNode.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500 capitalize">{k}:</span>
                      <span className="font-semibold text-slate-900">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Connected Relationships ({connectedEdges.length})</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {connectedEdges.map((edge) => (
                    <div key={edge.id} className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-medium text-slate-700">{edge.source}</span>
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {edge.label}
                      </span>
                      <span className="font-medium text-slate-700">{edge.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" /> CognoDB Query Preview
                </h4>
                <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
{`MATCH (n:${selectedNode.type} {id: "${selectedNode.id}"})-[r]->(target)
RETURN n, r, target
LIMIT 10;`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">Click any node on the graph canvas to inspect relationships</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
