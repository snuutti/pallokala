import { useNavigationState } from "@react-navigation/core";

export default function useIsInsideTabsNavigator() {
    return useNavigationState((state) => {
        return state?.type === "tab";
    });
}