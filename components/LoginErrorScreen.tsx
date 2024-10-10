import { View, ScrollView, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { Colors, getColors } from "@/constants/Colors";

export default function LoginErrorScreen() {
    const colorScheme = useColorScheme();
    const { present } = useSwitchServerModal();

    const colors = getColors(colorScheme);
    const style = styling(colors);

    return (
        <View style={style.container}>
            <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
                <View style={style.content}>
                    <Text style={style.header}>Error</Text>
                    <Text style={style.subheader}>Failed to login to the server.</Text>

                    <TouchableOpacity style={style.button} onPress={present}>
                        <Text style={style.buttonText}>Select server</Text>
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