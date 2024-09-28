import { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, useColorScheme } from "react-native";
import { router } from "expo-router";
import { Colors, getColors } from "@/constants/Colors";

export default function Login() {
    const colorScheme = useColorScheme();
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const colors = getColors(colorScheme);
    const styles = styling(colors);

    const logIn = () => {
        router.replace("/");
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
                        defaultValue={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor={colors.textPrimary}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        style={styles.input}
                    />

                    <TextInput
                        defaultValue={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor={colors.textPrimary}
                        autoCapitalize="none"
                        autoComplete="password"
                        secureTextEntry={true}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.button} onPress={logIn}>
                        <Text style={styles.buttonText}>Login</Text>
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