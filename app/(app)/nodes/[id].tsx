import { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import NodeOptions, { NodeDefaultValues, NodeSchema, NodeSchemaType } from "@/components/nodes/NodeOptions";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useModal } from "@/context/ModalProvider";
import useToast from "@/hooks/useToast";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";
import { Node, NodeFeatures } from "pufferpanel";

export default function NodeScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                marginBottom: 10,
                color: colors.text,
                fontSize: 16
            },
            text: {
                flexShrink: 1,
                color: colors.text
            },
            statusLoading: {
                marginBottom: 10
            },
            statusContainer: {
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10
            },
            statusIcon: {
                marginRight: 5
            },
            features: {
                marginBottom: 10
            },
            feature: {
                flexDirection: "row"
            },
            featureName: {
                flex: 1,
                color: colors.text,
                fontWeight: "bold"
            }
        })
    );
    const { apiClient } = useApiClient();
    const { createAlertModal } = useModal();
    const { showSuccessAlert } = useToast();
    const { created } = useLocalSearchParams<{ created?: string }>();
    const modifyNode = useBoundStore(state => state.modifyNode);
    const removeNode = useBoundStore(state => state.removeNode);
    const { id } = useLocalSearchParams<{ id: string }>();
    const { control, handleSubmit, setValue, getValues, watch, formState: { errors, isValid } } = useForm<NodeSchemaType>({
        defaultValues: NodeDefaultValues,
        resolver: zodResolver(NodeSchema),
        mode: "onBlur"
    });
    const [node, setNode] = useState<Node | null>(null);
    const [features, setFeatures] = useState<NodeFeatures | null>(null);
    const [environmentNames, setEnvironmentNames] = useState<string[]>([]);
    const [featuresFetched, setFeaturesFetched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id === undefined || node?.id === Number(id)) {
            return;
        }

        setNode(null);
        setFeatures(null);
        setEnvironmentNames([]);
        setFeaturesFetched(false);
        setLoading(false);

        apiClient?.node.get(Number(id)).then((node) => {
            setValue("name", node.name || NodeDefaultValues.name);
            setValue("publicHost", node.publicHost || NodeDefaultValues.publicHost);
            setValue("publicPort", node.publicPort || NodeDefaultValues.publicPort);
            setValue("private.withPrivateHost", !(node.publicHost === node.privateHost && node.publicPort === node.privatePort));
            setValue("private.privateHost", node.privateHost || NodeDefaultValues.private.privateHost);
            setValue("private.privatePort", node.privatePort || NodeDefaultValues.private.privatePort);
            setValue("sftpPort", node.sftpPort || NodeDefaultValues.sftpPort);
            setNode(node);

            modifyNode(Number(id), {
                name: node.name || NodeDefaultValues.name,
                publicHost: node.publicHost || NodeDefaultValues.publicHost,
                publicPort: node.publicPort || NodeDefaultValues.publicPort,
                privateHost: node.privateHost || NodeDefaultValues.private.privateHost,
                privatePort: node.privatePort || NodeDefaultValues.private.privatePort,
                sftpPort: node.sftpPort || NodeDefaultValues.sftpPort
            });

            if (created) {
                deployNode();
            }

            apiClient?.node.features(Number(id))
                .then((features) => {
                    setFeatures(features);
                    setEnvironmentNames([...new Set(features.environments
                        .map(env => env === "standard" || env === "tty" ? "host" : env))]
                        .map(env => t(`env:${env}.name`)));
                })
                .finally(() => setFeaturesFetched(true));
        });
    }, [id, created]);

    const deployNode = useCallback(() => {
        router.push(`/(modal)/deploynode?id=${id}&port=${getValues("private.privatePort")}&sftp=${getValues("sftpPort")}`);
    }, [id, getValues]);

    const updateNode = async (data: NodeSchemaType) => {
        setLoading(true);

        const node = {
            name: data.name,
            publicHost: data.publicHost,
            publicPort: data.publicPort,
            privateHost: data.publicHost,
            privatePort: data.publicPort,
            sftpPort: data.sftpPort
        };

        if (data.private.withPrivateHost) {
            node.privateHost = data.private.privateHost;
            node.privatePort = data.private.privatePort;
        }

        try {
            await apiClient?.node.update(Number(id), node as Node);
            modifyNode(Number(id), node);

            showSuccessAlert(t("nodes:Updated"));
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = () => {
        createAlertModal(
            t("nodes:Delete"),
            t("nodes:ConfirmDelete", { name: node?.name }),
            [
                {
                    text: t("nodes:Delete"),
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteNode
                },
                {
                    text: t("common:Cancel"),
                    icon: "close"
                }
            ]
        );
    };

    const deleteNode = async () => {
        setLoading(true);
        await apiClient?.node.delete(Number(id));
        removeNode(Number(id));
        showSuccessAlert(t("nodes:Deleted"));
        router.back();
    };

    if (!node || node.id !== Number(id)) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.header}>{node.name}</Text>

            {!featuresFetched && (
                <ActivityIndicator size="large" color={colors.primary} style={style.statusLoading} />
            )}

            {(featuresFetched && features === null) && (
                <View style={style.statusContainer}>
                    <MaterialCommunityIcons name="stop-circle" size={20} color={colors.error} style={style.statusIcon} />
                    <Text style={style.text}>{t("nodes:Unreachable")}</Text>
                </View>
            )}

            {(featuresFetched && features) && (
                <View>
                    <View style={style.statusContainer}>
                        <MaterialCommunityIcons name="play-circle" size={20} color={colors.primary} style={style.statusIcon} />
                        <Text style={style.text}>{t("nodes:Reachable")}</Text>
                    </View>

                    <View style={style.features}>
                        <View style={style.feature}>
                            <Text style={style.featureName}>{t("nodes:features.os.label")}</Text>
                            <Text style={style.text}>{t(`nodes:features.os.${features.os}`)}</Text>
                        </View>

                        <View style={style.feature}>
                            <Text style={style.featureName}>{t("nodes:features.arch.label")}</Text>
                            <Text style={style.text}>{t(`nodes:features.arch.${features.arch}`)}</Text>
                        </View>

                        <View style={style.feature}>
                            <Text style={style.featureName}>{t("nodes:features.envs")}</Text>
                            <Text style={style.text}>{environmentNames.join(", ")}</Text>
                        </View>

                        <View style={style.feature}>
                            <Text style={style.featureName}>{t("env:docker.name")}</Text>
                            <Text style={style.text}>{t(`nodes:features.docker.${features.features.includes("docker")}`)}</Text>
                        </View>
                    </View>
                </View>
            )}

            <Text style={style.header}>{t("nodes:Edit")}</Text>

            {(id !== undefined && Number(id) !== 0) ? (
                <>
                    <NodeOptions
                        control={control}
                        errors={errors}
                        editable={!loading}
                        withPrivateHost={watch("private.withPrivateHost")!}
                    />

                    {apiClient?.auth.hasScope("nodes.edit") && (
                        <Button
                            text={t("nodes:Update")}
                            icon="content-save"
                            onPress={handleSubmit(updateNode)}
                            disabled={loading || !isValid}
                        />
                    )}

                    {apiClient?.auth.hasScope("nodes.delete") && (
                        <Button
                            text={t("nodes:Delete")}
                            style="danger"
                            icon="trash-can"
                            onPress={deleteAlert}
                            disabled={loading}
                        />
                    )}

                    {apiClient?.auth.hasScope("nodes.deploy") && (
                        <Button
                            text={t("nodes:Deploy")}
                            style="neutral"
                            icon="rocket-launch"
                            onPress={deployNode}
                            disabled={loading}
                        />
                    )}
                </>
            ) : (
                <Text style={style.text}>{t("nodes:LocalNodeEdit")}</Text>
            )}
        </ContentWrapper>
    );
}