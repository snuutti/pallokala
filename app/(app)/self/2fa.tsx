import { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export default function TwoFactorAuthScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createPromptModal } = useModal();
    const { refresh } = useLocalSearchParams<{ refresh?: string }>();
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        refreshOtpStatus();
    }, [refresh]);

    const refreshOtpStatus = useCallback(async () => {
        if (!apiClient) {
            return;
        }

        setLoading(true);
        setEnabled(await apiClient.self.isOtpEnabled());
        setLoading(false);
    }, []);

    const confirmDisableOtp = () => {
        createPromptModal(
            "Disable 2FA",
            "Confirm using a 2FA code",
            "number-pad",
            [
                {
                    text: "Disable 2FA",
                    style: "danger",
                    onPress: async (code: string) => {
                        setLoading(true);

                        try {
                            await apiClient?.self.disableOtp(code);
                            await refreshOtpStatus();
                            showSuccess("2FA has been disabled");
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    text: "Cancel"
                }
            ]
        );
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.text}>Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.</Text>

            {enabled ? (
                <Button
                    text="Disable 2FA"
                    icon="lock-off"
                    style="danger"
                    onPress={confirmDisableOtp}
                />
            ) : (
                <Button
                    text="Enable 2FA"
                    icon="lock"
                    onPress={() => router.push("/(modal)/enroll2fa")}
                />
            )}
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        text: {
            color: colors.text
        }
    });
}