import { create as actualCreate, StateCreator } from "zustand";
import { createServerSlice, ServerSlice } from "@/stores/serverSlice";
import { createNodeSlice, NodeSlice } from "@/stores/nodeSlice";
import { createUserSlice, UserSlice } from "@/stores/userSlice";
import { createEditorSlice, EditorSlice } from "@/stores/editorSlice";

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

export const useBoundStore = create<ServerSlice & NodeSlice & UserSlice & EditorSlice>()((...a) => ({
    ...createServerSlice(...a),
    ...createNodeSlice(...a),
    ...createUserSlice(...a),
    ...createEditorSlice(...a),
}));