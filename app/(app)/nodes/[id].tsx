import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
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
    const { style, colors } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { control, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<NodeSchemaType>({
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
            showSuccess("Node updated successfully");
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
        showSuccess("Node deleted successfully");
        router.back();
    };

    const deployNode = () => {
        // TODO
    };

    if (!node) {
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
                    <Text style={style.text}>This node is either not set up correctly or currently unavailable</Text>
                </View>
            )}

            {(featuresFetched && features) && (
                <View>
                    <View style={style.statusContainer}>
                        <MaterialCommunityIcons name="play-circle" size={20} color={colors.primary} style={style.statusIcon} />
                        <Text style={style.text}>This node is correctly set up and running</Text>
                    </View>

                    <View style={style.features}>
                        <View style={style.feature}>
                            <Text style={style.featureName}>Operating System</Text>
                            <Text style={style.text}>{features.os}</Text>
                        </View>

                        <View style={style.feature}>
                            <Text style={style.featureName}>CPU Architecture</Text>
                            <Text style={style.text}>{features.arch}</Text>
                        </View>

                        <View style={style.feature}>
                            <Text style={style.featureName}>Available Environments</Text>
                            <Text style={style.text}>{features.environments.join(", ")}</Text>
                        </View>

                        <View style={style.feature}>
                            <Text style={style.featureName}>Docker</Text>
                            <Text style={style.text}>Docker {features.features.includes("docker") ? "available" : "unavailable"}</Text>
                        </View>
                    </View>
                </View>
            )}

            <Text style={style.header}>Edit Node</Text>

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
                            text="Update Node"
                            icon="content-save"
                            onPress={handleSubmit(updateNode)}
                            disabled={loading || !isValid}
                        />
                    )}

                    {apiClient?.auth.hasScope("nodes.delete") && (
                        <Button
                            text="Delete Node"
                            style="danger"
                            icon="trash-can"
                            onPress={deleteAlert}
                            disabled={loading}
                        />
                    )}

                    {apiClient?.auth.hasScope("nodes.deploy") && (
                        <Button
                            text="Deploy Node"
                            style="neutral"
                            onPress={deployNode}
                            disabled={loading}
                        />
                    )}
                </>
            ) : (
                <Text style={style.text}>
                    The local node does not have any editable settings

                    To change the host displayed with servers hosted on this node adjust the panels master url in the panel settings
                </Text>
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