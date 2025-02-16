import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ProgressBar from "@/components/ui/ProgressBar";
import { useServer } from "@/context/ServerProvider";
import { useStyle } from "@/hooks/useStyle";

export default function Query() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            player: {
                color: colors.text
            }
        })
    );
    const { server } = useServer();
    const [task, setTask] = useState<NodeJS.Timeout | undefined>(undefined);
    const [data, setData] = useState<any | undefined>(undefined);

    useEffect(() => {
        if (server === undefined) {
            return;
        }

        server.canQuery()
            .then((canQuery) => {
                if (!canQuery) {
                    return;
                }

                setTask(server.startTask(async () => {
                    setData(await server.getQuery());
                }, 30000));
            });

        return () => {
            task && server.stopTask(task);
        };
    }, [server]);

    if (!data || !data.minecraft) {
        return null;
    }

    return (
        <>
            <ProgressBar
                max={data.minecraft.maxPlayers}
                value={data.minecraft.numPlayers}
                text={t("servers:NumPlayersOnline", { current: data.minecraft.numPlayers, max: data.minecraft.maxPlayers })}
            />

            {(data.minecraft.players || []).map((player: string, index: number) => (
                <Text style={style.player} key={index}>{player}</Text>
            ))}
        </>
    );
}