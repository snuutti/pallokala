import { StyleSheet, Text } from "react-native";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function DaemonBadge() {
    const consoleFontSize = useSettingsStore(state => state.consoleFontSize);
    const { style } = useStyle(() =>
        StyleSheet.create({
            daemonText: {
                backgroundColor: "#fff",
                color: "#000",
                fontFamily: "UbuntuMono",
                fontSize: consoleFontSize
            }
        })
    );
    const { config } = useApiClient();

    return (
        <Text style={style.daemonText}>{config?.branding.name || "PufferPanel"}</Text>
    );
}