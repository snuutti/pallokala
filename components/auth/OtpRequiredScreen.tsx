import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useAccount } from "@/context/AccountProvider";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { useStyle } from "@/hooks/useStyle";

const schema = z.object({
    code: z.string().length(6, { message: "app:Auth.Invalid2FACode" })
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
    const { present } = useSwitchServerModal();
    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const onSubmit = async (data: Schema) => {
        await submitOtp(data.code);
    };

    return (
        <ContentWrapper contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>{t("users:OtpNeeded")}</Text>

            <FormTextInput
                control={control}
                name="code"
                keyboardType="number-pad"
                editable={!isSubmitting}
                error={errors.code?.message}
            />

            <Button
                text={t("users:Login")}
                icon="login"
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
            />

            <Button
                text={t("app:Auth.SelectServer")}
                icon="swap-horizontal"
                onPress={present}
                disabled={isSubmitting}
            />
        </ContentWrapper>
    );
}