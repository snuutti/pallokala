import { SheetRegister, SheetDefinition } from "react-native-actions-sheet";
import SwitchServerSheet from "@/components/sheets/SwitchServerSheet";
import AppUpdatedSheet from "@/components/sheets/AppUpdatedSheet";

declare module "react-native-actions-sheet" {
    interface Sheets {
        "switch-server-sheet": SheetDefinition;
        "app-updated-sheet": SheetDefinition;
    }
}

export default function Sheets() {
    return (
        <SheetRegister
            sheets={{
                "switch-server-sheet": SwitchServerSheet,
                "app-updated-sheet": AppUpdatedSheet
            }}
        />
    );
}