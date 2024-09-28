import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { CurveType } from "gifted-charts-core";

type StatisticsData = {
    cpu: number;
    memory: number;
    jvm: {
        heapUsed: number;
        heapTotal: number;
        metaspaceUsed: number;
        metaspaceTotal: number;
    };
};

const rawData: StatisticsData[] = [
    {
        "cpu": 5.996077701881978,
        "memory": 0,
        "jvm": {
            "heapUsed": 579869696,
            "heapTotal": 644874240,
            "metaspaceUsed": 122138624,
            "metaspaceTotal": 123207680
        }
    },
    {
        "cpu": 3.8385545081628054,
        "memory": 0,
        "jvm": {
            "heapUsed": 0,
            "heapTotal": 0,
            "metaspaceUsed": 122142720,
            "metaspaceTotal": 123207680
        }
    },
    {
        "cpu": 3.8385545081628054,
        "memory": 0,
        "jvm": {
            "heapUsed": 0,
            "heapTotal": 0,
            "metaspaceUsed": 122142720,
            "metaspaceTotal": 123207680
        }
    },
    {
        "cpu": 5.913903289911763,
        "memory": 0,
        "jvm": {
            "heapUsed": 0,
            "heapTotal": 0,
            "metaspaceUsed": 122148864,
            "metaspaceTotal": 123273216
        }
    },
    {
        "cpu": 5.913903289911763,
        "memory": 0,
        "jvm": {
            "heapUsed": 0,
            "heapTotal": 0,
            "metaspaceUsed": 122148864,
            "metaspaceTotal": 123273216
        }
    },
    {
        "cpu": 4.092731023711997,
        "memory": 0,
        "jvm": {
            "heapUsed": 0,
            "heapTotal": 0,
            "metaspaceUsed": 122148864,
            "metaspaceTotal": 123273216
        }
    },
    {
        "cpu": 69.092731023711997,
        "memory": 1,
        "jvm": {
            "heapUsed": 0,
            "heapTotal": 0,
            "metaspaceUsed": 122148864,
            "metaspaceTotal": 123273216
        }
    }
];

const data1 = rawData.map((data, index) => ({
    value: data.cpu,
    label: `1:38:${index} AM`
}));

const data2 = rawData.map((data, index) => ({
    value: data.memory,
    label: `1:38:${index} AM`
}));

export default function StatisticsScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
            <LineChart
                data={data1}
                data2={data2}
                hideDataPoints={true}
                xAxisThickness={0}
                yAxisThickness={0}
                color1="#0C95C8"
                color2="#583628"
                thickness={5}
                curved={true}
                curveType={CurveType.QUADRATIC}
                isAnimated={true}
                animateOnDataChange={true}
                animationDuration={1000}
                onDataChangeAnimationDuration={300}
            />
        </View>
    );
}