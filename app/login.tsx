import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, useColorScheme } from "react-native";
import { router } from "expo-router";
import { useAccount } from "@/context/AccountProvider";
import { Colors, getColors } from "@/constants/Colors";
import { OAuthAccount } from "@/types/account";

export default function Login() {
    const colorScheme = useColorScheme();
    const { addAccount } = useAccount();
    const [address, setAddress] = useState("");
    const [id, setId] = useState("");
    const [secret, setSecret] = useState("");

    const colors = getColors(colorScheme);
    const styles = styling(colors);

    const logIn = async () => {
        const account: OAuthAccount = {
            serverAddress: address,
            type: "oauth",
            clientId: id,
            clientSecret: secret
        };

        if (await addAccount(account)) {
            router.replace("/");
        } else {
            console.error("Login failed");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.header}>Welcome!</Text>
                    <Text style={styles.subheader}>Add a new PufferPanel server to get started.</Text>

                    <TextInput
                        defaultValue={address}
                        onChangeText={setAddress}
                        placeholder="Server address"
                        placeholderTextColor={colors.textPrimary}
                        autoCapitalize="none"
                        autoComplete="url"
                        keyboardType="url"
                        style={styles.input}
                    />

                    <TextInput
                        defaultValue={id}
                        onChangeText={setId}
                        placeholder="Client ID"
                        placeholderTextColor={colors.textPrimary}
                        autoCapitalize="none"
                        autoComplete="off"
                        style={styles.input}
                    />

                    <TextInput
                        defaultValue={secret}
                        onChangeText={setSecret}
                        placeholder="Client secret"
                        placeholderTextColor={colors.textPrimary}
                        autoCapitalize="none"
                        autoComplete="password"
                        secureTextEntry={true}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.button} onPress={logIn}>
                        <Text style={styles.buttonText}>Add account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background
        },
        scrollView: {
            width: "100%"
        },
        contentContainer: {
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center"
        },
        content: {
            width: "100%",
            maxWidth: 400,
            paddingHorizontal: 20
        },
        header: {
            color: colors.text,
            fontSize: 32
        },
        subheader: {
            color: colors.text,
            fontSize: 16,
            marginBottom: 5
        },
        input: {
            width: "100%",
            marginVertical: 5,
            padding: 16,
            borderRadius: 16,
            borderColor: "#D7D7D7", // TODO
            borderWidth: 2,
            color: colors.textPrimary,
            backgroundColor: colors.background
        },
        button: {
            width: "100%",
            height: 48,
            marginVertical: 5,
            backgroundColor: colors.primary,
            justifyContent: "center",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        buttonText: {
            color: colors.textPrimary,
            textAlign: "center"
        }
    });
}