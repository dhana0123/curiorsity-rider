import {useCourses} from "@/api/courses";
import {useCallback, useRef, useMemo, useState, useEffect} from "react";
import ReactFlow, {
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
import {CourseNode} from "./CourseNode";

type CourseNodeData = {
  label: string;
  type: "center" | "domain" | "branch" | "course" | "lesson";
  description?: string;
  locked?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onExpand?: (nodeId: string) => void;
  onCollapse?: (nodeId: string) => void;
};

type LayoutInfo = {
  nodeY: number;
  subtreeHeight: number;
};

export function PolymathMap() {
  const {data, isLoading, error} = useCourses();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CourseNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [coursesData, setCoursesData] = useState<Record<string, any> | null>(null);

  // Store the full course data structure and initialize center as expanded
  useEffect(() => {
    if (data) {
      setCoursesData(data);
      // Initialize center as expanded so domains show by default
      setExpandedNodes(new Set(["center"]));
    }
  }, [data]);

  // Expand handler
  const handleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      newSet.add(nodeId);
      return newSet;
    });
  }, []);

  // Collapse handler - also collapses all children
  const handleCollapse = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      // Remove all children of this node
      Array.from(newSet).forEach((id) => {
        if (id.startsWith(nodeId + "-")) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  }, []);

  // Check if a node has children
  const hasChildren = useCallback(
    (nodeId: string, depth: number): boolean => {
      if (!coursesData) return false;

      if (nodeId === "center") {
        return !!(coursesData.domains && Object.keys(coursesData.domains).length > 0);
      }

      const path = nodeId.split("-").filter((p) => p !== "center" && p !== "lesson");
      let current: any = coursesData.domains;

      // Navigate to the node in the data structure
      for (const key of path) {
        if (!current || !current[key]) return false;
        current = current[key];
      }

      // Check if it has children at the next depth level
      if (depth === 0) {
        return !!(current.branches && Object.keys(current.branches).length > 0);
      } else if (depth === 1) {
        return !!(current.courses && Object.keys(current.courses).length > 0);
      } else if (depth === 2) {
        // Check for modules/lessons structure
        if (current.modules && Array.isArray(current.modules) && current.modules.length > 0) {
          return current.modules.some((module: any) => 
            module.lessons && Array.isArray(module.lessons) && module.lessons.length > 0
          );
        }
        // Also check for topics array (old structure)
        return !!(current.topics && Array.isArray(current.topics) && current.topics.length > 0);
      }

      return false;
    },
    [coursesData]
  );

  // Get children data for a node
  const getChildrenData = useCallback(
    (nodeId: string, depth: number): Record<string, any> | null => {
      if (!coursesData) return null;

      if (nodeId === "center") {
        return coursesData.domains || null;
      }

      const path = nodeId.split("-").filter((p) => p !== "center" && p !== "lesson");
      let current: any = coursesData.domains;

      for (const key of path) {
        if (!current || !current[key]) return null;
        current = current[key];
      }

      if (depth === 0) {
        return current.branches || null;
      } else if (depth === 1) {
        return current.courses || null;
      } else if (depth === 2) {
        // Handle modules/lessons structure
        if (current.modules && Array.isArray(current.modules)) {
          const lessonsObj: Record<string, any> = {};
          current.modules.forEach((module: any, moduleIndex: number) => {
            if (module.lessons && Array.isArray(module.lessons)) {
              module.lessons.forEach((lesson: any, lessonIndex: number) => {
                const key = `${moduleIndex}-${lessonIndex}`;
                lessonsObj[key] = {
                  name: lesson.title || lesson.name || `Lesson ${lessonIndex + 1}`,
                  isLesson: true,
                };
              });
            }
          });
          if (Object.keys(lessonsObj).length > 0) return lessonsObj;
        }
        // Fallback to topics array (old structure)
        if (Array.isArray(current.topics)) {
          const topicsObj: Record<string, any> = {};
          current.topics.forEach((topic: string, index: number) => {
            topicsObj[index] = {name: topic, isTopic: true};
          });
          return topicsObj;
        }
      }

      return null;
    },
    [coursesData]
  );

  // Process courses data into nodes and edges (only show expanded levels)
  const processCourses = useCallback(
    (coursesData: Record<string, any>, expanded: Set<string>) => {
      const newNodes: Array<Node<CourseNodeData>> = [];
      const newEdges: Array<Edge> = [];

      if (!coursesData || !coursesData.domains) {
        return {nodes: newNodes, edges: newEdges};
      }

      // Helper to calculate subtree height recursively
      const calcSubtreeHeight = (nodeId: string, depth: number): number => {
        if (!expanded.has(nodeId)) return depth === 0 ? 150 : depth === 1 ? 120 : depth === 2 ? 100 : 80;
        
        const childrenData = getChildrenData(nodeId, depth);
        if (!childrenData) return depth === 0 ? 150 : depth === 1 ? 120 : depth === 2 ? 100 : 80;
        
        const childrenEntries = Object.entries(childrenData);
        let totalHeight = 0;
        const spacing = depth === 0 ? 150 : depth === 1 ? 120 : depth === 2 ? 100 : 80;
        
        childrenEntries.forEach(([childKey]) => {
          const childNodeId = depth === 0 ? childKey : `${nodeId}-${childKey}`;
          totalHeight += calcSubtreeHeight(childNodeId, depth + 1);
        });
        
        return Math.max(totalHeight, spacing);
      };

      // Helper to get node name
      const getNodeName = (nodeId: string, depth: number): string => {
        if (nodeId === "center") return "Santhosh · Polymath";
        
        const path = nodeId.split("-").filter((p) => p !== "center" && p !== "lesson");
        let current: any = coursesData.domains;
        let name = nodeId;

        for (const key of path) {
          if (!current || !current[key]) break;
          current = current[key];
          if (current?.name) name = current.name;
        }

        if (nodeId.includes("-lesson-")) {
          const parts = nodeId.split("-lesson-");
          const coursePath = parts[0].split("-");
          let courseData: any = coursesData.domains;
          for (const key of coursePath.filter((p) => p !== "center")) {
            if (!courseData || !courseData[key]) break;
            courseData = courseData[key];
          }
          if (courseData?.modules) {
            const lessonParts = parts[1].split("-");
            const moduleIndex = parseInt(lessonParts[0]);
            const lessonIndex = parseInt(lessonParts[1]);
            if (courseData.modules[moduleIndex]?.lessons?.[lessonIndex]) {
              name = courseData.modules[moduleIndex].lessons[lessonIndex].title || 
                     courseData.modules[moduleIndex].lessons[lessonIndex].name || 
                     `Lesson ${lessonIndex + 1}`;
            }
          } else if (courseData?.topics) {
            const topicIndex = parseInt(parts[1]);
            if (courseData.topics[topicIndex]) name = courseData.topics[topicIndex];
          }
        }

        return name;
      };

      // Add central node
      const centerHasChildren = Object.keys(coursesData.domains).length > 0;
      const centerNode: Node<CourseNodeData> = {
        id: "center",
        type: "custom",
        data: {
          label: "Santhosh · Polymath",
          type: "center",
          description: "Your learning journey hub",
          hasChildren: centerHasChildren,
          isExpanded: expanded.has("center"),
          onExpand: handleExpand,
          onCollapse: handleCollapse,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        position: {x: 0, y: 0},
      };
      newNodes.push(centerNode);

      // Recursive function to build nodes with proper spacing
      const buildNodes = (
        parentId: string,
        depth: number,
        startY: number
      ): number => {
        if (!expanded.has(parentId)) return startY;

        const childrenData = getChildrenData(parentId, depth);
        if (!childrenData) return startY;

        const childrenEntries = Object.entries(childrenData);
        let currentY = startY;

        childrenEntries.forEach(([childKey, childValue]: [string, any]) => {
          const childNodeId = depth === 0 ? childKey : `${parentId}-${childKey}`;
          const childDepth = depth + 1;
          const childHasChildren = hasChildren(childNodeId, childDepth);
          const isChildExpanded = expanded.has(childNodeId);

          // Calculate subtree height for this child
          const subtreeHeight = calcSubtreeHeight(childNodeId, childDepth);
          const spacing = childDepth === 0 ? 150 : childDepth === 1 ? 120 : childDepth === 2 ? 100 : 80;
          const nodeY = currentY + subtreeHeight / 2 - spacing / 2;
          
          // X position based on childDepth with proper spacing
          // Center (depth -1) = 0, Domains (0) = 400, Branches (1) = 800, Courses (2) = 1200, Lessons (3) = 1600
          const xPosition = (childDepth + 1) * 600;

          const nodeName = getNodeName(childNodeId, childDepth);
          const nodeType = childDepth === 0 ? "domain" : childDepth === 1 ? "branch" : childDepth === 2 ? "course" : "lesson";

          const node: Node<CourseNodeData> = {
            id: childNodeId,
            type: "custom",
            data: {
              label: nodeName.length > 50 ? nodeName.substring(0, 50) + "..." : nodeName,
              type: nodeType,
              description: nodeName,
              hasChildren: childHasChildren,
              isExpanded: isChildExpanded,
              onExpand: handleExpand,
              onCollapse: handleCollapse,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            position: {x: xPosition, y: nodeY},
          
          };

          const edge: Edge = {
            id: `${parentId}-${childNodeId}-edge`,
            type: "default",
            source: parentId,
            target: childNodeId,
            markerEnd: {type: MarkerType.ArrowClosed},
            style: {
              stroke: "gray",
              strokeWidth: 2,
            },
          };

          newNodes.push(node);
          newEdges.push(edge);

          // Recursively build children if expanded (starting from currentY)
          if (isChildExpanded) {
            buildNodes(childNodeId, childDepth, currentY);
          }
          
          // Move currentY forward by subtree height for next sibling
          currentY += subtreeHeight;
        });

        return currentY;
      };

      // Build nodes starting from center
      if (expanded.has("center")) {
        const domains = coursesData.domains || {};
        const domainEntries = Object.entries(domains);
        const totalDomainHeight = domainEntries.reduce((sum, [key]) => {
          return sum + calcSubtreeHeight(key, 0);
        }, 0);
        const startY = -totalDomainHeight / 2;
        buildNodes("center", -1, startY);
      }

      return {nodes: newNodes, edges: newEdges};
    },
    [hasChildren, getChildrenData, handleExpand, handleCollapse, coursesData]
  );

  // Update nodes and edges when expanded nodes change
  useEffect(() => {
    if (coursesData) {
      const {nodes: newNodes, edges: newEdges} = processCourses(coursesData, expandedNodes);
      setNodes(newNodes);
      setEdges(newEdges);

      // Fit view after nodes are updated
      if (rfInstance && newNodes.length > 0) {
        setTimeout(() => {
          rfInstance.fitView({padding: 0.2, duration: 400});
        }, 100);
      }
    }
  }, [coursesData, expandedNodes, processCourses, setNodes, setEdges, rfInstance]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance);
    setTimeout(() => {
      if (instance) {
        instance.fitView({padding: 0.2, duration: 400});
      }
    }, 200);
  }, []);

  const nodeTypes = useMemo(
    () => ({
      custom: CourseNode,
    }),
    []
  );

  if (isLoading) {
    return (
      <div className="h-[100vh] w-full bg-background/60 flex items-center justify-center">
        <div className="text-muted-foreground">Loading course tree...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[100vh] w-full bg-background/60 flex items-center justify-center">
        <div className="text-destructive">Error loading courses: {String(error)}</div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-full bg-background/60">
      <div className="h-full w-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={true}
          nodesConnectable={false}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={true}
          panOnDrag={[1, 2]}
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
          <Panel position="bottom-center" className="text-sm text-muted-foreground">
            Click expand button to show children • Scroll to zoom • Drag to pan
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
