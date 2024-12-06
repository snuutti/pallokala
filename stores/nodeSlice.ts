import { StateCreator } from "zustand";
import { Node } from "pufferpanel";

export interface NodeSlice {
    nodes: Node[];
    addNode: (node: Node) => void;
    setNodes: (nodes: Node[]) => void;
    removeNode: (id: number) => void;
}

export const createNodeSlice: StateCreator<NodeSlice> = (set) => ({
    nodes: [],
    addNode: (node) => set(state => ({ nodes: [...state.nodes, node] })),
    setNodes: (nodes) => set({ nodes }),
    removeNode: (id) => set(state => ({ nodes: state.nodes.filter(node => node.id !== id) }))
});