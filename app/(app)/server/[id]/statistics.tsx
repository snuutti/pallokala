import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { CartesianChart, Line } from "victory-native";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Query from "@/components/server/statistics/Query";
import { useFont } from "@shopify/react-native-skia";
import { useServer } from "@/context/ServerProvider";
import useLocalizedFormatter from "@/hooks/useLocalizedFormatter";
import { useStyle } from "@/hooks/useStyle";
import { ServerStats, JvmStats } from "pufferpanel";
import ubuntu from "@/assets/fonts/UbuntuMono-R.ttf";

const numFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
});

const cpuFormat = (value: number) => {
    return numFormat.format(value) + " %";
};

type MemoryDataPoint = {
    time: number;
    memory: number;
    jvmHeapUsed?: number;
    jvmHeapAlloc?: number;
    jvmMetaUsed?: number;
    jvmMetaAlloc?: number;
};

type CpuDataPoint = {
    time: number;
    value: number;
};

export default function StatisticsScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            title: {
                color: colors.text,
                fontSize: 20,
                textAlign: "center"
            },
            chart: {
                height: 300,
                marginVertical: 10
            }
        })
    );
    const { server } = useServer();
    const { formatFileSize } = useLocalizedFormatter();
    const font = useFont(ubuntu, 12);
    const [unbindEvent, setUnbindEvent] = useState<(() => void) | undefined>(undefined);
    const [task, setTask] = useState<NodeJS.Timeout | number | undefined>(undefined);
    const [cpu, setCpu] = useState<CpuDataPoint[]>([]);
    const [memory, setMemory] = useState<MemoryDataPoint[]>([]);

    useEffect(() => {
        if (server === undefined) {
            return;
        }

        server.getStats().then(addData);
        setUnbindEvent(() => server.on("stat", addData));

        setTask(server.startTask(async () => {
            if (server.needsPolling() && server.hasScope("server.stats")) {
                addData(await server.getStats());
            }
        }, 5000));

        return () => {
            unbindEvent?.();
            task && server.stopTask(task);
        };
    }, [server]);

    const addData = useCallback((data: ServerStats) => {
        const time = new Date().getTime();

        const updateCpuGraph = (prevData: CpuDataPoint[], value: number) => {
            const newData = [...prevData, { time: time, value }];
            if (newData.length > 60) {
                newData.shift();
            }

            return newData;
        };

        const updateMemoryGraph = (prevData: MemoryDataPoint[], memory: number, jvm?: JvmStats) => {
            const newDataPoint: MemoryDataPoint = { time, memory };

            if (jvm) {
                newDataPoint.jvmHeapUsed = jvm.heapUsed;
                newDataPoint.jvmHeapAlloc = jvm.heapTotal;
                newDataPoint.jvmMetaUsed = jvm.metaspaceUsed;
                newDataPoint.jvmMetaAlloc = jvm.metaspaceTotal;
            }

            const newData = [...prevData, newDataPoint];
            if (newData.length > 60) {
                newData.shift();
            }

            return newData;
        };

        setCpu(prevCpu => updateCpuGraph(prevCpu, data.cpu));
        setMemory(prevMemory => updateMemoryGraph(prevMemory, data.memory, data.jvm));
    }, []);

    return (
        <ContentWrapper>
            <Query />

            <Text style={style.title}>{t("servers:Memory")}</Text>

            <View style={style.chart}>
                <CartesianChart
                    data={memory}
                    xKey="time"
                    yKeys={["memory", "jvmHeapUsed", "jvmHeapAlloc", "jvmMetaUsed", "jvmMetaAlloc"]}
                    xAxis={{
                        lineColor: colors.textDisabled
                    }}
                    yAxis={[
                        {
                            font,
                            lineColor: colors.textDisabled,
                            labelColor: colors.text,
                            axisSide: "right",
                            formatYLabel: formatFileSize
                        }
                    ]}
                    frame={{
                        lineColor: colors.textDisabled
                    }}
                >
                    {({ points }) => (
                        <>
                            <Line
                                points={points.memory}
                                color="#07a7e3"
                                strokeWidth={3}
                                curveType="monotoneX"
                                animate={{ type: "timing", duration: 300 }}
                            />

                            <Line
                                points={points.jvmHeapAlloc}
                                color="#ff8f00"
                                strokeWidth={3}
                                curveType="monotoneX"
                                animate={{ type: "timing", duration: 300 }}
                            />

                            <Line
                                points={points.jvmHeapUsed}
                                color="#ffb300"
                                strokeWidth={3}
                                curveType="monotoneX"
                                animate={{ type: "timing", duration: 300 }}
                            />

                            <Line
                                points={points.jvmMetaAlloc}
                                color="#9f5cb0"
                                strokeWidth={3}
                                curveType="monotoneX"
                                animate={{ type: "timing", duration: 300 }}
                            />

                            <Line
                                points={points.jvmMetaUsed}
                                color="#b982c7"
                                strokeWidth={3}
                                curveType="monotoneX"
                                animate={{ type: "timing", duration: 300 }}
                            />
                        </>
                    )}
                </CartesianChart>
            </View>

            <Text style={style.title}>{t("servers:CPU")}</Text>

            <View style={style.chart}>
                <CartesianChart
                    data={cpu}
                    xKey="time"
                    yKeys={["value"]}
                    xAxis={{
                        lineColor: colors.textDisabled
                    }}
                    yAxis={[
                        {
                            font,
                            lineColor: colors.textDisabled,
                            labelColor: colors.text,
                            axisSide: "right",
                            formatYLabel: cpuFormat
                        }
                    ]}
                    frame={{
                        lineColor: colors.textDisabled
                    }}
                >
                    {({ points }) => (
                        <Line
                            points={points.value}
                            color="#07a7e3"
                            strokeWidth={3}
                            curveType="monotoneX"
                            animate={{ type: "timing", duration: 300 }}
                        />
                    )}
                </CartesianChart>
            </View>
        </ContentWrapper>
    );
}