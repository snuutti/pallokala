import { useRef } from "react";
import { Text, TouchableOpacity, View, FlatList, StyleSheet } from "react-native";
import ActionSheet, { ActionSheetRef, ScrollView } from "react-native-actions-sheet";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Account } from "@/types/account";

export default function SwitchServerSheet() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            background: {
                backgroundColor: colors.backdrop
            },
            handle: {
                backgroundColor: colors.background
            },
            content: {
                gap: 10,
                paddingBottom: insets.bottom
            },
            item: {
                height: 70,
                padding: 15,
                flexDirection: "row",
                backgroundColor: colors.background,
                marginHorizontal: 10,
                borderRadius: 15,
                boxShadow: colors.raised
            },
            itemActive: {
                backgroundColor: colors.primaryHover
            },
            itemAdd: {
                marginBottom: 10
            },
            infoView: {
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            userView: {
                flexDirection: "row",
                alignItems: "center"
            },
            address: {
                color: colors.text
            },
            user: {
                flex: 1,
                color: colors.textDisabled
            },
            loginMethod: {
                marginRight: 5
            },
            actionsView: {
                justifyContent: "center"
            }
        })
    );
    const { createAlertModal } = useModal();
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const { accounts, activeAccount, changeAccount, deleteAccount } = useAccount();

    const renderItem = ({ item }: { item: Account }) => {
        const isActive = activeAccount?.id === item.id;

        const getIcon = () => {
            if (item.serverAddress === "http://pallokala.test") {
                return "test-tube";
            } else if (item.type === "oauth") {
                return "xml";
            } else {
                return "email";
            }
        };

        const switchAccount = async () => {
            actionSheetRef.current?.hide();
            await changeAccount(item);
        };

        const deleteAlert = () => {
            actionSheetRef.current?.hide();
            createAlertModal(
                t("app:Drawer.RemoveAccount"),
                t("app:Drawer.RemoveAccountBody", { name: item.nickname }),
                [
                    {
                        text: t("app:Drawer.RemoveAccountButton"),
                        icon: "trash-can",
                        style: "danger",
                        onPress: deleteConfirm
                    },
                    {
                        text: t("common:Cancel"),
                        icon: "close"
                    }
                ]
            );
        };

        const deleteConfirm = async () => {
            if (isActive) {
                actionSheetRef.current?.hide();
            }

            await deleteAccount(item);
        };

        return (
            <TouchableOpacity style={[style.item, isActive && style.itemActive]} onPress={switchAccount} disabled={isActive}>
                <View style={style.infoView}>
                    <Text style={style.address} numberOfLines={1}>{item.serverAddress}</Text>

                    <View style={style.userView}>
                        <MaterialCommunityIcons
                            name={getIcon()}
                            size={15}
                            color={colors.textDisabled}
                            style={style.loginMethod}
                        />

                        <Text style={style.user} numberOfLines={1}>{item.nickname}</Text>
                    </View>
                </View>

                <TouchableOpacity style={style.actionsView} onPress={deleteAlert}>
                    <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const addAccount = () => {
        actionSheetRef.current?.hide();
        router.push("/(auth)/email");
    };

    return (
        <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            snapPoints={[60, 80]}
            containerStyle={style.background}
            indicatorStyle={style.handle}
        >
            <TouchableOpacity style={[style.item, style.itemAdd]} onPress={addAccount}>
                <View style={style.infoView}>
                    <Text style={style.address}>{t("app:Drawer.AddAccount")}</Text>
                </View>
            </TouchableOpacity>

            <FlatList
                data={accounts}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={style.content}
                renderScrollComponent={props => <ScrollView {...props} />}
            />
        </ActionSheet>
    );
}