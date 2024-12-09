import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useDerivedValue,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ConsoleText from "@/components/server/console/ConsoleText";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";
import useAutoScroll from "@/hooks/useAutoScroll";
import { ServerLogs } from "pufferpanel";

export default function ConsoleScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: "#000"
            },
            clearConsole: {
                position: "absolute",
                top: 5,
                right: 5
            },
            autoScroll: {
                position: "absolute",
                bottom: 55,
                right: 5
            },
            commandContainer: {
                backgroundColor: colors.backdrop,
                flexDirection: "row",
                height: 50
            },
            commandInput: {
                flex: 1,
                color: colors.text,
                backgroundColor: colors.background,
                paddingHorizontal: 5
            },
            sendButton: {
                justifyContent: "center",
                paddingHorizontal: 20
            }
        })
    );
    const { server } = useServer();
    const [lines, setLines] = useState<string[]>([]);
    const { listRef, isAtBottom, listMounted, handleScroll, handleContentSizeChange, goToBottom } = useAutoScroll<string>({ data: lines });
    const chevronVisible = useSharedValue(0);
    const [initialScroll, setInitialScroll] = useState(true);
    const [unbindEvent, setUnbindEvent] = useState<(() => void) | undefined>(undefined);
    const [task, setTask] = useState<NodeJS.Timeout | undefined>(undefined);
    const [lastMessageTime, setLastMessageTime] = useState(0);
    const [command, setCommand] = useState("");

    useEffect(() => {
        if (server === undefined) {
            return;
        }

        if (server.hasScope("server.console")) {
            server.getConsole().then(onMessage);
        }

        setUnbindEvent(() => server.on("console", onMessage));

        setTask(server.startTask(async () => {
            if (server.needsPolling() && server.hasScope("server.console")) {
                onMessage(await server.getConsole(lastMessageTime));
            }
        }, 5000));

        return () => {
            unbindEvent?.();
            task && server.stopTask(task);
        };
    }, [server]);

    useEffect(() => {
        if (initialScroll && listMounted) {
            goToBottom();
            setInitialScroll(false);
        }
    }, [initialScroll, listMounted]);

    useDerivedValue(() => {
        chevronVisible.value = isAtBottom ? 0 : 1;
    }, [isAtBottom]);

    const chevronStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(chevronVisible.value, { duration: 300 }),
        }
    });

    const onMessage = (e: ServerLogs) => {
        if (e.epoch) {
            setLastMessageTime(e.epoch);
        } else {
            setLastMessageTime(Date.now());
        }

        const decoded = atob(e.logs).replaceAll("\r\n", "\n");
        const newLines = decoded.split("\n");
        // TODO: handle incomplete lines
        if (decoded.endsWith("\n")) {
            newLines.pop();
        }

        setLines((lines) => [...lines, ...newLines]);
    };

    const clearConsole = () => {
        setLines([]);
    };

    const sendCommand = () => {
        server?.sendCommand(command);
        setCommand("");
    };

    return (
        <KeyboardAvoidingView style={style.container} behavior="height" keyboardVerticalOffset={100}>
            {server?.hasScope("server.console") && (
                <>
                    <FlashList
                        ref={listRef}
                        onScroll={handleScroll}
                        onContentSizeChange={handleContentSizeChange}
                        data={lines}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => <ConsoleText text={item} />}
                        estimatedItemSize={30}
                    />

                    <TouchableOpacity style={style.clearConsole} onPress={clearConsole}>
                        <MaterialCommunityIcons name="text-box-remove" size={30} color="#fff" />
                    </TouchableOpacity>

                    <Animated.View style={[style.autoScroll, chevronStyle]}>
                        <TouchableOpacity onPress={goToBottom} disabled={isAtBottom}>
                            <MaterialCommunityIcons name="chevron-double-down" size={30} color="#fff" />
                        </TouchableOpacity>
                    </Animated.View>
                </>
            )}

            {server?.hasScope("server.console.send") && (
                <View style={style.commandContainer}>
                    <TextInput
                        style={style.commandInput}
                        placeholder={t("servers:Command")}
                        placeholderTextColor={colors.textDisabled}
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={command}
                        onChangeText={setCommand}
                        onSubmitEditing={sendCommand}
                    />

                    <TouchableOpacity style={style.sendButton} onPress={sendCommand}>
                        <MaterialCommunityIcons name="send" size={30} color={colors.text} />
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}