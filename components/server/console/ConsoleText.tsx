import { View, StyleSheet } from "react-native";
import DaemonBadge from "@/components/server/console/DaemonBadge";
import AnsiText from "@/components/server/console/AnsiText";
import { useStyle } from "@/hooks/useStyle";
import { useSettingsStore } from "@/stores/useSettingsStore";

type ConsoleTextProps = {
    text: string;
};

export default function ConsoleText(props: ConsoleTextProps) {
    const consoleFontSize = useSettingsStore(state => state.consoleFontSize);
    const { style } = useStyle(() =>
        StyleSheet.create({
            daemonBadgeContainer: {
                flexDirection: "row",
                alignItems: "center"
            },
            textContainer: {
                flex: 1,
                flexDirection: "row"
            },
            text: {
                color: "#fff",
                fontFamily: "UbuntuMono",
                fontSize: consoleFontSize
            }
        })
    );

    if (props.text.startsWith("[DAEMON]")) {
        return (
            <View style={style.daemonBadgeContainer}>
                <DaemonBadge />
                <View style={style.textContainer}>
                    <AnsiText text={props.text.substring(8)} style={style.text} />
                </View>
            </View>
        );
    }

    return (
        <View style={style.textContainer}>
            <AnsiText text={props.text} style={style.text} />
        </View>
    );
}