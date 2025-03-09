import { StateCreator } from "zustand";
import { ConditionalMetadataType } from "pufferpanel";

export interface EditorSlice {
    initialOperatorData?: ConditionalMetadataType;
    returnedOperatorData?: ConditionalMetadataType;
    setInitialOperatorData: (data?: ConditionalMetadataType) => void;
    setReturnedOperatorData: (data?: ConditionalMetadataType) => void;
}

export const createEditorSlice: StateCreator<EditorSlice> = (set) => ({
    initialOperatorData: undefined,
    returnedOperatorData: undefined,
    setInitialOperatorData: (data) => set({ initialOperatorData: data }),
    setReturnedOperatorData: (data) => set({ returnedOperatorData: data })
});