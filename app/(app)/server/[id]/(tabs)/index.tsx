import { useState } from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, useColorScheme } from "react-native";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ConsoleText from "@/components/server/console/ConsoleText";
import { Colors, getColors } from "@/constants/Colors";

const lines: string[] = [
    "[DAEMON] Starting server",
    "[DAEMON] Starting container",
    "Starting org.bukkit.craftbukkit.Main",
    "[20:33:56 INFO]: [bootstrap] Running Java 21 (OpenJDK 64-Bit Server VM 21.0.4+7-LTS; Eclipse Adoptium Temurin-21.0.4+7) on Linux 6.6.47+rpt-rpi-2712 (aarch64)",
    "[20:33:56 INFO]: [bootstrap] Loading Paper 1.21.1-83-master@2aaf436 (2024-09-17T15:10:44Z) for Minecraft 1.21.1",
    "[20:33:57 INFO]: [PluginInitializerManager] Initializing plugins...",
    "[20:33:57 INFO]: [PluginInitializerManager] Initialized 0 plugins",
    "[20:34:04 INFO]: Environment: Environment[sessionHost=https://sessionserver.mojang.com, servicesHost=https://api.minecraftservices.com, name=PROD]",
    "[20:34:08 INFO]: Loaded 1290 recipes",
    "[20:34:08 INFO]: Loaded 1399 advancements",
    "[20:34:08 INFO]: Starting minecraft server version 1.21.1",
    "[33;1m[20:34:08 WARN]: ****************************",
    "[m[33;1m[20:34:08 WARN]: YOU ARE RUNNING THIS SERVER AS AN ADMINISTRATIVE OR ROOT USER. THIS IS NOT ADVISED.",
    "[m[33;1m[20:34:08 WARN]: YOU ARE OPENING YOURSELF UP TO POTENTIAL RISKS WHEN DOING THIS.",
    "[m[33;1m[20:34:08 WARN]: FOR MORE INFORMATION, SEE https://madelinemiller.dev/blog/root-minecraft-server/",
    "[m[33;1m[20:34:08 WARN]: ****************************",
    "[m[20:34:08 INFO]: Loading properties",
    "[20:34:08 INFO]: This server is running Paper version 1.21.1-83-master@2aaf436 (2024-09-17T15:10:44Z) (Implementing API version 1.21.1-R0.1-SNAPSHOT)",
    "[20:34:09 INFO]: [spark] This server bundles the spark profiler. For more information please visit https://docs.papermc.io/paper/profiling",
    "[20:34:10 INFO]: Server Ping Player Sample Count: 12",
    "[20:34:10 INFO]: Using 4 threads for Netty based IO",
    "[20:34:11 INFO]: [ChunkTaskScheduler] Chunk system is using 1 I/O threads, 1 worker threads, and population gen parallelism of 1 threads",
    "[20:34:11 INFO]: Default game type: SURVIVAL",
    "[20:34:11 INFO]: Generating keypair",
    "[20:34:11 INFO]: Starting Minecraft server on 0.0.0.0:25565",
    "[20:34:11 INFO]: Using epoll channel type",
    "[20:34:11 INFO]: Paper: Using libdeflate (Linux aarch64) compression from Velocity.",
    "[20:34:11 INFO]: Paper: Using OpenSSL 3.x.x (Linux aarch64) cipher from Velocity.",
    "[20:34:12 INFO]: Server permissions file permissions.yml is empty, ignoring it",
    "[20:34:12 INFO]: Preparing level \"world\"",
    "[20:34:12 INFO]: Preparing start region for dimension minecraft:overworld",
    "[20:34:14 INFO]: Time elapsed: 1557 ms",
    "[20:34:14 INFO]: Preparing start region for dimension minecraft:the_nether",
    "[20:34:14 INFO]: Time elapsed: 389 ms",
    "[20:34:14 INFO]: Preparing start region for dimension minecraft:the_end",
    "[20:34:14 INFO]: Time elapsed: 313 ms",
    "[20:34:14 INFO]: [spark] Starting background profiler...",
    "[20:34:15 INFO]: Done preparing level \"world\" (3.056s)",
    "[20:34:15 INFO]: Running delayed init tasks",
    "[20:34:15 INFO]: Done (19.407s)! For help, type \"help\"",
    "[20:34:15 INFO]: Timings Reset",
    "spark tps",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m TPS from last 5s, 10s, 1m, 5m, 15m:[0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m  [92m*20.0[37m, [92m*20.0[37m, [92m*20.0[37m, [92m*20.0[37m, [92m*20.0[0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m [0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m Tick durations (min/med/95%ile/max ms) from last 10s, 1m:[0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m  [92m0.9[37m/[92m2.9[37m/[92m9.5[37m/[92m39.2[37m;  [92m0.9[37m/[92m2.9[37m/[92m9.5[37m/[92m39.2[0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m [0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m CPU usage from last 10s, 1m, 15m:[0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m  [92m23%[37m, [92m23%[37m, [92m23%[90m  (system)[0m",
    "[20:34:19 INFO]: [37m[90m[[1m[93mâ¡[0m[90m][37m  [92m23%[37m, [92m23%[37m, [92m23%[90m  (process)[0m",
    "[DAEMON] Server was told to stop",
    "stop",
    "[20:34:20 INFO]: Stopping the server",
    "[20:34:20 INFO]: Stopping server",
    "[20:34:20 INFO]: Saving players",
    "[20:34:20 INFO]: Saving worlds",
    "[20:34:20 INFO]: Saving chunks for level 'ServerLevel[world]'/minecraft:overworld",
    "[20:34:20 INFO]: [ChunkHolderManager] Waiting 60s for chunk system to halt for world 'world'",
    "[20:34:20 INFO]: [ChunkHolderManager] Halted chunk system for world 'world'",
    "[20:34:20 INFO]: [ChunkHolderManager] Saving all chunkholders for world 'world'",
    "[20:34:21 INFO]: [ChunkHolderManager] Saved 49 block chunks, 49 entity chunks, 0 poi chunks in world 'world' in 0.44s",
    "[20:34:21 INFO]: Saving chunks for level 'ServerLevel[world_nether]'/minecraft:the_nether",
    "[20:34:21 INFO]: [ChunkHolderManager] Waiting 60s for chunk system to halt for world 'world_nether'",
    "[20:34:21 INFO]: [ChunkHolderManager] Halted chunk system for world 'world_nether'",
    "[20:34:21 INFO]: [ChunkHolderManager] Saving all chunkholders for world 'world_nether'",
    "[20:34:22 INFO]: [ChunkHolderManager] Saved 49 block chunks, 49 entity chunks, 0 poi chunks in world 'world_nether' in 0.19s",
    "[20:34:22 INFO]: Saving chunks for level 'ServerLevel[world_the_end]'/minecraft:the_end",
    "[20:34:22 INFO]: [ChunkHolderManager] Waiting 60s for chunk system to halt for world 'world_the_end'",
    "[20:34:22 INFO]: [ChunkHolderManager] Halted chunk system for world 'world_the_end'",
    "[20:34:22 INFO]: [ChunkHolderManager] Saving all chunkholders for world 'world_the_end'",
    "[20:34:22 INFO]: [ChunkHolderManager] Saved 49 block chunks, 49 entity chunks, 0 poi chunks in world 'world_the_end' in 0.16s",
    "[20:34:22 INFO]: ThreadedAnvilChunkStorage (world): All chunks are saved",
    "[20:34:22 INFO]: ThreadedAnvilChunkStorage (DIM-1): All chunks are saved",
    "[20:34:22 INFO]: ThreadedAnvilChunkStorage (DIM1): All chunks are saved",
    "[20:34:22 INFO]: ThreadedAnvilChunkStorage: All dimensions are saved",
    "[DAEMON] Running post-execution steps"
];

export default function ConsoleScreen() {
    const colorScheme = useColorScheme();
    const [command, setCommand] = useState("");

    const colors = getColors(colorScheme);
    const style = styling(colors);

    return (
        <KeyboardAvoidingView style={style.container} behavior="height" keyboardVerticalOffset={100}>
            <FlashList
                data={lines}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <ConsoleText text={item} />}
                estimatedItemSize={30}
                contentContainerStyle={style.logContainer}
            />

            <View style={style.commandContainer}>
                <TextInput
                    style={style.commandInput}
                    placeholder="Command"
                    placeholderTextColor={colors.textDisabled}
                    value={command}
                    onChangeText={setCommand}
                />

                <TouchableOpacity style={style.sendButton}>
                    <MaterialCommunityIcons name="send" size={30} color={colors.text} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            flex: 1
        },
        logContainer: {
            backgroundColor: "#000"
        },
        commandContainer: {
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