"use client";

import { useMemo } from "react";
import { ReactFlow, Background, Controls, Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface GraphData {
  patient: { id: string; fullName: string };
  sessions: { id: string; title: string; memories: { id: string; type: string; value: string }[] }[];
}

export function MemoryGraph({ data }: { data: GraphData }) {
  const { nodes, edges } = useMemo(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Patient Node (Root)
    newNodes.push({
      id: data.patient.id,
      position: { x: 50, y: 300 },
      data: { label: `Patient: ${data.patient.fullName}` },
      type: "input",
      style: { background: "#f8fafc", border: "2px solid #0f172a", fontWeight: "bold", borderRadius: "8px" }
    });

    data.sessions.forEach((session, sIdx) => {
      // Session Node
      const sessionNodeId = `session-${session.id}`;
      const sessionY = 100 + (sIdx * 200);
      
      newNodes.push({
        id: sessionNodeId,
        position: { x: 300, y: sessionY },
        data: { label: session.title },
        style: { background: "#eff6ff", border: "1px solid #3b82f6", borderRadius: "6px" }
      });

      newEdges.push({
        id: `e-${data.patient.id}-${sessionNodeId}`,
        source: data.patient.id,
        target: sessionNodeId,
        animated: true,
        style: { stroke: "#94a3b8" }
      });

      // Memory Entities
      session.memories.forEach((memory, mIdx) => {
        const memNodeId = `mem-${memory.id}`;
        newNodes.push({
          id: memNodeId,
          position: { x: 600, y: sessionY - 50 + (mIdx * 60) },
          data: { label: `${memory.type}: ${memory.value}` },
          style: { background: "#fdf4ff", border: "1px solid #d946ef", fontSize: "12px", borderRadius: "4px" }
        });

        newEdges.push({
          id: `e-${sessionNodeId}-${memNodeId}`,
          source: sessionNodeId,
          target: memNodeId,
          style: { stroke: "#cbd5e1" }
        });
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [data]);

  return (
    <div className="h-[500px] w-full border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#cbd5e1" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
