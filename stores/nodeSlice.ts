import { StateCreator } from "zustand";
import { Node } from "pufferpanel";

export interface NodeSlice {
    nodes: Node[];
    addNode: (node: Node) => void;
    setNodes: (nodes: Node[]) => void;
    modifyNode: (id: number, node: Partial<Node>) => void;
    removeNode: (id: number) => void;
}

export const createNodeSlice: StateCreator<NodeSlice> = (set) => ({
    nodes: [],
    addNode: (node) => set(state => ({ nodes: [...state.nodes, node] })),
    setNodes: (nodes) => set({ nodes }),
    modifyNode: (id, node) => set(state => ({ nodes: state.nodes.map(n => n.id === id ? { ...n, ...node } : n )})),
    removeNode: (id) => set(state => ({ nodes: state.nodes.filter(node => node.id !== id) }))
});