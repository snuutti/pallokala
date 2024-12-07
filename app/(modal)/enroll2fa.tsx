import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Copyable from "@/components/ui/Copyable";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { OtpEnrollResponse } from "pufferpanel";

const schema = z.object({
    code: z.string().length(6, { message: "Invalid 2FA code" })
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    code: ""
};

export default function EnrollTwoFactorScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
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
        })
    );
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OtpEnrollResponse | null>(null);

    useEffect(() => {
        apiClient?.self.startOtpEnroll()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    const confirmOtpEnroll = async (data: Schema) => {
        setLoading(true);

        try {
            await apiClient!.self.validateOtpEnroll(data.code);
            showSuccess(t("users:UpdateSuccess"));

            router.navigate(`/self/2fa?refresh=${data.code}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Image
                source={{ uri: data!.img }}
                style={style.qrCode}
            />

            <Text style={style.header}>{t("users:OtpSetupHint")}</Text>

            <Copyable text={data!.secret} />

            <FormTextInput
                control={control}
                name="code"
                keyboardType="number-pad"
                placeholder={t("users:OtpConfirm")}
                error={errors.code?.message}
            />

            <Button
                text={t("users:OtpEnable")}
                style="success"
                onPress={handleSubmit(confirmOtpEnroll)}
                disabled={!isValid}
            />
        </ContentWrapper>
    );
}