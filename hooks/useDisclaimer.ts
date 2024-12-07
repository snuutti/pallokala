import { useEffect } from "react";
import { useModal } from "@/context/ModalProvider";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function useDisclaimer() {
    const { createAlertModal } = useModal();
    const disclaimerRead = useSettingsStore(state => state.disclaimerRead);
    const setDisclaimerRead = useSettingsStore(state => state.setDisclaimerRead);

    useEffect(() => {
        if (disclaimerRead) {
            return;
        }

        createAlertModal(
            "Thanks for trying out Pallokala!",
            "Pallokala is still in development and is missing some features and contains bugs. Please report any issues you find.",
            [
                {
                    text: "Got it",
                    onPress: () => setDisclaimerRead()
                }
            ],
            () => {},
            false
        );

    }, [disclaimerRead]);
}