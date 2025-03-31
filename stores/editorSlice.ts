import { StateCreator } from "zustand";
import { MetadataType, Group, ConditionalMetadataType } from "pufferpanel";
import { ExtendedVariable, Environment } from "@/types/template";

export type EnvironmentData = {
    data: MetadataType;
    unsupportedEnvironments: Environment[];
    adding: boolean;
};

export interface EditorSlice {
    initialVariableData?: ExtendedVariable;
    returnedVariableData?: ExtendedVariable;
    initialVariableGroupData?: Group;
    returnedVariableGroupData?: Group;
    initialOperatorData?: ConditionalMetadataType;
    returnedOperatorData?: ConditionalMetadataType;
    initialEnvironmentData?: EnvironmentData;
    returnedEnvironmentData?: MetadataType;
    setInitialVariableData: (data?: ExtendedVariable) => void;
    setReturnedVariableData: (data?: ExtendedVariable) => void;
    setInitialVariableGroupData: (data?: Group) => void;
    setReturnedVariableGroupData: (data?: Group) => void;
    setInitialOperatorData: (data?: ConditionalMetadataType) => void;
    setReturnedOperatorData: (data?: ConditionalMetadataType) => void;
    setInitialEnvironmentData: (data?: EnvironmentData) => void;
    setReturnedEnvironmentData: (data?: MetadataType) => void;
}

export const createEditorSlice: StateCreator<EditorSlice> = (set) => ({
    initialVariableData: undefined,
    returnedVariableData: undefined,
    initialVariableGroupData: undefined,
    returnedVariableGroupData: undefined,
    initialOperatorData: undefined,
    returnedOperatorData: undefined,
    initialEnvironmentData: undefined,
    returnedEnvironmentData: undefined,
    setInitialVariableData: (data) => set({ initialVariableData: data }),
    setReturnedVariableData: (data) => set({ returnedVariableData: data }),
    setInitialVariableGroupData: (data) => set({ initialVariableGroupData: data }),
    setReturnedVariableGroupData: (data) => set({ returnedVariableGroupData: data }),
    setInitialOperatorData: (data) => set({ initialOperatorData: data }),
    setReturnedOperatorData: (data) => set({ returnedOperatorData: data }),
    setInitialEnvironmentData: (data) => set({ initialEnvironmentData: data }),
    setReturnedEnvironmentData: (data) => set({ returnedEnvironmentData: data })
});