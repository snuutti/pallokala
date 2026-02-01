import { Platform } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import SaveButton from "@/components/server/files/SaveButton";
import { useAccount } from "@/context/AccountProvider";
import { useServer } from "@/context/ServerProvider";

export default function RootNavigation() {
    const { t } = useTranslation();
    const { accounts } = useAccount();
    const { openFile } = useServer();

    return (
        <Stack>
            <Stack.Screen
                name="(app)"
                options={{
                    title: "",
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="(auth)"
                options={{
                    title: t("users:Login"),
                    headerShown: accounts.length > 0
                }}
            />

            <Stack.Screen
                name="(modal)/about"
                options={{
                    title: t("app:About.Title"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/changelog"
                options={{
                    title: t("app:About.ChangelogTitle"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/search"
                options={{
                    title: t("hotkeys:Global./"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/createserver"
                options={{
                    title: t("servers:Create"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/createnode"
                options={{
                    title: t("nodes:Create"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/createuser"
                options={{
                    title: t("users:Create"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/editfile"
                options={{
                    title: openFile?.name || t("app:Servers.Files.EditFile"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom",
                    headerRight: SaveButton
                }}
            />

            <Stack.Screen
                name="(modal)/filedetails"
                options={{
                    title: t("app:Servers.Files.FileDetails"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/deploynode"
                options={{
                    title: t("nodes:Deploy"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/edituser"
                options={{
                    title: t("users:Edit"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/edittask"
                options={{
                    title: t("app:Servers.Tasks.EditTask"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/editoperator"
                options={{
                    title: t("app:Templates.Operators.EditTitle"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/enroll2fa"
                options={{
                    title: t("users:Otp"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/recoverycodes"
                options={{
                    title: t("users:RecoveryCodes"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/oauthcreds"
                options={{
                    title: t("oauth:Credentials"),
                    animation: Platform.OS === "ios" ? "default" : "fade_from_bottom"
                }}
            />
        </Stack>
    );
}