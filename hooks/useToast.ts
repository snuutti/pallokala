import { Notifier, NotifierComponents, ShowNotificationParams } from "react-native-notifier";
import { AlertComponent } from "react-native-notifier/src/ui-components/Alert";
import { useColors } from "@/hooks/useStyle";

export default function useToast() {
    const colors = useColors();

    const showSuccessAlert = (title?: string, description?: string, params?: ShowNotificationParams<typeof AlertComponent>) => {
        Notifier.showNotification({
            title,
            description,
            Component: NotifierComponents.Alert,
            componentProps: {
                type: "success",
                backgroundColor: colors.success,
                textColor: colors.textPrimary
            },
            ...params
        });
    };

    const showErrorAlert = (title?: string, description?: string, params?: ShowNotificationParams<typeof AlertComponent>) => {
        Notifier.showNotification({
            title,
            description,
            Component: NotifierComponents.Alert,
            componentProps: {
                type: "error",
                backgroundColor: colors.error,
                textColor: colors.textPrimary
            },
            ...params
        });
    };

    return {
        showSuccessAlert,
        showErrorAlert
    };
}