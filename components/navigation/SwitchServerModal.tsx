import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import useBottomSheetBackHandler from "@/hooks/useBottomSheetBackHandler";
import { Account } from "@/types/account";

export type SwitchServerModalRef = {
    present: () => void;
};

export const SwitchServerModal = forwardRef<SwitchServerModalRef>(function SwitchServerModal(_, ref) {
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
                borderRadius: 15
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
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { handleSheetPositionChange } = useBottomSheetBackHandler(bottomSheetModalRef);
    const { accounts, activeAccount, changeAccount, deleteAccount } = useAccount();

    const snapPoints = useMemo(() => ["40%", "60%"], []);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderBackdrop = useCallback(
        (props: BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
            />
        ),
        []
    );

    const renderItem = useCallback(({ item }: { item: Account }) => {
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
            bottomSheetModalRef.current?.dismiss();
            await changeAccount(item);
        };

        const deleteAlert = () => {
            createAlertModal(
                t("app:Drawer.RemoveAccount"),
                t("app:Drawer.RemoveAccountBody"),
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
                bottomSheetModalRef.current?.dismiss();
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
    }, [bottomSheetModalRef, colors, style, activeAccount]);

    useImperativeHandle(ref, () => ({
        present: handlePresentModalPress,
    }));

    const addAccount = () => {
        bottomSheetModalRef.current?.dismiss();
        router.push("/(auth)/email");
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetPositionChange}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={style.background}
            handleIndicatorStyle={style.handle}
        >
            <TouchableOpacity style={[style.item, style.itemAdd]} onPress={addAccount}>
                <View style={style.infoView}>
                    <Text style={style.address}>{t("app:Drawer.AddAccount")}</Text>
                </View>
            </TouchableOpacity>

            <BottomSheetFlatList
                data={accounts}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={style.content}
            />
        </BottomSheetModal>
    );
});