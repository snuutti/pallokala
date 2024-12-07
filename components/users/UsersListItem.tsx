import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useStyle } from "@/hooks/useStyle";
import { md5 } from "js-md5";
import { User, UserPermissionsView } from "pufferpanel";

type UsersListItemProps = {
    user: User | UserPermissionsView;
};

export default function UsersListItem(props: UsersListItemProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
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
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            otpView: {
                marginLeft: 5
            },
            otpIcon: {
                height: "100%",
                textAlignVertical: "center"
            },
            username: {
                color: colors.text
            },
            email: {
                color: colors.textDisabled
            }
        })
    );

    const onPress = () => {
        if ((props.user as User).id) {
            router.push(`./${(props.user as User).id}`);
        } else {
            router.push(`/(modal)/edituser?email=${(props.user as UserPermissionsView).email}`);
        }
    };

    return (
        <TouchableOpacity style={style.user} onPress={onPress}>
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

            {"otpActive" in props.user && props.user.otpActive && (
                <View style={style.otpView}>
                    <MaterialCommunityIcons name="two-factor-authentication" size={30} color={colors.text} style={style.otpIcon} />
                </View>
            )}
        </TouchableOpacity>
    );
}