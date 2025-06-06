import { HybridObject } from "react-native-nitro-modules";

export type VariableType = string | number | boolean;

export interface Conditions extends HybridObject<{ android: "kotlin" }> {
    resolve(script: string, data: Record<string, VariableType>): boolean;
}
