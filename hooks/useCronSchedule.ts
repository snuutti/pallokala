import { useMemo } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import cronstrue from "cronstrue";

export default function useCronSchedule(cronSchedule: string) {
    const timeFormat = useSettingsStore(state => state.timeFormat);

    return useMemo(() => {
        try {
            return cronstrue.toString(cronSchedule, {
                verbose: true,
                // Couldn't figure out an easy way to determine based on selected language,
                // so just have the user manually select their preference
                use24HourTimeFormat: timeFormat !== "12h"
            });
        } catch {
            return undefined;
        }
    }, [cronSchedule, timeFormat]);
}