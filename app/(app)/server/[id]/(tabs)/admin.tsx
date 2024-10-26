import { router } from "expo-router";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useServer } from "@/context/ServerProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";

export default function AdminScreen() {
    const { server } = useServer();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();

    const deleteAlert = () => {
        createAlertModal(
            "Delete Server",
            `Are you sure you want to delete ${server?.name}?`,
            [
                {
                    text: "Delete",
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteServer
                },
                { text: "Cancel" },
            ]
        );
    };

    const deleteServer = async () => {
        await server?.delete();
        showSuccess("Server deleted successfully");

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
                    text="Delete server"
                    icon="trash-can"
                    style="danger"
                    onPress={deleteAlert}
                />
            )}
        </ContentWrapper>
    );
}