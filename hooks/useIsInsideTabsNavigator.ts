import { useNavigationState } from "expo-router/react-navigation";

export default function useIsInsideTabsNavigator() {
    return useNavigationState((state) => {
        return state?.type === "tab";
    });
}