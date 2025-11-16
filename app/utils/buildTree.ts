// utils/buildTree.ts

import { Topic } from "../modals/topics";

export interface TreeNode {
  name: string;
  id?: string;
  status?: "not-started" | "learning" | "completed";
  children?: TreeNode[];
}

// Intermediate type for building the tree
interface FlatTreeNode {
  name: string;
  children: Record<string, FlatTreeNode> | TreeNode[];
}

// Type guard to check if children is an array
function hasArrayChildren(node: FlatTreeNode): node is { name: string; children: TreeNode[] } {
  return Array.isArray(node.children);
}

// Type guard to check if children is a record
function hasRecordChildren(node: FlatTreeNode): node is { name: string; children: Record<string, FlatTreeNode> } {
  return !Array.isArray(node.children);
}

export function buildTree(flatData: Topic[]): TreeNode[] {
  const tree: Record<string, FlatTreeNode> = {};

  flatData.forEach((item) => {
    // Domain
    if (!tree[item.domain])
      tree[item.domain] = { name: item.domain, children: {} };
    const domainNode = tree[item.domain];

    // Branch
    if (!hasRecordChildren(domainNode)) {
      domainNode.children = {} as Record<string, FlatTreeNode>;
    }
    const domainChildren = domainNode.children as Record<string, FlatTreeNode>;
    if (!(item.branch in domainChildren)) {
      domainChildren[item.branch] = { name: item.branch, children: {} };
    }
    const branchNode = domainChildren[item.branch];

    // Course
    if (!hasRecordChildren(branchNode)) {
      branchNode.children = {} as Record<string, FlatTreeNode>;
    }
    const branchChildren = branchNode.children as Record<string, FlatTreeNode>;
    if (!(item.course in branchChildren)) {
      branchChildren[item.course] = { name: item.course, children: [] };
    }
    const courseNode = branchChildren[item.course];

    // Topic
    (courseNode.children as TreeNode[]).push({
      name: item.topic,
      status: item.status,
      id: item._id,
    });
  });

  // Convert intermediate tree to TreeNode[]
  const convert = (obj: FlatTreeNode): TreeNode => {
    const res: TreeNode = { name: obj.name };
    if (hasRecordChildren(obj)) {
      res.children = Object.values(obj.children).map(convert);
    } else if (hasArrayChildren(obj)) {
      res.children = obj.children;
    }
    return res;
  };

  return Object.values(tree).map(convert);
}
