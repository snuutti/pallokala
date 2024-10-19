import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";

export default function AccountDetailsScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { user, refreshSelf } = useAccount();
    const { showSuccess } = useToast();
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setUsername(user?.username || "");
        setEmail(user?.email || "");
    }, []);

    const updateUser = async () => {
        setSaving(true);

        try {
            await apiClient?.self.updateDetails(username, email, password);
            await refreshSelf();

            showSuccess("Account updated successfully");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <TextInput
                    defaultValue={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={!saving}
                />

                <TextInput
                    defaultValue={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={!saving}
                />

                <TextInput
                    defaultValue={password}
                    onChangeText={setPassword}
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!saving}
                />

                <Button
                    text="Change Account Details"
                    icon="content-save"
                    onPress={updateUser}
                    disabled={saving}
                />
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