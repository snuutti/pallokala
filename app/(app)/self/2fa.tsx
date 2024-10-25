import { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Copyable from "@/components/ui/Copyable";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { OtpEnrollResponse } from "pufferpanel";

const schema = z.object({
    code: z.string().length(6)
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    code: ""
};

export default function TwoFactorAuthScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createPromptModal } = useModal();
    const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(true);
    const [enabled, setEnabled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [data, setData] = useState<OtpEnrollResponse | null>(null);

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

    const confirmOtpEnroll = async (data: Schema) => {
        setLoading(true);

        try {
            await apiClient!.self.validateOtpEnroll(data.code);
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
            reset();
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
            <ContentWrapper>
                <Image
                    source={{ uri: data!.img }}
                    style={style.qrCode}
                />

                <Text style={style.header}>Scan the QR code using your authenticator application or copy the secret code below into it.</Text>

                <Copyable text={data!.secret} />

                <FormTextInput
                    control={control}
                    name="code"
                    keyboardType="number-pad"
                    placeholder="Confirm using a 2FA code"
                    error={errors.code?.message}
                />

                <Button
                    text="Enable 2FA"
                    style="success"
                    onPress={handleSubmit(confirmOtpEnroll)}
                    disabled={!isValid}
                />

                <Button
                    text="Cancel"
                    onPress={() => setEnrolling(false)}
                />
            </ContentWrapper>
        );
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
                    onPress={startOtpEnroll}
                />
            )}
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
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