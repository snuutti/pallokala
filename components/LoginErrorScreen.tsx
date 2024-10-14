import { View, ScrollView, Text, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export default function LoginErrorScreen() {
    const { style } = useStyle(styling);
    const { present } = useSwitchServerModal();

    return (
        <View style={style.container}>
            <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
                <View style={style.content}>
                    <Text style={style.header}>Error</Text>
                    <Text style={style.subheader}>Failed to login to the server.</Text>

                    <Button text="Select Server" onPress={present} />
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