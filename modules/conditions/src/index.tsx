import { AnyMap, NitroModules } from "react-native-nitro-modules";
import type { Conditions } from "./Conditions.nitro";

const ConditionsHybridObject = NitroModules.createHybridObject<Conditions>("Conditions");

export function resolve(script: string, data: AnyMap): boolean {
    return ConditionsHybridObject.resolve(script, data);
}
