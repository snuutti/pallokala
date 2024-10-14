import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";

export default function NewUserScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const createUser = async () => {
        setLoading(true);

        try {
            const id = await apiClient!.user.create(username, email, password);
            setUsername("");
            setEmail("");
            setPassword("");
            router.push(`./${id}`);
        } finally {
            setLoading(false);
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
                    editable={!loading}
                />

                <TextInput
                    defaultValue={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={!loading}
                />

                <TextInput
                    defaultValue={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!loading}
                />

                <Button text="Create User" onPress={createUser} disabled={loading} />
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