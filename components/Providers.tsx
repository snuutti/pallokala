import { useEffect, ReactNode } from "react";
import { useColorScheme, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@react-navigation/native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { NotifierWrapper } from "react-native-notifier";
import { ModalProvider } from "@/context/ModalProvider";
import { ApiClientProvider } from "@/context/ApiClientProvider";
import { AccountProvider } from "@/context/AccountProvider";
import { ServerProvider } from "@/context/ServerProvider";
import { FileManagerProvider } from "@/context/FileManagerProvider";
import { SheetProvider } from "react-native-actions-sheet";
import Sheets from "@/components/Sheets";
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
                            <ApiClientProvider>
                                <AccountProvider>
                                    <ServerProvider>
                                        <FileManagerProvider>
                                            <SheetProvider>
                                                <Sheets />
                                                {props.children}
                                            </SheetProvider>
                                        </FileManagerProvider>
                                    </ServerProvider>
                                </AccountProvider>
                            </ApiClientProvider>
                        </ModalProvider>
                    </NotifierWrapper>
                </KeyboardProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}