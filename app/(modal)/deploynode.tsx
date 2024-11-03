import { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { NodeDeployment } from "pufferpanel";

export default function DeployNodeScreen() {
    const { t } = useTranslation();
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { activeAccount } = useAccount();
    const { id, port, sftp } = useLocalSearchParams<{ id: string, port: string, sftp: string }>();
    const [deploymentData, setDeploymentData] = useState<NodeDeployment | null>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient?.node.deployment(Number(id)).then((data) => {
            setDeploymentData(data);
            setLoading(false);
        });
    }, []);

    const getDeployConfig = () => {
        const config = {
            logs: "/var/log/pufferpanel",
            web: {
                host: `0.0.0.0:${port}`
            },
            token: {
                public: activeAccount!.serverAddress + "/auth/publickey"
            },
            panel: {
                enable: false
            },
            daemon: {
                auth: {
                    url: activeAccount!.serverAddress + "/oauth2/token",
                    ...deploymentData
                },
                data: {
                    root: "/var/lib/pufferpanel"
                },
                sftp: {
                    host: `0.0.0.0:${sftp}`
                }
            }
        };

        return JSON.stringify(config, undefined, 2);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.text}>{t(`nodes:deploy.Step${step}`, { config: getDeployConfig() })}</Text>

            {step < 5 ? (
                <Button
                    text={t("common:Next")}
                    onPress={() => setStep(step + 1)}
                />
            ) : (
                <Button
                    text={t("common:Close")}
                    onPress={() => router.back()}
                />
            )}
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        text: {
            color: colors.text
        }
    });
}