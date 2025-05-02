import { Text, StyleSheet } from "react-native";
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
            text: {
                color: "#fff",
                fontFamily: "UbuntuMono",
                fontSize: consoleFontSize
            }
        })
    );

    if (props.text.startsWith("[DAEMON]")) {
        return (
            <Text selectable={true} textBreakStrategy="simple">
                <DaemonBadge />
                <AnsiText text={props.text.substring(8)} style={style.text} />
            </Text>
        );
    }

    return (
        <Text selectable={true} textBreakStrategy="simple">
            <AnsiText text={props.text} style={style.text} />
        </Text>
    );
}