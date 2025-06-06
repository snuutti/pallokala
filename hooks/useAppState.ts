import { useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export default function useAppState() {
    const [appState, setAppState] = useState(AppState.currentState);

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    return appState;
}