import { TimeFormat } from "@/stores/useSettingsStore";

export const createFileSizeFormatter = (locale: string) => {
    let numFormat: Intl.NumberFormat;

    const options: Intl.NumberFormatOptions = {
        maximumFractionDigits: 2
    };

    try {
        numFormat = new Intl.NumberFormat([locale.replaceAll("_", "-"), "en-GB"], options);
    } catch {
        numFormat = new Intl.NumberFormat("en-GB", options);
    }

    return (size: number | undefined): string => {
        if (!size) {
            return "0 B";
        }

        if (size < Math.pow(2, 10)) {
            return numFormat.format(size) + " B";
        }

        if (size < Math.pow(2, 20)) {
            return numFormat.format(size / Math.pow(2, 10)) + " KiB";
        }

        if (size < Math.pow(2, 30)) {
            return numFormat.format(size / Math.pow(2, 20)) + " MiB";
        }

        if (size < Math.pow(2, 40)) {
            return numFormat.format(size / Math.pow(2, 30)) + " GiB";
        }

        return numFormat.format(size / Math.pow(2, 40)) + " TiB";
    };
};

export const createDateTimeFormatter = (locale: string, format: TimeFormat) => {
    let dateTimeFormat: Intl.DateTimeFormat;

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: format === "locale" ? undefined : format === "12h"
    };

    try {
        dateTimeFormat = new Intl.DateTimeFormat([locale.replaceAll("_", "-"), "en-GB"], options);
    } catch {
        dateTimeFormat = new Intl.DateTimeFormat("en-GB", options);
    }

    return (timestamp: number): string => {
        const date = new Date(timestamp * (timestamp < 1e12 ? 1000 : 1));
        return dateTimeFormat.format(date);
    };
};

export const createDateFormatter = (locale: string) => {
    let dateFormat: Intl.DateTimeFormat;

    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    try {
        dateFormat = new Intl.DateTimeFormat([locale.replaceAll("_", "-"), "en-GB"], options);
    } catch {
        dateFormat = new Intl.DateTimeFormat("en-GB", options);
    }

    return (timestamp: number | Date): string => {
        let date: Date;
        if (timestamp instanceof Date) {
            date = timestamp;
        } else {
            date = new Date(timestamp * (timestamp < 1e12 ? 1000 : 1));
        }

        return dateFormat.format(date);
    };
};