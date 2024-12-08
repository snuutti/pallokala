import { useCallback, useRef, RefObject } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";
import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";

// Copied from https://gist.github.com/vanenshi/6c2938d2f7424979d76c06d66703df19

export default function useBottomSheetBackHandler(bottomSheetRef: RefObject<BottomSheetModal | null>) {
    const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(null);
    const handleSheetPositionChange = useCallback<
        NonNullable<BottomSheetModalProps["onChange"]>
    >(
        index => {
            const isBottomSheetVisible = index >= 0;
            if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
                backHandlerSubscriptionRef.current = BackHandler.addEventListener(
                    "hardwareBackPress",
                    () => {
                        bottomSheetRef.current?.dismiss();
                        return true;
                    }
                );
            } else if (!isBottomSheetVisible) {
                backHandlerSubscriptionRef.current?.remove();
                backHandlerSubscriptionRef.current = null;
            }
        },
        [bottomSheetRef, backHandlerSubscriptionRef]
    );

    return { handleSheetPositionChange };
}