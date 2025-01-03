import { useState } from "react";
import { StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Welcome from "@/components/auth/Welcome";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { isUnsupportedVersion } from "@/utils/version";
import { EmailAccount } from "@/types/account";
import { ErrorHandlerResult } from "pufferpanel";

const schema = z.object({
    address: z.string().url({ message: "errors:ErrFieldIsInvalidHost" })
        .refine(val => !val.endsWith("/") && !val.includes(" "), { message: "errors:ErrFieldIsInvalidHost" }),
    email: z.string().email({ message: "errors:ErrFieldNotEmail" }),
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
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            scrollView: {
                backgroundColor: colors.background
            },
            contentContainer: {
                justifyContent: "center"
            }
        })
    );
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
            if (await isUnsupportedVersion(data.address)) {
                createAlertModal(
                    "Unsupported PufferPanel version",
                    "2.x versions of PufferPanel are not supported. Please upgrade to 3.x.",
                    [
                        { text: t("common:Close") }
                    ]
                );

                return;
            }
        } catch {
            createAlertModal(
                "Error",
                "Failed to check server version. Please check the server address and try again.",
                [
                    { text: t("common:Close") }
                ]
            );

            return;
        } finally {
            setLoading(false);
        }

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
            if ("code" in (e as ErrorHandlerResult)) {
                createAlertModal(
                    t("errors:" + (e as ErrorHandlerResult).code),
                    (e as ErrorHandlerResult).msg,
                    [
                        { text: t("common:Close") }
                    ]
                );
            } else {
                createAlertModal(
                    "Error",
                    "Unable to add account. Please check the server address and try again.",
                    [
                        { text: t("common:Close") }
                    ]
                );
            }
        }

        setLoading(false);
    };

    return (
        <ContentWrapper scrollViewStyle={style.scrollView} contentContainerStyle={style.contentContainer}>
            <Welcome />

            <FormTextInput
                control={control}
                name="address"
                placeholder="Server address"
                autoCapitalize="none"
                autoComplete="url"
                keyboardType="url"
                editable={!loading}
                error={errors.address?.message}
                errorFields={{ field: "Server address" }}
            />

            <FormTextInput
                control={control}
                name="email"
                placeholder={t("users:Email")}
                autoCapitalize="none"
                autoComplete="off"
                editable={!loading}
                error={errors.email?.message}
                errorFields={{ field: t("users:Email") }}
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
                icon="account-plus"
                onPress={handleSubmit(logIn)}
                disabled={!isValid || loading}
            />
        </ContentWrapper>
    );
}