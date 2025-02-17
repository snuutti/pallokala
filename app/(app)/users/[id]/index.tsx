import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { User } from "pufferpanel";

const schema = z.object({
    username: z.string().min(5, { message: "errors:ErrFieldLength" }),
    email: z.string().email({ message: "errors:ErrFieldNotEmail" }),
    password: z.string().optional()
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    username: "",
    id: "",
    password: ""
};

export default function UserDetailsScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            text: {
                color: colors.text,
                marginVertical: 5
            }
        })
    );
    const { apiClient } = useApiClient();
    const { showSuccessAlert } = useToast();
    const { createAlertModal } = useModal();
    const modifyUser = useBoundStore(state => state.modifyUser);
    const removeUser = useBoundStore(state => state.removeUser);
    const id = useBoundStore(state => state.currentUser);
    const { control, handleSubmit, setValue, getValues, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUser(null);

        if (id === -1) {
            return;
        }

        apiClient?.user.get(Number(id)).then((user) => {
            setValue("username", user.username || "");
            setValue("email", user.email || "");
            setUser(user);
            modifyUser(Number(id), { username: user.username || "", email: user.email || "" });
        });
    }, [id]);

    const canEdit = apiClient?.auth.hasScope("users.info.edit") || false;

    const updateUser = async (data: Schema) => {
        setLoading(true);

        try {
            await apiClient?.user.update(Number(id), {
                username: data.username,
                email: data.email,
                password: data.password || undefined
            });

            modifyUser(Number(id), { username: data.username, email: data.email });

            showSuccessAlert(t("users:UpdateSuccess"));
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = () => {
        createAlertModal(
            t("users:Delete"),
            t("users:ConfirmDelete", { name: getValues("username") }),
            [
                {
                    text: t("users:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteUser
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const deleteUser = async () => {
        setLoading(true);
        await apiClient?.user.delete(Number(id));
        removeUser(Number(id));
        showSuccessAlert(t("users:DeleteSuccess"));
        router.back();
    };

    if (!user || user.id !== Number(id)) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="username"
                placeholder={t("users:Username")}
                autoCapitalize="none"
                autoComplete="username"
                editable={canEdit}
                error={errors.username?.message}
                errorFields={{ field: t("users:Username"), length: 5 }}
            />

            <FormTextInput
                control={control}
                name="email"
                placeholder={t("users:Email")}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={canEdit}
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
                editable={canEdit}
                error={errors.password?.message}
            />

            {apiClient?.auth.hasScope("users.perms.view") && (
                <Text style={style.text}>
                    {t("users:OtpEnabled")}: {user.otpActive ? t("common:Yes") : t("common:No")}
                </Text>
            )}

            {canEdit && (
                <>
                    <Button
                        text={t("users:UpdateDetails")}
                        icon="content-save"
                        onPress={handleSubmit(updateUser)}
                        disabled={loading || !isValid}
                    />

                    <Button
                        text={t("users:Delete")}
                        icon="trash-can"
                        style="danger"
                        onPress={deleteAlert}
                        disabled={loading}
                    />
                </>
            )}
        </ContentWrapper>
    );
}