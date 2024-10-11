import { Stack } from "expo-router";
import { useServer } from "@/context/ServerProvider";

export default function ServerLayout() {
    const { openFile } = useServer();

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="(modal)/editfile"
                options={{
                    title: openFile?.name || "Edit File",
                    presentation: "modal",
                    animation: "fade_from_bottom",
                }}
            />
        </Stack>
    );
}