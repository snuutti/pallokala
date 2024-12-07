import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { md5 } from "js-md5";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            drawerContainer: {
                flex: 1
            },
            userContainer: {
                padding: 20
            },
            avatar: {
                height: 67.5,
                width: 67.5,
                borderRadius: 40,
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
                padding: 20
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
    const { present } = useSwitchServerModal();

    return (
        <View style={style.drawerContainer}>
            <DrawerContentScrollView {...props}>
                <View style={style.userContainer}>
                    <TouchableOpacity onPress={() => router.push("/self")}>
                        <Image
                            source={`https://www.gravatar.com/avatar/${md5(user?.email?.trim().toLowerCase() || "")}?d=mp`}
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
                <TouchableOpacity style={style.action} onPress={present}>
                    <MaterialCommunityIcons name="swap-horizontal" size={22} color={colors.text} />
                    <View style={style.actionTextContainer}>
                        <Text style={style.actionTextHeader}>
                            Switch server
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