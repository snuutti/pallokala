import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import LoadingScreen from "@/components/LoadingScreen";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { User } from "pufferpanel";

export default function UserDetailsScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const { id } = useGlobalSearchParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setUser(null);

        if (id === undefined) {
            return;
        }

        apiClient?.user.get(Number(id)).then((user) => {
            setUser(user);
            setUsername(user.username || "");
            setEmail(user.email || "");
        });
    }, [id]);

    const canEdit = apiClient?.auth.hasScope("users.info.edit") || false;

    const updateUser = async () => {
        setLoading(true);

        try {
            await apiClient?.user.update(Number(id), {
                username,
                email,
                password: password || undefined
            });

            showSuccess("User updated successfully");
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = () => {
        createAlertModal(
            "Delete User",
            `Are you sure you want to delete ${username}?`,
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
                <TextInput
                    defaultValue={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={canEdit}
                />

                <TextInput
                    defaultValue={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={canEdit}
                />

                <TextInput
                    defaultValue={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={canEdit}
                />

                {canEdit && (
                    <>
                        <Button
                            text="Update User Details"
                            icon="content-save"
                            onPress={updateUser}
                            disabled={loading}
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