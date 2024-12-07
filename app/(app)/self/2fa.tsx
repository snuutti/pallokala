import { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

export default function TwoFactorAuthScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            text: {
                color: colors.text
            }
        })
    );
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
            t("users:OtpDisable"),
            t("users:OtpConfirm"),
            "number-pad",
            [
                {
                    text: t("users:OtpDisable"),
                    style: "danger",
                    onPress: async (code: string) => {
                        setLoading(true);

                        try {
                            await apiClient?.self.disableOtp(code);
                            await refreshOtpStatus();
                            showSuccess(t("users:UpdateSuccess"));
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    text: t("common:Cancel")
                }
            ]
        );
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.text}>{t("users:OtpHint")}</Text>

            {enabled ? (
                <Button
                    text={t("users:OtpDisable")}
                    icon="lock-off"
                    style="danger"
                    onPress={confirmDisableOtp}
                />
            ) : (
                <Button
                    text={t("users:OtpEnable")}
                    icon="lock"
                    onPress={() => router.push("/(modal)/enroll2fa")}
                />
            )}
        </ContentWrapper>
    );
}