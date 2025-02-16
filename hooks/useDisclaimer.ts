import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/context/ModalProvider";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function useDisclaimer() {
    const { t } = useTranslation();
    const { createAlertModal } = useModal();
    const disclaimerRead = useSettingsStore(state => state.disclaimerRead);
    const setDisclaimerRead = useSettingsStore(state => state.setDisclaimerRead);

    useEffect(() => {
        if (disclaimerRead) {
            return;
        }

        createAlertModal(
            t("app:Modal.Disclaimer.Title"),
            t("app:Modal.Disclaimer.Body"),
            [
                {
                    text: t("app:Modal.Disclaimer.GotIt"),
                    icon: "check",
                    onPress: () => setDisclaimerRead()
                }
            ],
            {
                closable: false
            }
        );
    }, [disclaimerRead]);
}