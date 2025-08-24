import { Notifier, NotifierComponents, ShowNotificationParams } from "react-native-notifier";
import { useColors } from "@/hooks/useStyle";

export default function useToast() {
    const colors = useColors();

    const showSuccessAlert = (title?: string, description?: string, params?: ShowNotificationParams<typeof NotifierComponents.Alert>) => {
        Notifier.showNotification({
            title,
            description,
            Component: NotifierComponents.Alert,
            componentProps: {
                alertType: "success",
                backgroundColor: colors.success,
                textColor: colors.textPrimary
            },
            ...params
        });
    };

    const showErrorAlert = (title?: string, description?: string, params?: ShowNotificationParams<typeof NotifierComponents.Alert>) => {
        Notifier.showNotification({
            title,
            description,
            Component: NotifierComponents.Alert,
            componentProps: {
                alertType: "error",
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