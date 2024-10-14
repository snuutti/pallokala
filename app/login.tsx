import { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { OAuthAccount } from "@/types/account";

export default function Login() {
    const { style } = useStyle(styling);
    const { addAccount } = useAccount();
    const [address, setAddress] = useState("");
    const [id, setId] = useState("");
    const [secret, setSecret] = useState("");

    const logIn = async () => {
        const account: OAuthAccount = {
            serverAddress: address,
            nickname: "",
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
        <View style={style.container}>
            <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
                <View style={style.content}>
                    <Text style={style.header}>Welcome!</Text>
                    <Text style={style.subheader}>Add a new PufferPanel server to get started.</Text>

                    <TextInput
                        defaultValue={address}
                        onChangeText={setAddress}
                        placeholder="Server address"
                        autoCapitalize="none"
                        autoComplete="url"
                        keyboardType="url"
                    />

                    <TextInput
                        defaultValue={id}
                        onChangeText={setId}
                        placeholder="Client ID"
                        autoCapitalize="none"
                        autoComplete="off"
                    />

                    <TextInput
                        defaultValue={secret}
                        onChangeText={setSecret}
                        placeholder="Client secret"
                        autoCapitalize="none"
                        autoComplete="password"
                        secureTextEntry={true}
                    />

                    <Button text="Add Account" onPress={logIn} />
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
        }
    });
}