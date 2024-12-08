import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAccount } from "@/context/AccountProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Account } from "@/types/account";

export type SwitchServerModalRef = {
    present: () => void;
};

export const SwitchServerModal = forwardRef<SwitchServerModalRef>((_, ref) => {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            background: {
                backgroundColor: colors.backdrop
            },
            handle: {
                backgroundColor: colors.background
            },
            content: {
                gap: 10
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

        const switchAccount = async () => {
            bottomSheetModalRef.current?.dismiss();
            await changeAccount(item);
        };

        const deleteAlert = () => {
            createAlertModal(
                "Remove Account",
                "Are you sure you want to remove this account?",
                [
                    { text: "Remove", icon: "trash-can", style: "danger", onPress: deleteConfirm },
                    { text: "Cancel" }
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
                            name={item.type === "oauth" ? "xml" : "email"}
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
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={style.background}
            handleIndicatorStyle={style.handle}
        >
            <TouchableOpacity style={[style.item, style.itemAdd]} onPress={addAccount}>
                <View style={style.infoView}>
                    <Text style={style.address}>Add new account</Text>
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