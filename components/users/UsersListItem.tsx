import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { md5 } from "js-md5";
import { User } from "pufferpanel";

type UsersListItemProps = {
    user: User;
};

export default function UsersListItem(props: UsersListItemProps) {
    const { style } = useStyle(styling);

    return (
        <TouchableOpacity style={style.user}>
            <View style={style.avatarView}>
                <Image
                    source={`https://www.gravatar.com/avatar/${md5(props.user.email?.trim().toLowerCase() || "")}?d=mp`}
                    contentFit="contain"
                    style={style.avatar}
                />
            </View>

            <View style={style.infoView}>
                <Text style={style.username} numberOfLines={1}>{props.user.username}</Text>
                <Text style={style.email} numberOfLines={1}>{props.user.email}</Text>
            </View>
        </TouchableOpacity>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        user: {
            height: 70,
            padding: 15,
            flexDirection: "row",
            backgroundColor: colors.background,
            marginHorizontal: 10,
            borderRadius: 15
        },
        avatarView: {
            minWidth: 20,
            marginRight: 15
        },
        avatar: {
            height: "100%",
            width: 40,
            borderRadius: 40
        },
        infoView: {
            flexGrow: 1,
            flexDirection: "column",
            justifyContent: "center"
        },
        username: {
            color: colors.text
        },
        email: {
            color: colors.textDisabled
        }
    });
}