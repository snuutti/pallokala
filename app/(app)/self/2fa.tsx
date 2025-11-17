import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import PasskeyListItem from "@/components/self/PasskeyListItem";
import Collapse from "@/components/ui/Collapse";
import Switch from "@/components/ui/Switch";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import useVersionCheck from "@/hooks/useVersionCheck";
import { useStyle } from "@/hooks/useStyle";
import { updateAccount } from "@/utils/accountStorage";
import { EmailAccount } from "@/types/account";
import { WebauthnCredentialView } from "pufferpanel";

export default function TwoFactorAuthScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                marginBottom: 10,
                color: colors.text,
                fontSize: 16
            },
            text: {
                color: colors.text
            },
            passkeys: {
                marginVertical: 20,
                gap: 5
            }
        })
    );
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { createPromptModal } = useModal();
    const { showSuccessAlert } = useToast();
    const { refresh } = useLocalSearchParams<{ refresh?: string }>();
    const hasRecoveryCodes = useVersionCheck("3.0.0-rc.15");
    const hasPasskeys = useVersionCheck("3.0.0-rc.16");
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [passkeys, setPasskeys] = useState<WebauthnCredentialView[]>([]);
    const [allowPasswordless, setAllowPasswordless] = useState(false);

    useEffect(() => {
        loadData();
    }, [refresh]);

    const loadData = async () => {
        setLoading(true);

        setEnabled(await apiClient.self.isOtpEnabled());

        if (hasPasskeys) {
            const passkeys = await apiClient.self.getPasskeys();
            setPasskeys(passkeys);
            setAllowPasswordless((await apiClient.self.get()).allowPasswordlessLogin && passkeys.length > 0);
        }

        setLoading(false);
    };

    const refreshOtpStatus = useCallback(async () => {
        if (!apiClient) {
            return;
        }

        setLoading(true);
        setEnabled(await apiClient.self.isOtpEnabled());
        setLoading(false);
    }, []);

    const loadPasskeys = useCallback(async () => {
        if (!apiClient) {
            return;
        }

        setLoading(true);
        const passkeys = await apiClient.self.getPasskeys();
        setPasskeys(passkeys);
        setAllowPasswordless((await apiClient.self.get()).allowPasswordlessLogin && passkeys.length > 0);
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

    const setAllowPasswordlessState = async (allow: boolean) => {
        setLoading(true);

        try {
            setAllowPasswordless(allow);
            await apiClient.self.setAllowPasswordlessLogin(allow);
            showSuccessAlert(t("users:UpdateSuccess"));
        } catch {
            setAllowPasswordless(!allow);
        } finally {
            setLoading(false);
        }
    };

    const removePasskey = async (passkeyId: string) => {
        setLoading(true);

        try {
            await apiClient.self.deletePasskey(passkeyId);
            await loadPasskeys();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.header}>{t("users:Otp")}</Text>

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

            {hasPasskeys && (
                <>
                    <Text style={style.header}>{t("users:Passkeys")}</Text>

                    <View style={style.passkeys}>
                        {passkeys.map(passkey => (
                            <PasskeyListItem
                                key={passkey.id}
                                passkey={passkey}
                                onDelete={removePasskey}
                            />
                        ))}
                    </View>

                    <Collapse title={t("users:PasskeyAdvanced")}>
                        <Switch
                            label={t("users:AllowPasswordlessLogin")}
                            description={t("users:AllowPasswordlessLoginHint")}
                            value={allowPasswordless}
                            onValueChange={setAllowPasswordlessState}
                            disabled={passkeys.length === 0}
                        />
                    </Collapse>
                </>
            )}
        </ContentWrapper>
    );
}