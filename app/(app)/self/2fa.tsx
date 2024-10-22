import { useState, useEffect, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import LoadingScreen from "@/components/LoadingScreen";
import Copyable from "@/components/ui/Copyable";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { OtpEnrollResponse } from "pufferpanel";

export default function TwoFactorAuthScreen() {
    const { style, colors } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createPromptModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [data, setData] = useState<OtpEnrollResponse | null>(null);
    const [code, setCode] = useState("");

    useEffect(() => {
        refreshOtpStatus();
    }, []);

    const refreshOtpStatus = useCallback(async () => {
        if (!apiClient) {
            return;
        }

        setLoading(true);
        setEnabled(await apiClient.self.isOtpEnabled());
        setLoading(false);
    }, []);

    const confirmOtpEnroll = async () => {
        setLoading(true);

        try {
            await apiClient!.self.validateOtpEnroll(code);
            await refreshOtpStatus();
            setEnrolling(false);
            showSuccess("2FA has been enabled");
        } finally {
            setLoading(false);
        }
    };

    const startOtpEnroll = async () => {
        setLoading(true);

        try {
            setCode("");
            setData(await apiClient!.self.startOtpEnroll());
            setEnrolling(true);
        } finally {
            setLoading(false);
        }
    };

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

    // TODO: This should probably be a modal instead
    if (enrolling) {
        return (
            <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
                <View style={style.content}>
                    <Image
                        source={{ uri: data!.img }}
                        style={style.qrCode}
                    />

                    <Text style={style.header}>Scan the QR code using your authenticator application or copy the secret code below into it.</Text>

                    <Copyable text={data!.secret} />

                    <TextInput
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        placeholder="Confirm using a 2FA code"
                    />

                    <Button
                        text="Enable 2FA"
                        style="success"
                        onPress={confirmOtpEnroll}
                    />

                    <Button
                        text="Cancel"
                        onPress={() => setEnrolling(false)}
                    />
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
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
                        onPress={startOtpEnroll}
                    />
                )}
            </View>
        </ScrollView>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        scrollView: {
            width: "100%"
        },
        contentContainer: {
            flexGrow: 1,
            alignItems: "center"
        },
        content: {
            width: "100%",
            maxWidth: 400,
            padding: 20
        },
        text: {
            color: colors.text
        },
        qrCode: {
            width: "100%",
            aspectRatio: 1
        },
        header: {
            color: colors.text,
            fontSize: 16,
            textAlign: "center",
            marginVertical: 5
        }
    });
}