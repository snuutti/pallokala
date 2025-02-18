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
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/changelog"
                options={{
                    title: t("app:About.ChangelogTitle"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/search"
                options={{
                    title: t("app:Search.Title"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/createserver"
                options={{
                    title: t("servers:Create"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/createnode"
                options={{
                    title: t("nodes:Create"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/createuser"
                options={{
                    title: t("users:Create"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/editfile"
                options={{
                    title: openFile?.name || t("app:Servers.Files.EditFile"),
                    presentation: "modal",
                    animation: "fade_from_bottom",
                    headerRight: SaveButton
                }}
            />

            <Stack.Screen
                name="(modal)/filedetails"
                options={{
                    title: t("app:Servers.Files.FileDetails"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/deploynode"
                options={{
                    title: t("nodes:Deploy"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/edituser"
                options={{
                    title: t("users:Edit"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/edittask"
                options={{
                    title: t("app:Servers.Tasks.EditTask"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/enroll2fa"
                options={{
                    title: t("users:Otp"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />

            <Stack.Screen
                name="(modal)/oauthcreds"
                options={{
                    title: t("oauth:Credentials"),
                    presentation: "modal",
                    animation: "fade_from_bottom"
                }}
            />
        </Stack>
    );
}