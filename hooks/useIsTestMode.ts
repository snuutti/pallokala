import { useMemo } from "react";
import { useAccount } from "@/context/AccountProvider";

export default function isTestMode() {
    const { activeAccount } = useAccount();

    return useMemo(() => {
        return activeAccount?.serverAddress === "http://pallokala.test";
    }, [activeAccount]);
}