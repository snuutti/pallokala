import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { EmailAccount } from "@/types/account";
import { ErrorHandlerResult } from "pufferpanel";

const schema = z.object({
    address: z.string().url(),
    email: z.string(),
    password: z.string()
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    address: "",
    email: "",
    password: ""
};

export default function EmailLoginScreen() {
    const { t } = useTranslation();
    const { style } = useStyle(styling);
    const { addAccount } = useAccount();
    const { createAlertModal } = useModal();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(false);

    const logIn = async (data: Schema) => {
        setLoading(true);

        const account: EmailAccount = {
            serverAddress: data.address,
            nickname: "",
            type: "email",
            email: data.email,
            password: data.password
        };

        try {
            const [success, error] = await addAccount(account);

            if (success) {
                router.replace("/");
            } else {
                createAlertModal(
                    "Error",
                    error ? error : "Login failed",
                    [
                        { text: t("common:Close") }
                    ]
                );
            }
        } catch (e) {
            createAlertModal(
                t("errors:" + (e as ErrorHandlerResult).code),
                (e as ErrorHandlerResult).msg,
                [
                    { text: t("common:Close") }
                ]
            );
        }

        setLoading(false);
    };

    return (
        <ContentWrapper scrollViewStyle={style.scrollView} contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>Welcome!</Text>
            <Text style={style.subheader}>Add a new PufferPanel server to get started.</Text>

            <FormTextInput
                control={control}
                name="address"
                placeholder="Server address"
                autoCapitalize="none"
                autoComplete="url"
                keyboardType="url"
                editable={!loading}
                error={errors.address?.message}
            />

            <FormTextInput
                control={control}
                name="email"
                placeholder={t("users:Email")}
                autoCapitalize="none"
                autoComplete="off"
                editable={!loading}
                error={errors.email?.message}
            />

            <FormTextInput
                control={control}
                name="password"
                placeholder={t("users:Password")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!loading}
                error={errors.password?.message}
            />

            <Button
                text="Add Account"
                onPress={handleSubmit(logIn)}
                disabled={!isValid || loading}
            />
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        scrollView: {
            backgroundColor: colors.background
        },
        contentContainer: {
            justifyContent: "center"
        },
        header: {
            color: colors.text,
            fontSize: 32
        },
        subheader: {
            color: colors.text,
            fontSize: 16,
            marginBottom: 5
        }
    });
}