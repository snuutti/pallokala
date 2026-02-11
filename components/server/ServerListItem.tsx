import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Image, ImageBackground } from "expo-image";
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
    "hytale": require("@/assets/images/icons/hytale.png"),
    "minecraft-bedrock": require("@/assets/images/icons/minecraft-bedrock.png"),
    "minecraft-java": require("@/assets/images/icons/minecraft-java.png"),
    "rust": require("@/assets/images/icons/rust.png"),
    "satisfactory": require("@/assets/images/icons/satisfactory.png"),
    "squad": require("@/assets/images/icons/squad.png"),
    "starbound": require("@/assets/images/icons/starbound.png"),
    "terraria": require("@/assets/images/icons/terraria.png"),
    "tf2": require("@/assets/images/icons/tf2.png"),
    "valheim": require("@/assets/images/icons/valheim.png"),
    "vintage-story": require("@/assets/images/icons/vintage-story.png"),
    "zomboid": require("@/assets/images/icons/zomboid.png")
};

const heros: Record<string, string> = {
    "7days2die": require("@/assets/images/heros/7days2die.jpg"),
    "ark": require("@/assets/images/heros/ark.jpg"),
    "arma3": require("@/assets/images/heros/arma3.jpg"),
    "csgo": require("@/assets/images/heros/csgo.jpg"),
    "css": require("@/assets/images/heros/css.jpg"),
    "dontstarvetogether": require("@/assets/images/heros/dontstarvetogether.jpg"),
    "eco": require("@/assets/images/heros/eco.jpg"),
    "factorio": require("@/assets/images/heros/factorio.jpg"),
    "gmod": require("@/assets/images/heros/gmod.jpg"),
    "hytale": require("@/assets/images/heros/hytale.jpg"),
    "minecraft-bedrock": require("@/assets/images/heros/minecraft-bedrock.jpg"),
    "minecraft-java": require("@/assets/images/heros/minecraft-java.jpg"),
    "rust": require("@/assets/images/heros/rust.jpg"),
    "satisfactory": require("@/assets/images/heros/satisfactory.jpg"),
    "squad": require("@/assets/images/heros/squad.jpg"),
    "starbound": require("@/assets/images/heros/starbound.jpg"),
    "terraria": require("@/assets/images/heros/terraria.jpg"),
    "tf2": require("@/assets/images/heros/tf2.jpg"),
    "valheim": require("@/assets/images/heros/valheim.jpg"),
    "vintage-story": require("@/assets/images/heros/vintage-story.jpg"),
    "zomboid": require("@/assets/images/heros/zomboid.jpg")
};

type ServerListItemProps = {
    server: ExtendedServerView;
};

export default function ServerListItem(props: ServerListItemProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            server: {
                height: 70,
                marginHorizontal: 10,
                marginVertical: 5
            },
            background: {
                height: "100%",
                backgroundColor: colors.background,
                borderRadius: 15,
                padding: 15,
                flexDirection: "row",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
            },
            backgroundImage: {
                borderRadius: 15,
                filter: "opacity(0.15)"
            }
        })
    );

    const onPress = () => {
        router.push(`/(app)/server/${props.server.id}`);
    };

    if (!props.server.icon || !heros[props.server.icon]) {
        return (
            <TouchableOpacity style={[style.background, style.server]} onPress={onPress}>
                <ServerListItemContent server={props.server} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={style.server} onPress={onPress}>
            <ImageBackground source={heros[props.server.icon]} style={style.background} imageStyle={style.backgroundImage}>
                <ServerListItemContent server={props.server} />
            </ImageBackground>
        </TouchableOpacity>
    );
}

function ServerListItemContent(props: ServerListItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
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
                width: 40,
                filter: colors.serverTypeIconFilter
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

    return (
        <>
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
        </>
    );
}