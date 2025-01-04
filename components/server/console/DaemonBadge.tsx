import { StyleSheet, Text, View } from "react-native";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function DaemonBadge() {
    const consoleFontSize = useSettingsStore(state => state.consoleFontSize);
    const { style } = useStyle(() =>
        StyleSheet.create({
            daemonBadge: {
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingHorizontal: 4
            },
            daemonText: {
                color: "#000",
                fontFamily: "UbuntuMono",
                fontSize: consoleFontSize
            }
        })
    );
    const { config } = useApiClient();

    return (
        <View style={style.daemonBadge}>
            <Text style={style.daemonText}>{config?.branding.name || "PufferPanel"}</Text>
        </View>
    );
}