import { StateCreator } from "zustand";
import { MetadataType, ConditionalMetadataType } from "pufferpanel";
import { ExtendedVariable, Environment } from "@/types/template";

export type EnvironmentData = {
    data: MetadataType;
    unsupportedEnvironments: Environment[];
    adding: boolean;
};

export interface EditorSlice {
    initialVariableData?: ExtendedVariable;
    returnedVariableData?: ExtendedVariable;
    initialOperatorData?: ConditionalMetadataType;
    returnedOperatorData?: ConditionalMetadataType;
    initialEnvironmentData?: EnvironmentData;
    returnedEnvironmentData?: MetadataType;
    setInitialVariableData: (data?: ExtendedVariable) => void;
    setReturnedVariableData: (data?: ExtendedVariable) => void;
    setInitialOperatorData: (data?: ConditionalMetadataType) => void;
    setReturnedOperatorData: (data?: ConditionalMetadataType) => void;
    setInitialEnvironmentData: (data?: EnvironmentData) => void;
    setReturnedEnvironmentData: (data?: MetadataType) => void;
}

export const createEditorSlice: StateCreator<EditorSlice> = (set) => ({
    initialVariableData: undefined,
    returnedVariableData: undefined,
    initialOperatorData: undefined,
    returnedOperatorData: undefined,
    initialEnvironmentData: undefined,
    returnedEnvironmentData: undefined,
    setInitialVariableData: (data) => set({ initialVariableData: data }),
    setReturnedVariableData: (data) => set({ returnedVariableData: data }),
    setInitialOperatorData: (data) => set({ initialOperatorData: data }),
    setReturnedOperatorData: (data) => set({ returnedOperatorData: data }),
    setInitialEnvironmentData: (data) => set({ initialEnvironmentData: data }),
    setReturnedEnvironmentData: (data) => set({ returnedEnvironmentData: data })
});