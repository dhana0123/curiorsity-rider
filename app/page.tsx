"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { buildTree, TreeNode } from "./utils/buildTree";

const Tree = dynamic(() => import("react-d3-tree"), { 
  ssr: false,
  loading: () => <div>Loading tree...</div>
});

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    async function fetchData() {
      try {
        const { data } = await axios.get("/api/topics");
        const tree = buildTree(data);
        setTreeData(tree);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }
    fetchData();
  }, [isClient]);

  const renderNode = ({ nodeDatum }: { nodeDatum: TreeNode }) => (
    <g>
      <circle
        r={20}
        fill={
          nodeDatum.status === "completed"
            ? "green"
            : nodeDatum.status === "learning"
            ? "yellow"
            : "gray"
        }
      />
      <text x={30} y={5}>{nodeDatum.name}</text>
    </g>
  );

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {treeData.length > 0 ? (
        <Tree
          data={treeData[0]}
          collapsible={true}
          orientation="vertical"
          renderCustomNodeElement={renderNode}
          translate={{ x: 300, y: 50 }}
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>No data available</div>
        </div>
      )}
    </div>
  );
}
