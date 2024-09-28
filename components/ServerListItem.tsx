import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, getColors } from "@/constants/Colors";
import { Server } from "@/types/server";

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
    server: Server;
};

export default function ServerListItem(props: ServerListItemProps) {
    const colorScheme = useColorScheme();

    const colors = getColors(colorScheme);
    const style = styling(colors);

    const onPress = () => {
        router.push(`./server/${props.server.id}`);
    };

    return (
        <TouchableOpacity style={style.server} onPress={onPress}>
            <View style={style.infoView}>
                <Text style={style.name}>{props.server.name}</Text>
                <Text style={style.node}>{props.server.node.publicHost}:{props.server.port} @ {props.server.node.name}</Text>
            </View>

            <View style={style.iconView}>
                <Image
                    source={icons[props.server.icon]}
                    contentFit="contain"
                    style={style.iconImage}
                />

                <MaterialCommunityIcons size={20} color={colors.textDisabled} name="stop-circle" style={style.statusIcon} />
            </View>
        </TouchableOpacity>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        server: {
            height: 70,
            padding: 15,
            flexDirection: "row",
            backgroundColor: colors.background,
            marginHorizontal: 10,
            borderRadius: 15
        },
        infoView: {
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
            flex: 1
        },
        iconImage: {
            width: "100%",
            height: "100%"
        },
        statusIcon: {
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: colors.background,
            borderRadius: 12
        }
    });
}