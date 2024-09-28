import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import FileItem from "@/components/server/files/FileItem";
import { ServerFile } from "@/types/file";

const filesUnsorted: ServerFile[] = [
    {
        "name": "logs",
        "isFile": false
    },
    {
        "name": "version_history.json",
        "modifyTime": 1726673230,
        "size": 51,
        "isFile": true,
        "extension": ".json"
    },
    {
        "name": "usercache.json",
        "modifyTime": 1726869870,
        "size": 2,
        "isFile": true,
        "extension": ".json"
    },
    {
        "name": "plugins",
        "isFile": false
    },
    {
        "name": "world",
        "isFile": false
    },
    {
        "name": "versions",
        "isFile": false
    },
    {
        "name": "server.properties",
        "modifyTime": 1726869864,
        "size": 1422,
        "isFile": true,
        "extension": ".properties"
    },
    {
        "name": "banned-players.json",
        "modifyTime": 1726869870,
        "size": 2,
        "isFile": true,
        "extension": ".json"
    },
    {
        "name": "help.yml",
        "modifyTime": 1726673223,
        "isFile": true,
        "extension": ".yml"
    },
    {
        "name": "bukkit.yml",
        "modifyTime": 1726869869,
        "size": 697,
        "isFile": true,
        "extension": ".yml"
    },
    {
        "name": "world_the_end",
        "isFile": false
    },
    {
        "name": "ops.json",
        "modifyTime": 1726869870,
        "size": 2,
        "isFile": true,
        "extension": ".json"
    },
    {
        "name": "cache",
        "isFile": false
    },
    {
        "name": "permissions.yml",
        "modifyTime": 1726673230,
        "isFile": true,
        "extension": ".yml"
    },
    {
        "name": "config",
        "isFile": false
    },
    {
        "name": "spigot.yml",
        "modifyTime": 1726869871,
        "size": 4920,
        "isFile": true,
        "extension": ".yml"
    },
    {
        "name": "libraries",
        "isFile": false
    },
    {
        "name": "server.jar",
        "modifyTime": 1726585988,
        "size": 49326293,
        "isFile": true,
        "extension": ".jar"
    },
    {
        "name": "whitelist.json",
        "modifyTime": 1726673230,
        "size": 2,
        "isFile": true,
        "extension": ".json"
    },
    {
        "name": "banned-ips.json",
        "modifyTime": 1726869870,
        "size": 2,
        "isFile": true,
        "extension": ".json"
    },
    {
        "name": "eula.txt",
        "modifyTime": 1726673186,
        "size": 9,
        "isFile": true,
        "extension": ".txt"
    },
    {
        "name": "world_nether",
        "isFile": false
    },
    {
        "name": "commands.yml",
        "modifyTime": 1726869869,
        "size": 104,
        "isFile": true,
        "extension": ".yml"
    }
];

const files = filesUnsorted.sort(sortFiles);

function sortFiles(a: ServerFile, b: ServerFile) {
    if (a.isFile && !b.isFile) {
        return 1;
    }

    if (!a.isFile && b.isFile) {
        return -1;
    }

    if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
    }

    return 1;
}

export default function FilesScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <FlashList
            data={files}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => <FileItem file={item} />}
            estimatedItemSize={58}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
}