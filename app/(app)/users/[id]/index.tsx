import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { Colors } from "@/constants/Colors";
import { User } from "pufferpanel";

const schema = z.object({
    username: z.string().min(5),
    email: z.string().email(),
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
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const modifyUser = useBoundStore(state => state.modifyUser);
    const removeUser = useBoundStore(state => state.removeUser);
    const { id } = useLocalSearchParams<{ id: string }>();
    const { control, handleSubmit, setValue, getValues, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUser(null);

        if (id === undefined) {
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

            showSuccess(t("users:UpdateSuccess"));
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
                { text: t("common:Cancel") }
            ]
        );
    };

    const deleteUser = async () => {
        setLoading(true);
        await apiClient?.user.delete(Number(id));
        removeUser(Number(id));
        showSuccess(t("users:DeleteSuccess"));
        router.back();
    };

    if (!user) {
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

function styling(colors: Colors) {
    return StyleSheet.create({
        text: {
            color: colors.text,
            marginVertical: 5
        }
    });
}