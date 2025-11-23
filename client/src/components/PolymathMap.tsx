import {useCourses} from "@/api/courses";
import {useCallback, useRef, useMemo, useState} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  Position,
} from "reactflow";
import type {
  Node,
  Edge,
  ReactFlowInstance,
  Connection as RFConnection,
} from "reactflow";
import "reactflow/dist/style.css";

type CourseNodeData = {
  label: string;
  type: "center" | "domain" | "course" | "module" | "lesson";
  description?: string;
  locked?: boolean;
};

// Type for course nodes
type CourseNode = Node<CourseNodeData>;

type PolymathMapProps = {
  courses: any;
  onNodeClick?: (node: Node) => void;
};

export function PolymathMap() {
  const {data, isLoading, error} = useCourses();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CourseNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Process courses data into nodes and edges
  const processCourses = useCallback((coursesData: Record<string, any>) => {
    const newNodes: Array<Node<CourseNodeData>> = [];
    const newEdges: Array<Edge> = [];

    // Add central node
    const centerNode: Node = {
      id: "center",
      data: {
        label: "Santhosh · Polymath",
        type: "center",
        description: "Your learning journey hub",
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      position: {x: 0, y: 0},
      style: {
        background: "white",
        color: "hsl(var(--primary-foreground))",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "8px",
        fontWeight: 600,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    };

    newNodes.push(centerNode);

    const convert = (data: any, parentKey: string, depth: number) => {
      if (!data) return;

      let obj = {};
      if (depth === 0) {
        obj = data.domains;
      } else if (depth === 1) {
        obj = data.branches;
      }

      Object.entries(obj).flatMap(([key, value], index) => {
        const node: Node = {
          id: key,
          data: {
            label: value.name,
            description: "Your learning journey hub",
          },
          position: {
            y: Math.floor(index) * 150,
            x: depth * 350,
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: {
            background: "white",
            color: "hsl(var(--primary-foreground))",
            border: "2px solid hsl(var(--primary))",
            borderRadius: "8px",
            fontWeight: 600,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        };

        const edge: Edge = {
          id: `${depth}-${parentKey}-${key}`,
          type: "default",
          source: parentKey,
          target: key,
        };

        newNodes.push(node);
        newEdges.push(edge);

        convert(value, key, depth + 1);
      });
    };

    convert(coursesData, "center", 0);
    return {nodes: newNodes, edges: newEdges};
  }, []);

  // Initialize nodes and edges
  useMemo(() => {
    if (data) {
      const {nodes: initialNodes, edges: initialEdges} = processCourses(data);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [data, processCourses, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: RFConnection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = (instance: ReactFlowInstance) => {
    setRfInstance(instance);
    // Fit view after initial render
    setTimeout(() => {
      if (instance) {
        instance.fitView({padding: 0.2});
      }
    }, 100);
  };

  console.log(data);

  const nodeTypes = useMemo<Record<string, React.ComponentType<any>>>(
    () => ({}),
    []
  );
  const edgeTypes = useMemo<Record<string, React.ComponentType<any>>>(
    () => ({}),
    []
  );

  return (
    <div className="h-[100vh] w-full bg-background/60">
      <div className="h-full w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          nodesDraggable={true}
          nodesConnectable={false}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={true}
          panOnDrag={[1, 2]} // Only allow pan with right/middle mouse button
          selectionOnDrag={false}
          proOptions={{hideAttribution: true}}
          className="rounded-lg"
        >
          <Background color="#aaa" gap={16} />
          <Controls
            position="top-right"
            showInteractive={true}
            style={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "6px",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "4px",
            }}
          />
          <Panel
            position="bottom-center"
            className="text-sm text-muted-foreground"
          >
            Drag to pan • Scroll to zoom • Click and drag nodes to rearrange
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
