import { useState, useEffect } from "react";
import { useApiClient } from "@/context/ApiClientProvider";
import { isVersionSatisfied } from "@/utils/version";

export default function useVersionCheck(requiredVersion: string, callback?: () => void): boolean {
    const { version } = useApiClient();
    const [isSatisfied, setIsSatisfied] = useState(false);

    useEffect(() => {
        if (!version) {
            return;
        }

        const versionSatisfied = isVersionSatisfied(version, requiredVersion);
        if (versionSatisfied) {
            callback?.();
        }

        setIsSatisfied(versionSatisfied);
    }, [version, requiredVersion, callback]);

    return isSatisfied;
}