import { StateCreator } from "zustand";
import { MetadataType, ConditionalMetadataType } from "pufferpanel";
import { Environment } from "@/types/template";

export type EnvironmentData = {
    data: MetadataType;
    unsupportedEnvironments: Environment[];
    adding: boolean;
};

export interface EditorSlice {
    initialOperatorData?: ConditionalMetadataType;
    returnedOperatorData?: ConditionalMetadataType;
    initialEnvironmentData?: EnvironmentData;
    returnedEnvironmentData?: MetadataType;
    setInitialOperatorData: (data?: ConditionalMetadataType) => void;
    setReturnedOperatorData: (data?: ConditionalMetadataType) => void;
    setInitialEnvironmentData: (data?: EnvironmentData) => void;
    setReturnedEnvironmentData: (data?: MetadataType) => void;
}

export const createEditorSlice: StateCreator<EditorSlice> = (set) => ({
    initialOperatorData: undefined,
    returnedOperatorData: undefined,
    initialEnvironmentData: undefined,
    returnedEnvironmentData: undefined,
    setInitialOperatorData: (data) => set({ initialOperatorData: data }),
    setReturnedOperatorData: (data) => set({ returnedOperatorData: data }),
    setInitialEnvironmentData: (data) => set({ initialEnvironmentData: data }),
    setReturnedEnvironmentData: (data) => set({ returnedEnvironmentData: data })
});