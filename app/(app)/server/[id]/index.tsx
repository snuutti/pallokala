import { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    useDerivedValue,
} from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ConsoleText from "@/components/server/console/ConsoleText";
import TextInput from "@/components/ui/TextInput";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";
import useAutoScroll from "@/hooks/useAutoScroll";
import { ServerLogs } from "pufferpanel";

const decoder = new TextDecoder("utf-8");

const useGradualAnimation = () => {
    const height = useSharedValue(0);

    useKeyboardHandler(
        {
            onMove: (e) => {
                "worklet";
                height.value = e.height;
            },
            onEnd: (e) => {
                "worklet";
                height.value = e.height;
            }
        },
        []
    );

    return { height };
};

export default function ConsoleScreen() {
    const { t } = useTranslation();
    const { style } = useStyle(() =>
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
                backgroundColor: "#000",
                flexDirection: "row",
                height: 50
            },
            commandInput: {
                flex: 1,
                marginVertical: 4,
                marginHorizontal: 4,
                paddingVertical: 0
            },
            sendButton: {
                justifyContent: "center",
                paddingHorizontal: 10
            }
        })
    );
    const { server } = useServer();
    const [lines, setLines] = useState<string[]>([]);
    const { listRef, isAtBottom, listMounted, handleScroll, handleContentSizeChange, goToBottom } = useAutoScroll<string>({ data: lines });
    const chevronVisible = useSharedValue(0);
    const [initialScroll, setInitialScroll] = useState(true);
    const [hasGotItems, setHasGotItems] = useState(false);
    const [unbindEvent, setUnbindEvent] = useState<(() => void) | undefined>(undefined);
    const [task, setTask] = useState<NodeJS.Timeout | number | undefined>(undefined);
    const [lastMessageTime, setLastMessageTime] = useState(0);
    const [command, setCommand] = useState("");
    const { height } = useGradualAnimation();
    const tabBarHeight = useBottomTabBarHeight();

    const fakeView = useAnimatedStyle(
        () => ({
            height: height.value - tabBarHeight || 0
        }),
        []
    );

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
        if (initialScroll && listMounted && hasGotItems) {
            goToBottom();
            setInitialScroll(false);
        }
    }, [initialScroll, listMounted, hasGotItems]);

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

        const bin = atob(e.logs);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = bin.charCodeAt(i);
        }

        const decoded = decoder.decode(bytes).replaceAll("\r\n", "\n");
        const newLines = decoded.split("\n");
        // TODO: handle incomplete lines
        if (decoded.endsWith("\n")) {
            newLines.pop();
        }

        setLines((lines) => [...lines, ...newLines]);
        setHasGotItems(true);
    };

    const clearConsole = () => {
        setLines([]);
    };

    const sendCommand = () => {
        server?.sendCommand(command);
        setCommand("");
    };

    return (
        <View style={style.container}>
            {server?.hasScope("server.console") && (
                <>
                    <FlashList
                        ref={listRef}
                        onScroll={handleScroll}
                        onContentSizeChange={handleContentSizeChange}
                        data={lines}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => <ConsoleText text={item} />}
                        maintainVisibleContentPosition={{
                            autoscrollToBottomThreshold: 0.2,
                            startRenderingFromBottom: true
                        }}
                        showsVerticalScrollIndicator={false}
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
                <>
                    <View style={style.commandContainer}>
                        <TextInput
                            style={style.commandInput}
                            placeholder={t("servers:Command")}
                            hideLabel={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={command}
                            onChangeText={setCommand}
                            onSubmitEditing={sendCommand}
                        />

                        <TouchableOpacity style={style.sendButton} onPress={sendCommand}>
                            <MaterialCommunityIcons name="send" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={fakeView} />
                </>
            )}
        </View>
    );
}