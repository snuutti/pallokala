import { useMemo } from "react";

const useFilePermissions = (mode: number): string => {
    return useMemo(() => {
        const octal = (mode & 0o777).toString(8).padStart(3, "0");

        const permissionMap: { [key: string]: string } = {
            "0": "---",
            "1": "--x",
            "2": "-w-",
            "3": "-wx",
            "4": "r--",
            "5": "r-x",
            "6": "rw-",
            "7": "rwx",
        };

        const humanReadable = octal
            .split("")
            .map((digit) => permissionMap[digit] || "---")
            .join("");

        const fileType = (mode & 0o170000) === 0o100000 ? "-" : "d";

        return `${fileType}${humanReadable}`;
    }, [mode]);
};

export default useFilePermissions;