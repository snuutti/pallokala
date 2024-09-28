import { StyleSheet, Text, View } from "react-native";

export default function DaemonBadge() {
    const style = styling();

    return (
        <View style={style.daemonBadge}>
            <Text style={style.daemonText}>PufferPanel</Text>
        </View>
    );
}

function styling() {
    return StyleSheet.create({
        daemonBadge: {
            backgroundColor: "#fff",
            borderRadius: 10,
            paddingHorizontal: 4
        },
        daemonText: {
            color: "#000",
            fontFamily: "UbuntuMono"
        }
    });
}