import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View, useColorScheme, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAccount } from "@/context/AccountProvider";
import { Colors, getColors } from "@/constants/Colors";
import { Account } from "@/types/account";

export type SwitchServerModalRef = {
    present: () => void;
};

export const SwitchServerModal = forwardRef<SwitchServerModalRef>((_, ref) => {
    const colorScheme = useColorScheme();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { accounts, activeAccount, changeAccount, deleteAccount } = useAccount();

    const colors = getColors(colorScheme);
    const style = styling(colors);

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
            Alert.alert(
                "Remove Account",
                "Are you sure you want to remove this account?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Remove", style: "destructive", onPress: deleteConfirm }
                ],
                {
                    cancelable: true
                }
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
                    <Text style={style.address}>{item.serverAddress}</Text>
                    <Text style={style.user}>{item.id}</Text>
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
        router.push("/login");
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

function styling(colors: Colors) {
    return StyleSheet.create({
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
            flexDirection: "column",
            justifyContent: "center"
        },
        address: {
            color: colors.text
        },
        user: {
            color: colors.textDisabled
        },
        actionsView: {
            justifyContent: "center"
        }
    });
}