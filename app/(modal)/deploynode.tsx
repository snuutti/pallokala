import { useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Markdown from "@/components/ui/Markdown";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import useBackHandler from "@/hooks/useBackHandler";
import { NodeDeployment } from "pufferpanel";

export default function DeployNodeScreen() {
    const { t } = useTranslation();
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

    useBackHandler(() => {
        if (step > 1) {
            setStep(step - 1);
            return true;
        }

        return false;
    });

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

    const copyConfig = async () => {
        await Clipboard.setStringAsync(getDeployConfig());
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Markdown
                text={t(`nodes:deploy.Step${step}`, { config: getDeployConfig() })}
            />

            {step === 3 && (
                <Button
                    text={t("common:Copy")}
                    style="neutral"
                    icon="content-copy"
                    onPress={copyConfig}
                />
            )}

            {step < 5 ? (
                <Button
                    text={t("common:Next")}
                    icon="chevron-right"
                    onPress={() => setStep(step + 1)}
                />
            ) : (
                <Button
                    text={t("common:Close")}
                    icon="close"
                    onPress={() => router.back()}
                />
            )}
        </ContentWrapper>
    );
}