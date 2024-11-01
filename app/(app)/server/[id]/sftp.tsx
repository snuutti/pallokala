import { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Copyable from "@/components/ui/Copyable";
import { useServer } from "@/context/ServerProvider";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export default function SFTPScreen() {
    const { style } = useStyle(styling);
    const { server } = useServer();
    const { user } = useAccount();

    const host = useMemo(() => {
        let host = server?.node.publicHost !== "127.0.0.1" ? server?.node.publicHost : "window";
        host = host + ":" + server?.node.sftpPort;

        return host;
    }, [server]);

    const username = useMemo(() => {
        return `${user?.email}#${server?.id}`;
    }, [user, server]);

    return (
        <ContentWrapper>
            <Copyable label="Host/Port:" text={host} />
            <Copyable label="Username:" text={username} />

            <Text style={style.password}>Password: Account Password</Text>
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        password: {
            color: colors.text,
            marginVertical: 5,
            marginHorizontal: 16
        }
    });
}