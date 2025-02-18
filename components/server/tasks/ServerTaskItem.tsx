import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import useCronSchedule from "@/hooks/useCronSchedule";
import { useStyle } from "@/hooks/useStyle";
import { ExtendedServerTask } from "@/types/server";

type ServerTaskItemProps = {
    task: ExtendedServerTask;
};

export default function ServerTaskItem(props: ServerTaskItemProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            task: {
                padding: 15,
                flexDirection: "row",
                backgroundColor: colors.background,
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 15
            },
            infoView: {
                flexGrow: 1,
                flexShrink: 1,
                flexDirection: "column",
                justifyContent: "center"
            },
            name: {
                color: colors.text
            },
            cron: {
                color: colors.textDisabled
            },
            description: {
                color: colors.textDisabled,
                marginTop: 5
            }
        })
    );
    const schedule = useCronSchedule(props.task.cronSchedule);

    const onPress = () => {
        router.push(`/(modal)/edittask?taskId=${props.task.id}`);
    };

    return (
        <TouchableOpacity style={style.task} onPress={onPress}>
            <View style={style.infoView}>
                <Text style={style.name} numberOfLines={1}>{props.task.name}</Text>
                <Text style={style.cron}>{schedule}</Text>

                {props.task.description && (
                    <Text style={style.description}>{props.task.description}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}