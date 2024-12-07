import { Text, StyleSheet } from "react-native";
import { useStyle } from "@/hooks/useStyle";

export default function Welcome() {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
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

    return (
        <>
            <Text style={style.header}>Welcome!</Text>
            <Text style={style.subheader}>Add a new PufferPanel server to get started.</Text>
            <Text style={style.subheader}>Note: Pallokala only works with version 3.0 and later PufferPanel servers.</Text>
        </>
    );
}