import { useState, useEffect } from "react";
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
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { Node, NodeFeatures } from "pufferpanel";

export default function NodeScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { control, handleSubmit, setValue, getValues, watch, formState: { errors, isValid } } = useForm<NodeSchemaType>({
        defaultValues: NodeDefaultValues,
        resolver: zodResolver(NodeSchema),
        mode: "onBlur"
    });
    const [node, setNode] = useState<Node | null>(null);
    const [features, setFeatures] = useState<NodeFeatures | null>(null);
    const [featuresFetched, setFeaturesFetched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNode(null);
        setFeatures(null);
        setFeaturesFetched(false);

        if (id === undefined) {
            return;
        }

        apiClient?.node.get(Number(id)).then((node) => {
            setValue("name", node.name || NodeDefaultValues.name);
            setValue("publicHost", node.publicHost || NodeDefaultValues.publicHost);
            setValue("publicPort", node.publicPort || NodeDefaultValues.publicPort);
            setValue("private.withPrivateHost", !(node.publicHost === node.privateHost && node.publicPort === node.privatePort));
            setValue("private.privateHost", node.privateHost || NodeDefaultValues.private.privateHost);
            setValue("private.privatePort", node.privatePort || NodeDefaultValues.private.privatePort);
            setValue("sftpPort", node.sftpPort || NodeDefaultValues.sftpPort);
            setNode(node);

            apiClient?.node.features(Number(id))
                .then(setFeatures)
                .finally(() => setFeaturesFetched(true));
        });
    }, [id]);

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
            showSuccess(t("nodes:Updated"));
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = () => {
        createAlertModal(
            "Delete Node",
            `Are you sure you want to delete ${node?.name}?`,
            [
                {
                    text: "Delete",
                    icon: "trash-can",
                    style: "danger",
                    onPress: deleteNode
                },
                { text: "Cancel" }
            ]
        );
    };

    const deleteNode = async () => {
        setLoading(true);
        await apiClient?.node.delete(Number(id));
        showSuccess(t("nodes:Deleted"));
        router.back();
    };

    const deployNode = () => {
        router.push(`/(modal)/deploynode?id=${id}&port=${getValues("private.privatePort")}&sftp=${getValues("sftpPort")}`);
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
                            <Text style={style.text}>{features.environments.join(", ")}</Text>
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

function styling(colors: Colors) {
    return StyleSheet.create({
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
    });
}