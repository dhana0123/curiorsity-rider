import {useCallback, useRef, useMemo, useState} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
} from "reactflow";
import type {
  Node,
  Edge,
  ReactFlowInstance,
  EdgeTypes,
  NodeTypes,
  Connection as RFConnection,
  EdgeAddChange,
  NodeAddChange,
  NodeRemoveChange,
  EdgeRemoveChange,
  NodeResetChange,
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

export function PolymathMap({courses, onNodeClick}: PolymathMapProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CourseNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Process courses data into nodes and edges
  const processCourses = useCallback((coursesData: Record<string, any>) => {
    const newNodes: Array<Node<CourseNodeData>> = [];
    const newEdges: Array<Edge> = [];
    let x = 0;
    let y = 0;

    // Add central node
    const centerNode: Node = {
      id: "center",
      type: "default",
      data: {
        label: "Santhosh · Polymath",
        type: "center",
        description: "Your learning journey hub",
      },
      position: {x: 0, y: 0},
      style: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "8px",
        padding: "10px 15px",
        fontWeight: 600,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    };
    newNodes.push(centerNode);

    // Add domain nodes (first level)
    const domainYOffset = 150;
    const domainXSpacing = 250;

    Object.entries(coursesData).forEach(
      ([domainId, domainData]: [string, any], index) => {
        const domainNode: Node = {
          id: `domain-${domainId}`,
          type: "default",
          data: {
            label: domainData.title || domainId,
            type: "domain",
            description: domainData.description || "",
          },
          position: {
            x: (index - 1) * domainXSpacing,
            y: domainYOffset,
          },
          style: {
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            border: "2px solid hsl(var(--primary))",
            borderRadius: "8px",
            padding: "8px 12px",
            fontWeight: 500,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        };
        newNodes.push(domainNode);

        // Connect domain to center
        newEdges.push({
          id: `edge-center-${domainId}`,
          source: "center",
          target: `domain-${domainId}`,
          type: "smoothstep",
          style: {
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
            backgroundColor: "hsl(var(--primary))",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "hsl(var(--primary))",
            width: 12,
            height: 12,
          },
        });

        // Add courses under each domain
        const courseYOffset = domainYOffset + 100;
        if (domainData.courses) {
          Object.entries(domainData.courses).forEach(
            ([courseId, course]: [string, any], courseIndex) => {
              const courseNode: Node = {
                id: `course-${domainId}-${courseId}`,
                type: "default",
                data: {
                  label: course.title || courseId,
                  type: "course",
                  description: course.description || "",
                },
                position: {
                  x: (index - 1) * domainXSpacing + courseIndex * 200 - 100,
                  y: courseYOffset,
                },
                style: {
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  border: "2px solid hsl(var(--primary))",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
                },
              };
              newNodes.push(courseNode);

              // Connect course to domain
              newEdges.push({
                id: `edge-${domainId}-${courseId}`,
                source: `domain-${domainId}`,
                target: `course-${domainId}-${courseId}`,
                type: "smoothstep",
                style: {
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 1.5,
                  backgroundColor: "hsl(var(--primary))",
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "hsl(var(--primary))",
                  width: 12,
                  height: 12,
                },
              });
            }
          );
        }
      }
    );

    return {nodes: newNodes, edges: newEdges};
  }, []);

  // Initialize nodes and edges
  useMemo(() => {
    const {nodes: initialNodes, edges: initialEdges} = processCourses(courses);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [courses, processCourses, setNodes, setEdges]);

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

  const nodeTypes = useMemo<Record<string, React.ComponentType<any>>>(
    () => ({}),
    []
  );
  const edgeTypes = useMemo<Record<string, React.ComponentType<any>>>(
    () => ({}),
    []
  );

  return (
    <div className="h-[500px] w-full rounded-lg border border-border bg-background/60">
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
          defaultViewport={{x: 0, y: 0, zoom: 0.8}}
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
            showInteractive={false}
            style={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: "6px",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "4px",
            }}
          />
          <Panel
            position="top-center"
            className="text-sm text-muted-foreground"
          >
            Drag to pan • Scroll to zoom • Click and drag nodes to rearrange
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
