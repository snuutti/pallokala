import { NitroModules } from "react-native-nitro-modules";
import type { Conditions, VariableType } from "./Conditions.nitro";

const ConditionsHybridObject = NitroModules.createHybridObject<Conditions>("Conditions");

export function resolve(script: string, data: Record<string, VariableType>): boolean {
    return ConditionsHybridObject.resolve(script, data);
}
