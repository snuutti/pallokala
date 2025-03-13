import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { ExtendedServerView } from "@/types/server";

const icons: Record<string, string> = {
    "7days2die": require("@/assets/images/icons/7days2die.png"),
    "ark": require("@/assets/images/icons/ark.png"),
    "arma3": require("@/assets/images/icons/arma3.png"),
    "csgo": require("@/assets/images/icons/csgo.png"),
    "css": require("@/assets/images/icons/css.png"),
    "dontstarvetogether": require("@/assets/images/icons/dontstarvetogether.png"),
    "eco": require("@/assets/images/icons/eco.png"),
    "factorio": require("@/assets/images/icons/factorio.png"),
    "gmod": require("@/assets/images/icons/gmod.png"),
    "minecraft-bedrock": require("@/assets/images/icons/minecraft-bedrock.png"),
    "minecraft-java": require("@/assets/images/icons/minecraft-java.png"),
    "rust": require("@/assets/images/icons/rust.png"),
    "starbound": require("@/assets/images/icons/starbound.png"),
    "terraria": require("@/assets/images/icons/terraria.png")
};

type ServerListItemProps = {
    server: ExtendedServerView;
};

export default function ServerListItem(props: ServerListItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            server: {
                height: 70,
                padding: 15,
                flexDirection: "row",
                backgroundColor: colors.background,
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 15
            },
            infoView: {
                flex: 1,
                flexGrow: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            name: {
                color: colors.text
            },
            node: {
                color: colors.textDisabled
            },
            iconView: {
                minWidth: 20,
            },
            iconImage: {
                height: "100%",
                width: 40
            },
            statusIcon: {
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: colors.background,
                borderRadius: 12
            }
        })
    );

    const getServerAddress = () => {
        let ip = props.server.node?.publicHost;
        if (props.server.ip && props.server.ip !== "0.0.0.0") {
            ip = props.server.ip;
        }

        return ip + (props.server.port ? ":" + props.server.port : "");
    };

    const getStatusIcon = () => {
        if (props.server.online === "installing") {
            return "package-down";
        }

        if (props.server.online === "offline") {
            return "stop-circle";
        }

        if (props.server.online === "online") {
            return "play-circle";
        }

        // TODO: Use "loading" and make it spin
        return "reload";
    };

    const getStatusColor = () => {
        if (props.server.online === "installing" || props.server.online === "online") {
            return colors.primary;
        }

        return colors.textDisabled;
    }

    const onPress = () => {
        router.push(`/(app)/server/${props.server.id}`);
    };

    return (
        <TouchableOpacity style={style.server} onPress={onPress}>
            <View style={style.infoView}>
                <Text style={style.name} numberOfLines={1}>{props.server.name}</Text>
                <Text style={style.node} numberOfLines={1}>{getServerAddress()} @ {props.server.node?.name}</Text>
            </View>

            <View style={style.iconView}>
                {props.server.icon && (
                    <Image
                        source={icons[props.server.icon]}
                        contentFit="contain"
                        style={style.iconImage}
                    />
                )}

                {props.server.canGetStatus && (
                    <MaterialCommunityIcons
                        size={20}
                        color={getStatusColor()}
                        name={getStatusIcon()}
                        style={style.statusIcon}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}