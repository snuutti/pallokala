import { useEffect, ReactNode } from "react";
import { useColorScheme, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@react-navigation/native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NotifierWrapper } from "react-native-notifier";
import { ModalProvider } from "@/context/ModalProvider";
import { ApiClientProvider } from "@/context/ApiClientProvider";
import { AccountProvider } from "@/context/AccountProvider";
import { SwitchServerModalProvider } from "@/context/SwitchServerModalProvider";
import { ServerProvider } from "@/context/ServerProvider";
import { FileManagerProvider } from "@/context/FileManagerProvider";
import { useNavigationColors } from "@/hooks/useStyle";
import { getColors } from "@/constants/colors";

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers(props: ProvidersProps) {
    const theme = useNavigationColors();
    const colorScheme = useColorScheme();

    useEffect(() => {
        const colors = getColors(colorScheme);
        StatusBar.setBarStyle(colors.dark ? "light-content" : "dark-content", true);
    }, [colorScheme]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={theme}>
                <KeyboardProvider>
                    <NotifierWrapper>
                        <ModalProvider>
                            <BottomSheetModalProvider>
                                <ApiClientProvider>
                                    <AccountProvider>
                                        <SwitchServerModalProvider>
                                            <ServerProvider>
                                                <FileManagerProvider>
                                                    {props.children}
                                                </FileManagerProvider>
                                            </ServerProvider>
                                        </SwitchServerModalProvider>
                                    </AccountProvider>
                                </ApiClientProvider>
                            </BottomSheetModalProvider>
                        </ModalProvider>
                    </NotifierWrapper>
                </KeyboardProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}