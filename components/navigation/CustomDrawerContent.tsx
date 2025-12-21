import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { SheetManager } from "react-native-actions-sheet";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { avatarPlaceholder } from "@/constants/placeholder";
import { md5 } from "js-md5";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            drawerContainer: {
                flex: 1,
                paddingBottom: insets.bottom
            },
            userContainer: {
                padding: 20
            },
            avatar: {
                height: 67.5,
                width: 67.5,
                borderRadius: 40,
                borderColor: colors.textPrimary,
                borderWidth: 2,
                marginBottom: 10,
                marginTop: 30
            },
            username: {
                color: colors.text,
                fontSize: 18
            },
            server: {
                color: colors.text,
                fontSize: 16,
                marginBottom: 5
            },
            itemsContainer: {
                flex: 1,
                paddingTop: 10
            },
            actionsContainer: {
                padding: 20,
                paddingBottom: 0
            },
            action: {
                paddingVertical: 15,
                flexDirection: "row",
                alignItems: "center"
            },
            actionTextContainer: {
                flexDirection: "column"
            },
            actionTextHeader: {
                color: colors.text,
                fontSize: 15,
                marginLeft: 5
            },
            actionTextSubheader: {
                color: colors.text,
                fontSize: 10,
                marginLeft: 5
            }
        })
    );
    const { config } = useApiClient();
    const { activeAccount, user } = useAccount();

    return (
        <View style={style.drawerContainer}>
            <DrawerContentScrollView {...props}>
                <View style={style.userContainer}>
                    <TouchableOpacity onPress={() => router.push("/self")}>
                        <Image
                            source={`https://www.gravatar.com/avatar/${md5(user?.email?.trim().toLowerCase() || "")}?d=mp`}
                            contentFit="contain"
                            placeholder={{ blurhash: avatarPlaceholder }}
                            placeholderContentFit="contain"
                            style={style.avatar}
                        />
                    </TouchableOpacity>

                    <Text style={style.username}>{user?.username}</Text>
                    <Text style={style.server}>{config?.branding.name}</Text>
                </View>

                <View style={style.itemsContainer}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={style.actionsContainer}>
                <TouchableOpacity style={style.action} onPress={() => router.push("/(modal)/about")}>
                    <MaterialCommunityIcons name="information" size={22} color={colors.text} />
                    <Text style={style.actionTextHeader}>
                        {t("app:Drawer.About")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={style.action} onPress={() => SheetManager.show("switch-server-sheet")}>
                    <MaterialCommunityIcons name="swap-horizontal" size={22} color={colors.text} />
                    <View style={style.actionTextContainer}>
                        <Text style={style.actionTextHeader}>
                            {t("app:Drawer.SwitchServer")}
                        </Text>

                        <Text style={style.actionTextSubheader}>
                            {activeAccount?.serverAddress}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}