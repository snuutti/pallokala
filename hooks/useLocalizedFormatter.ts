import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createFileSizeFormatter, createDateTimeFormatter, createDateFormatter } from "@/utils/formatters";
import { useSettingsStore } from "@/stores/useSettingsStore";

export default function useLocalizedFormatter() {
    const { i18n } = useTranslation();
    const timeFormat = useSettingsStore(state => state.timeFormat);

    const formatFileSize = useMemo(() => {
        return createFileSizeFormatter(i18n.language);
    }, [i18n.language]);

    const formatDateTime = useMemo(() => {
        return createDateTimeFormatter(i18n.language, timeFormat);
    }, [i18n.language, timeFormat]);

    const formatDate = useMemo(() => {
        return createDateFormatter(i18n.language);
    }, [i18n.language]);

    return {
        formatFileSize,
        formatDateTime,
        formatDate
    };
};