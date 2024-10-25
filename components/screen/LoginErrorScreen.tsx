import { View, Text, StyleSheet } from "react-native";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export default function LoginErrorScreen() {
    const { style } = useStyle(styling);
    const { present } = useSwitchServerModal();

    return (
        <ContentWrapper scrollViewStyle={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <Text style={style.header}>Error</Text>
                <Text style={style.subheader}>Failed to login to the server.</Text>

                <Button text="Select Server" onPress={present} />
            </View>
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        scrollView: {
            backgroundColor: colors.background
        },
        contentContainer: {
            justifyContent: "center"
        },
        container: {
            flex: 1,
            backgroundColor: colors.background
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