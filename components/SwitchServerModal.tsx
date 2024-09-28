import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View, useColorScheme, StyleSheet } from "react-native";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, getColors } from "@/constants/Colors";

type PufferPanelServer = {
    address: string;
    email: string;
};

const servers: PufferPanelServer[] = [
    {
        address: "https://pufferpanel.server.url",
        email: "test@example.com"
    },
    {
        address: "https://pufferpanel.server.url",
        email: "test@example.com"
    }
];

export type SwitchServerModalRef = {
    present: () => void;
};

export const SwitchServerModal = forwardRef<SwitchServerModalRef>((_, ref) => {
    const colorScheme = useColorScheme();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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

    const renderItem = useCallback(({ item }: { item: PufferPanelServer }) => {
        return (
            <TouchableOpacity style={style.item}>
                <View style={style.infoView}>
                    <Text style={style.address}>{item.address}</Text>
                    <Text style={style.user}>{item.email}</Text>
                </View>

                <TouchableOpacity style={style.actionsView}>
                    <MaterialCommunityIcons name="trash-can" size={30} color={colors.text} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }, [colors, style]);

    useImperativeHandle(ref, () => ({
        present: handlePresentModalPress,
    }));

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={style.background}
            handleIndicatorStyle={style.handle}
        >
            <BottomSheetFlatList
                data={servers}
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