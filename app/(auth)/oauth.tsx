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
import { OAuthAccount } from "@/types/account";
import { ErrorHandlerResult } from "pufferpanel";

const schema = z.object({
    address: z.string().url({ message: "errors:ErrFieldIsInvalidHost" })
        .refine(val => !val.endsWith("/") && !val.includes(" "), { message: "errors:ErrFieldIsInvalidHost" }),
    id: z.string().uuid({ message: "app:Auth.InvalidClientId" }),
    secret: z.string().length(48, { message: "app:Auth.InvalidClientSecret" })
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    address: "",
    id: "",
    secret: ""
};

export default function OAuthLoginScreen() {
    const { t } = useTranslation();
    const { style } = useStyle(() =>
        StyleSheet.create({
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

        const account: OAuthAccount = {
            serverAddress: data.address,
            nickname: "",
            type: "oauth",
            clientId: data.id,
            clientSecret: data.secret
        };

        try {
            if (await isUnsupportedVersion(data.address)) {
                createAlertModal(
                    t("app:Auth.UnsupportedVersion"),
                    t("app:Auth.UnsupportedVersionUpgrade"),
                    [
                        { text: t("common:Close") }
                    ]
                );

                return;
            }
        } catch {
            createAlertModal(
                t("app:Common.Error"),
                t("app:Auth.VersionCheckFailed"),
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
                    t("app:Common.Error"),
                    error ? error : t("app:Auth.LoginFailed"),
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
                    t("app:Common.Error"),
                    t("app:Auth.AccountAddFailed"),
                    [
                        { text: t("common:Close") }
                    ]
                );
            }
        }

        setLoading(false);
    };

    return (
        <ContentWrapper contentContainerStyle={style.contentContainer}>
            <Welcome />

            <FormTextInput
                control={control}
                name="address"
                placeholder={t("app:Auth.ServerAddress")}
                autoCapitalize="none"
                autoComplete="url"
                keyboardType="url"
                editable={!loading}
                error={errors.address?.message}
                errorFields={{ field: t("app:Auth.ServerAddress") }}
            />

            <FormTextInput
                control={control}
                name="id"
                placeholder={t("oauth:ClientId")}
                autoCapitalize="none"
                autoComplete="off"
                editable={!loading}
                error={errors.id?.message}
            />

            <FormTextInput
                control={control}
                name="secret"
                placeholder={t("oauth:ClientSecret")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!loading}
                error={errors.secret?.message}
            />

            <Button
                text={t("app:Auth.AddAccount")}
                icon="account-plus"
                onPress={handleSubmit(logIn)}
                disabled={!isValid || loading}
            />
        </ContentWrapper>
    );
}