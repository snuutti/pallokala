import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import DeletingServerModal from "@/components/server/admin/DeletingServerModal";
import { useServer } from "@/context/ServerProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import { useBoundStore } from "@/stores/useBoundStore";

export default function AdminScreen() {
    const { t } = useTranslation();
    const { server } = useServer();
    const { createAlertModal, createModal, closeModal } = useModal();
    const { showSuccessAlert } = useToast();
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
                {
                    text: t("common:Cancel"),
                    icon: "close"
                },
            ]
        );
    };

    const deleteServer = async () => {
        const modal = createModal(<DeletingServerModal />, {
            closable: false
        });

        try {
            await server?.delete();
            server?.closeSocket();
            removeServer(server!.id);
            showSuccessAlert(t("servers:Deleted"));

            // The Expo devs are incapable of writing functional code,
            // so we have to do this hacky workaround to get back to the main screen
            for (let i = 0; i < 10; i++) {
                if (router.canGoBack()) {
                    router.back();
                }
            }

            router.replace("/");
        } finally {
            closeModal(modal);
        }
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