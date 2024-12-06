import { create as actualCreate, StateCreator } from "zustand";
import { createNodeSlice, NodeSlice } from "@/stores/nodeSlice";

const storeResetFns = new Set<() => void>();

const create = (<T>() => {
    return (stateCreator: StateCreator<T>) => {
        const store = actualCreate(stateCreator);
        const initialState = store.getInitialState();
        storeResetFns.add(() => store.setState(initialState, true));
        return store;
    };
}) as typeof actualCreate;

export const resetAllStores = () => {
    storeResetFns.forEach(resetFn => resetFn());
};

export const useBoundStore = create<NodeSlice>()((...a) => ({
    ...createNodeSlice(...a),
}));