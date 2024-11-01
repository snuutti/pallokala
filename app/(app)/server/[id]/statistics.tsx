import { useState, useEffect, useCallback } from "react";
import { View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { CurveType } from "gifted-charts-core";
import { useServer } from "@/context/ServerProvider";
import { lineDataItem } from "gifted-charts-core/dist/LineChart/types";
import { ServerStats } from "pufferpanel";

export default function StatisticsScreen() {
    const { width } = useWindowDimensions();
    const { server } = useServer();
    const [unbindEvent, setUnbindEvent] = useState<(() => void) | undefined>(undefined);
    const [task, setTask] = useState<NodeJS.Timeout | undefined>(undefined);
    const [cpu, setCpu] = useState<lineDataItem[]>([]);
    const [memory, setMemory] = useState<lineDataItem[]>([]);
    const [jvmHeapUsed, setJvmHeapUsed] = useState<lineDataItem[]>([]);
    const [jvmHeapAlloc, setJvmHeapAlloc] = useState<lineDataItem[]>([]);
    const [jvmMetaUsed, setJvmMetaUsed] = useState<lineDataItem[]>([]);
    const [jvmMetaAlloc, setJvmMetaAlloc] = useState<lineDataItem[]>([]);

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

        const updateGraph = (prevData: lineDataItem[], value: number) => {
            const newData = [...prevData, { label: time.toString(), value }];
            if (newData.length > 60) {
                newData.shift();
            }

            return newData;
        };

        setCpu(prevCpu => updateGraph(prevCpu, data.cpu));
        setMemory(prevMemory => updateGraph(prevMemory, data.memory));

        if (data.jvm) {
            setJvmHeapUsed(prevJvmHeapUsed => updateGraph(prevJvmHeapUsed, data.jvm!.heapUsed));
            setJvmHeapAlloc(prevJvmHeapAlloc => updateGraph(prevJvmHeapAlloc, data.jvm!.heapTotal - data.jvm!.heapUsed));
            setJvmMetaUsed(prevJvmMetaUsed => updateGraph(prevJvmMetaUsed, data.jvm!.metaspaceUsed));
            setJvmMetaAlloc(prevJvmMetaAlloc => updateGraph(prevJvmMetaAlloc, data.jvm!.metaspaceTotal - data.jvm!.metaspaceUsed));
        }
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
            <LineChart
                areaChart={true}
                data={cpu}
                width={width - 60}
                hideDataPoints={true}
                xAxisThickness={0}
                yAxisThickness={0}
                color="#07a7e3"
                startFillColor="#07a7e320"
                endFillColor="#07a7e320"
                startOpacity={0.3}
                endOpacity={0.3}
                rulesType="solid"
                rulesColor="gray"
                yAxisLabelSuffix="%"
                rotateLabel={true}
                initialSpacing={0}
                noOfSections={8}
                thickness={5}
                curved={true}
                curveType={CurveType.QUADRATIC}
            />

            <LineChart
                areaChart={true}
                data={memory}
                data2={jvmHeapAlloc}
                data3={jvmHeapUsed}
                data4={jvmMetaAlloc}
                data5={jvmMetaUsed}
                width={width - 60}
                hideDataPoints={true}
                xAxisThickness={0}
                yAxisThickness={0}
                color1="#07a7e3"
                startFillColor1="#07a7e320"
                endFillColor1="#07a7e320"
                color2="#ff8f00"
                startFillColor2="#ff8f0020"
                endFillColor2="#ff8f0020"
                color3="#ffb300"
                startFillColor3="#ffb30020"
                endFillColor3="#ffb30020"
                color4="#9f5cb0"
                startFillColor4="#9f5cb020"
                endFillColor4="#9f5cb020"
                color5="#b982c7"
                startFillColor5="#b982c720"
                endFillColor5="#b982c720"
                startOpacity={0.3}
                endOpacity={0.3}
                rulesType="solid"
                rulesColor="gray"
                rotateLabel={true}
                initialSpacing={0}
                noOfSections={8}
                thickness={5}
                maxValue={1024 * 1024 * 1024}
                curved={true}
                curveType={CurveType.QUADRATIC}
            />
        </View>
    );
}