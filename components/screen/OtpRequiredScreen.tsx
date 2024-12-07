import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";

const schema = z.object({
    code: z.string().length(6, { message: "Invalid 2FA code" })
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    code: ""
};

export default function OtpRequiredScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            contentContainer: {
                justifyContent: "center"
            },
            header: {
                color: colors.text,
                fontSize: 32,
                marginVertical: 5
            }
        })
    );
    const { submitOtp } = useAccount();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: Schema) => {
        setLoading(true);

        try {
            await submitOtp(data.code);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContentWrapper contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>{t("users:OtpNeeded")}</Text>

            <FormTextInput
                control={control}
                name="code"
                keyboardType="number-pad"
                editable={!loading}
                error={errors.code?.message}
            />

            <Button
                text={t("users:Login")}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
            />
        </ContentWrapper>
    );
}