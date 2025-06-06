import { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Copyable from "@/components/ui/Copyable";
import { useServer } from "@/context/ServerProvider";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { getSftpHost } from "@/utils/files";

export default function SFTPScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            password: {
                color: colors.text,
                marginVertical: 5,
                marginHorizontal: 16
            }
        })
    );
    const { server } = useServer();
    const { activeAccount, user } = useAccount();

    const host = useMemo(() => {
        let host = getSftpHost(server, activeAccount!);
        host = host + ":" + server?.node.sftpPort;

        return host;
    }, [server, activeAccount]);

    const username = useMemo(() => {
        return `${user?.email}#${server?.id}`;
    }, [user, server]);

    return (
        <ContentWrapper>
            <Copyable label={`${t("common:Host")}/${t("common:Port")}:`} text={host} />
            <Copyable label={t("users:Username")} text={username} />

            <Text style={style.password}>{t("users:Password")}: {t("users:AccountPassword")}</Text>
        </ContentWrapper>
    );
}