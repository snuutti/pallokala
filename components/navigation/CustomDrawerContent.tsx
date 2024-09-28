import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSwitchServerModal } from "@/context/SwitchServerModalProvider";
import { Colors, getColors } from "@/constants/Colors";

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
    const colorScheme = useColorScheme();
    const { present } = useSwitchServerModal();

    const colors = getColors(colorScheme);
    const styles = styling(colors);

    return (
        <View style={styles.drawerContainer}>
            <DrawerContentScrollView {...props}>
                <View style={styles.userContainer}>
                    <TouchableOpacity>
                        <Image
                            source="https://www.gravatar.com/avatar/0?d=mp"
                            style={styles.avatar}
                        />
                    </TouchableOpacity>

                    <Text style={styles.username}>username</Text>
                    <Text style={styles.server}>branding name</Text>
                </View>

                <View style={styles.itemsContainer}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.action} onPress={present}>
                    <MaterialCommunityIcons name="swap-horizontal" size={22} color={colors.text} />
                    <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTextHeader}>
                            Switch server
                        </Text>

                        <Text style={styles.actionTextSubheader}>
                            https://pufferpanel.server.url
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
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
    });
}