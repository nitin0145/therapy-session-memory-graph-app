"use client";

import { useEffect } from "react";
import { ReactFlow, Background, Controls, Edge, Node, Handle, Position, MarkerType, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Brain, Calendar, Activity, Pill, User, AlertTriangle, ShieldCheck } from "lucide-react";

interface GraphData {
  patient: { id: string; fullName: string };
  sessions: { id: string; title: string; memories: { id: string; type: string; value: string }[] }[];
}

// Premium Custom Node
const CustomNode = ({ data }: { data: { isPatient?: boolean; isSession?: boolean; type?: string; label?: string } }) => {
  const isPatient = data.isPatient;
  const isSession = data.isSession;

  let Icon = Brain;
  let bgClass = "bg-slate-100";
  let borderClass = "border-slate-300";
  let textClass = "text-slate-800";

  if (isPatient) {
    bgClass = "bg-slate-900";
    borderClass = "border-slate-900";
    textClass = "text-white";
    Icon = User;
  } else if (isSession) {
    bgClass = "bg-blue-50";
    borderClass = "border-blue-200";
    textClass = "text-blue-900";
    Icon = Calendar;
  } else {
    // Colors based on Memory Type
    switch (data.type) {
      case "Emotion":
        bgClass = "bg-amber-50"; borderClass = "border-amber-200"; textClass = "text-amber-900"; Icon = Activity; break;
      case "Medication":
        bgClass = "bg-purple-50"; borderClass = "border-purple-200"; textClass = "text-purple-900"; Icon = Pill; break;
      case "Person":
        bgClass = "bg-emerald-50"; borderClass = "border-emerald-200"; textClass = "text-emerald-900"; Icon = User; break;
      case "Risk Flag":
      case "Risk":
        bgClass = "bg-red-50"; borderClass = "border-red-200"; textClass = "text-red-900"; Icon = AlertTriangle; break;
      case "Coping Strategy":
        bgClass = "bg-teal-50"; borderClass = "border-teal-200"; textClass = "text-teal-900"; Icon = ShieldCheck; break;
      default:
        bgClass = "bg-slate-50"; borderClass = "border-slate-200"; textClass = "text-slate-900"; Icon = Brain;
    }
  }

  return (
    <div className={`px-4 py-3 min-w-[150px] shadow-sm rounded-xl border-2 ${bgClass} ${borderClass} flex flex-col items-center justify-center text-center gap-1 transition-transform hover:scale-105`}>
      {/* Handles */}
      {!isPatient && <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400" />}
      
      <div className={`p-1.5 rounded-lg bg-white/50 backdrop-blur-sm ${textClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      
      {!isPatient && !isSession && (
        <span className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${textClass}`}>
          {data.type}
        </span>
      )}
      
      <span className={`text-sm font-semibold ${textClass}`}>
        {data.label}
      </span>

      {/* Handles */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export function MemoryGraph({ data }: { data: GraphData }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    const rootX = 500;
    
    // 1. Patient Node (Root)
    newNodes.push({
      id: data.patient.id,
      position: { x: rootX, y: 50 },
      data: { label: data.patient.fullName, isPatient: true },
      type: "custom",
    });

    // We will lay out the graph as a pure Tree:
    // Patient (Root) -> Sessions -> Session's Memories (No sharing)

    // 2. Session Nodes & Memory Nodes
    const sessionSpacingX = 350; // Increased spacing to fit memories
    const totalSessions = data.sessions.length;
    const startX = rootX - ((totalSessions - 1) * sessionSpacingX) / 2;

    data.sessions.forEach((session, sIdx) => {
      const sessionNodeId = `session-${session.id}`;
      const sessionX = startX + (sIdx * sessionSpacingX);
      const sessionY = 200;
      
      // Add Session Node
      newNodes.push({
        id: sessionNodeId,
        position: { x: sessionX, y: sessionY },
        data: { label: session.title, isSession: true },
        type: "custom",
      });

      // Connect Patient to Session
      newEdges.push({
        id: `e-${data.patient.id}-${sessionNodeId}`,
        source: data.patient.id,
        target: sessionNodeId,
        animated: true,
        style: { stroke: "#94a3b8", strokeWidth: 2 }
      });

      // 3. Process Memories for THIS session only (No deduplication)
      // Arrange memories in a mini-grid right below this session
      const memories = session.memories;
      const itemsPerRow = 2; // small grid per session
      const memSpacingX = 160;
      const memSpacingY = 100;
      
      memories.forEach((memory, mIdx) => {
        const memNodeId = `mem-${session.id}-${memory.id}`; // Unique ID per session
        const row = Math.floor(mIdx / itemsPerRow);
        const col = mIdx % itemsPerRow;
        
        const currentItemsInRow = Math.min(itemsPerRow, memories.length - row * itemsPerRow);
        const rowStartX = sessionX - ((currentItemsInRow - 1) * memSpacingX) / 2;
        
        newNodes.push({
          id: memNodeId,
          position: { x: rowStartX + (col * memSpacingX), y: sessionY + 150 + (row * memSpacingY) },
          data: { label: memory.value, type: memory.type },
          type: "custom",
        });

        // Draw edge from session to its dedicated memory node
        newEdges.push({
          id: `e-${sessionNodeId}-${memNodeId}`,
          source: sessionNodeId,
          target: memNodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#cbd5e1" },
          style: { stroke: "#cbd5e1", strokeWidth: 1.5 }
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [data, setNodes, setEdges]);

  return (
    <div className="h-[600px] w-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 shadow-inner overflow-hidden">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} 
        fitView 
        minZoom={0.5} 
        maxZoom={1.5}
      >
        <Background color="#cbd5e1" gap={20} size={1.5} />
        <Controls className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg shadow-sm" />
      </ReactFlow>
    </div>
  );
}
