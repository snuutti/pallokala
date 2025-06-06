import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function useBackHandler(handler: () => boolean) {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", handler);

        return () => {
            backHandler.remove();
        };
    }, [handler]);
}