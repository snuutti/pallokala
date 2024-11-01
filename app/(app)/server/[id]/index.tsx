import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ConsoleText from "@/components/server/console/ConsoleText";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { ServerLogs } from "pufferpanel";

export default function ConsoleScreen() {
    const { style, colors } = useStyle(styling);
    const { server } = useServer();
    const [unbindEvent, setUnbindEvent] = useState<(() => void) | undefined>(undefined);
    const [task, setTask] = useState<NodeJS.Timeout | undefined>(undefined);
    const [lines, setLines] = useState<string[]>([]);
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
                        data={lines}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => <ConsoleText text={item} />}
                        estimatedItemSize={30}
                    />

                    <TouchableOpacity style={style.clearConsole} onPress={clearConsole}>
                        <MaterialCommunityIcons name="text-box-remove" size={30} color="#fff" />
                    </TouchableOpacity>
                </>
            )}

            {server?.hasScope("server.console.send") && (
                <View style={style.commandContainer}>
                    <TextInput
                        style={style.commandInput}
                        placeholder="Command"
                        placeholderTextColor={colors.textDisabled}
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

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#000"
        },
        clearConsole: {
            position: "absolute",
            top: 5,
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
            backgroundColor: colors.background
        },
        sendButton: {
            justifyContent: "center",
            paddingHorizontal: 20
        }
    });
}