import { SheetRegister, SheetDefinition } from "react-native-actions-sheet";
import SwitchServerSheet from "@/components/sheets/SwitchServerSheet";

declare module "react-native-actions-sheet" {
    interface Sheets {
        "switch-server-sheet": SheetDefinition;
    }
}

export default function Sheets() {
    return (
        <SheetRegister
            sheets={{
                "switch-server-sheet": SwitchServerSheet
            }}
        />
    );
}