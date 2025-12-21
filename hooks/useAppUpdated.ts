import { useEffect } from "react";
import * as Application from "expo-application";
import { SheetManager } from "react-native-actions-sheet";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function useAppUpdated() {
    const previousVersion = useSettingsStore(state => state.previousVersion);
    const setPreviousVersion = useSettingsStore(state => state.setPreviousVersion);

    useEffect(() => {
        const currentVersion = Application.nativeApplicationVersion!;
        if (previousVersion === undefined) {
            setPreviousVersion(currentVersion);
            return;
        }

        if (previousVersion === currentVersion) {
            return;
        }

        setPreviousVersion(currentVersion);

        SheetManager.show("app-updated-sheet");
    }, [previousVersion]);
}