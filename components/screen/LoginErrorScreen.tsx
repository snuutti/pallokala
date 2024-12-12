import { Text, StyleSheet } from "react-native";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { useStyle } from "@/hooks/useStyle";

export default function LoginErrorScreen() {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            contentContainer: {
                justifyContent: "center"
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
        })
    );
    const { present } = useSwitchServerModal();

    return (
        <ContentWrapper contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>Error</Text>
            <Text style={style.subheader}>Failed to login to the server.</Text>

            <Button
                text="Select Server"
                icon="swap-horizontal"
                onPress={present}
            />
        </ContentWrapper>
    );
}