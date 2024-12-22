import { useEffect } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Application from "expo-application";
import { useModal } from "@/context/ModalProvider";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function useAppUpdated() {
    const { t } = useTranslation();
    const { createAlertModal } = useModal();
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

        createAlertModal(
            "Pallokala just got updated!",
            "Check out what's new in this version.",
            [
                {
                    text: "Go to changelog",
                    icon: "history",
                    onPress: () => router.push("/(modal)/changelog")
                },
                {
                    text: t("common:Close"),
                    icon: "close"
                }
            ],
        );
    }, [previousVersion]);
}