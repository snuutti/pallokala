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
    address: z.url({ message: "errors:ErrFieldIsInvalidHost" })
        .refine(val => !val.endsWith("/") && !val.includes(" "), { message: "errors:ErrFieldIsInvalidHost" }),
    email: z.email({ message: "errors:ErrFieldNotEmail" }),
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
    const { style } = useStyle(() =>
        StyleSheet.create({
            contentContainer: {
                justifyContent: "center"
            }
        })
    );
    const { addAccount } = useAccount();
    const { createAlertModal } = useModal();
    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const logIn = async (data: Schema) => {
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
                    t("app:Auth.UnsupportedVersion"),
                    t("app:Auth.UnsupportedVersionUpgrade"),
                    [
                        {
                            text: t("common:Close"),
                            icon: "close"
                        }
                    ]
                );

                return;
            }
        } catch {
            createAlertModal(
                t("app:Common.Error"),
                t("app:Auth.VersionCheckFailed"),
                [
                    {
                        text: t("common:Close"),
                        icon: "close"
                    }
                ]
            );

            return;
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
                        {
                            text: t("common:Close"),
                            icon: "close"
                        }
                    ]
                );
            }
        } catch (e) {
            if ("code" in (e as ErrorHandlerResult)) {
                createAlertModal(
                    t("errors:" + (e as ErrorHandlerResult).code),
                    (e as ErrorHandlerResult).msg,
                    [
                        {
                            text: t("common:Close"),
                            icon: "close"
                        }
                    ]
                );
            } else {
                createAlertModal(
                    t("app:Common.Error"),
                    t("app:Auth.AccountAddFailed"),
                    [
                        {
                            text: t("common:Close"),
                            icon: "close"
                        }
                    ]
                );
            }
        }
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
                editable={!isSubmitting}
                error={errors.address?.message}
                errorFields={{ field: t("app:Auth.ServerAddress") }}
            />

            <FormTextInput
                control={control}
                name="email"
                placeholder={t("users:Email")}
                autoCapitalize="none"
                autoComplete="off"
                editable={!isSubmitting}
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
                editable={!isSubmitting}
                error={errors.password?.message}
            />

            <Button
                text={t("app:Auth.AddAccount")}
                icon="account-plus"
                onPress={handleSubmit(logIn)}
                disabled={!isValid || isSubmitting}
            />
        </ContentWrapper>
    );
}