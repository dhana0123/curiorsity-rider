"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { buildTree, TreeNode } from "./utils/buildTree";

const Tree = dynamic(() => import("react-d3-tree"), { ssr: false });

export default function Home() {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("/api/topics");
      const tree = buildTree(data);
      setTreeData(tree);
    }
    fetchData();
  }, []);

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

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {treeData.length > 0 && (
        <Tree
          data={treeData[0]}
          collapsible={true}
          orientation="vertical"
          renderCustomNodeElement={renderNode}
          translate={{ x: 300, y: 50 }}
        />
      )}
    </div>
  );
}
