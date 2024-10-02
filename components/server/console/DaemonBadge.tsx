import { StyleSheet, Text, View } from "react-native";
import { useApiClient } from "@/context/ApiClientProvider";

export default function DaemonBadge() {
    const { config } = useApiClient();
    const style = styling();

    return (
        <View style={style.daemonBadge}>
            <Text style={style.daemonText}>{config?.branding.name || "PufferPanel"}</Text>
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