import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useGlobalSearchParams } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
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
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const { id } = useGlobalSearchParams<{ id: string }>();
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

            showSuccess("User updated successfully");
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = () => {
        createAlertModal(
            "Delete User",
            `Are you sure you want to delete ${getValues("username")}?`,
            [
                {
                    text: "Delete",
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteUser
                },
                { text: "Cancel" }
            ]
        );
    };

    const deleteUser = async () => {
        setLoading(true);
        await apiClient?.user.delete(Number(id));
        showSuccess("User deleted successfully");
        router.back();
    };

    if (!user) {
        return <LoadingScreen />;
    }

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <FormTextInput
                    control={control}
                    name="username"
                    placeholder="Username"
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={canEdit}
                    error={errors.username?.message}
                />

                <FormTextInput
                    control={control}
                    name="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={canEdit}
                    error={errors.email?.message}
                />

                <FormTextInput
                    control={control}
                    name="password"
                    placeholder="Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={canEdit}
                    error={errors.password?.message}
                />

                {canEdit && (
                    <>
                        <Button
                            text="Update User Details"
                            icon="content-save"
                            onPress={handleSubmit(updateUser)}
                            disabled={loading || !isValid}
                        />

                        <Button
                            text="Delete User"
                            icon="trash-can"
                            style="danger"
                            onPress={deleteAlert}
                            disabled={loading}
                        />
                    </>
                )}
            </View>
        </ScrollView>
    );
}

function styling() {
    return StyleSheet.create({
        scrollView: {
            width: "100%"
        },
        contentContainer: {
            flexGrow: 1,
            alignItems: "center"
        },
        content: {
            width: "100%",
            maxWidth: 400,
            padding: 20
        }
    });
}