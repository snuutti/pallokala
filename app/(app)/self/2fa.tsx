import { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import useVersionCheck from "@/hooks/useVersionCheck";
import { useStyle } from "@/hooks/useStyle";
import { updateAccount } from "@/utils/accountStorage";
import { EmailAccount } from "@/types/account";

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
    const { activeAccount } = useAccount();
    const { createPromptModal } = useModal();
    const { showSuccessAlert } = useToast();
    const { refresh } = useLocalSearchParams<{ refresh?: string }>();
    const hasRecoveryCodes = useVersionCheck("3.0.0-rc.15");
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

    const confirmDisableOtp = (useRecovery: boolean) => {
        createPromptModal(
            t("users:OtpDisable"),
            {
                placeholder: t("users:OtpConfirm"),
                inputType: useRecovery ? "default" : "number-pad"
            },
            [
                {
                    text: t("users:OtpDisable"),
                    icon: "lock-off",
                    style: "danger",
                    onPress: async (code: string) => {
                        setLoading(true);

                        try {
                            await apiClient?.self.disableOtp(code);
                            await setOtpSecret(undefined);
                            await refreshOtpStatus();
                            showSuccessAlert(t("users:UpdateSuccess"));
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    text: t(useRecovery ? "users:OtpUseAuthenticator" : "users:OtpUseRecovery"),
                    icon: useRecovery ? "clock-outline" : "dots-horizontal",
                    onPress: () => {
                        confirmDisableOtp(!useRecovery);
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const regenerateRecoveryCodes = (useRecovery: boolean) => {
        createPromptModal(
            t("users:RegenerateRecoveryCodes"),
            {
                placeholder: t("users:OtpConfirm"),
                inputType: useRecovery ? "default" : "number-pad"
            },
            [
                {
                    text: t("users:RegenerateRecoveryCodes"),
                    icon: "refresh",
                    style: "danger",
                    onPress: async (code: string) => {
                        setLoading(true);

                        try {
                            const res = await apiClient?.self.regenerateRecoveryCodes(code);
                            router.push(`/(modal)/recoverycodes?codes=${JSON.stringify(res!.recoveryCodes)}`);
                            showSuccessAlert(t("users:UpdateSuccess"));
                        } finally {
                            setLoading(false);
                        }
                    }
                },
                {
                    text: t(useRecovery ? "users:OtpUseAuthenticator" : "users:OtpUseRecovery"),
                    icon: useRecovery ? "clock-outline" : "dots-horizontal",
                    onPress: () => {
                        regenerateRecoveryCodes(!useRecovery);
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const setOtpSecret = async (secret?: string) => {
        const account = activeAccount as EmailAccount;
        account.otpSecret = secret;

        await updateAccount(account);
    };

    const removeOtpSecret = async () => {
        await setOtpSecret(undefined);
        showSuccessAlert(t("app:Self.2FA.Removed"));
    };

    const enterOtpSecret = () => {
        createPromptModal(
            t("app:Self.2FA.EnterSecret"),
            {
                placeholder: t("users:OtpSecret"),
                inputType: "default"
            },
            [
                {
                    text: t("common:Save"),
                    icon: "content-save",
                    onPress: async (secret: string) => {
                        await setOtpSecret(secret);
                        showSuccessAlert(t("app:Self.2FA.Saved"));
                    }
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
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
                    onPress={() => confirmDisableOtp(false)}
                />
            ) : (
                <Button
                    text={t("users:OtpEnable")}
                    icon="lock"
                    onPress={() => router.push("/(modal)/enroll2fa")}
                />
            )}

            {(hasRecoveryCodes && enabled) && (
                <Button
                    text={t("users:RegenerateRecoveryCodes")}
                    icon="refresh"
                    style="danger"
                    onPress={() => regenerateRecoveryCodes(false)}
                />
            )}

            {(activeAccount!.type === "email" && enabled) && (
                <>
                    <Text style={style.text}>{t("app:Self.2FA.EnterDesc")}</Text>

                    {(activeAccount as EmailAccount).otpSecret ? (
                        <Button
                            text={t("app:Self.2FA.RemoveSecret")}
                            icon="key"
                            style="danger"
                            onPress={removeOtpSecret}
                        />
                    ) : (
                        <Button
                            text={t("app:Self.2FA.EnterSecret")}
                            icon="key"
                            onPress={enterOtpSecret}
                        />
                    )}
                </>
            )}
        </ContentWrapper>
    );
}