import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useServer } from "@/context/ServerProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useBoundStore } from "@/stores/useBoundStore";

export default function AdminScreen() {
    const { t } = useTranslation();
    const { server } = useServer();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const removeServer = useBoundStore(state => state.removeServer);

    const deleteAlert = () => {
        createAlertModal(
            t("servers:Delete"),
            t("servers:ConfirmDelete", { name: server?.name }),
            [
                {
                    text: t("servers:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteServer
                },
                { text: t("common:Cancel") },
            ]
        );
    };

    const deleteServer = async () => {
        await server?.delete();
        removeServer(server!.id);
        showSuccess(t("servers:Deleted"));

        // Expo Router sucks
        while (router.canGoBack()) {
            router.back();
        }

        router.replace("/");
    };

    return (
        <ContentWrapper>
            {server?.hasScope("server.delete") && (
                <Button
                    text={t("servers:Delete")}
                    icon="trash-can"
                    style="danger"
                    onPress={deleteAlert}
                />
            )}
        </ContentWrapper>
    );
}