import { ReactNode } from "react";
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

type ProvidersProps = {
    children: ReactNode;
};

export default function Providers(props: ProvidersProps) {
    const theme = useNavigationColors();

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