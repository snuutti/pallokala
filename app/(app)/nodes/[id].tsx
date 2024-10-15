import { useState, useEffect } from "react";
import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import LoadingScreen from "@/components/LoadingScreen";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { Node, NodeFeatures } from "pufferpanel";
import Switch from "@/components/ui/Switch";

export default function NodeScreen() {
    const { style, colors } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { createAlertModal } = useModal();
    const { id } = useGlobalSearchParams<{ id: string }>();
    const [node, setNode] = useState<Node | null>(null);
    const [features, setFeatures] = useState<NodeFeatures | null>(null);
    const [featuresFetched, setFeaturesFetched] = useState(false);
    const [name, setName] = useState("");
    const [publicHost, setPublicHost] = useState("");
    const [publicPort, setPublicPort] = useState(8080);
    const [privateHost, setPrivateHost] = useState("");
    const [privatePort, setPrivatePort] = useState(8080);
    const [sftpPort, setSftpPort] = useState(5657);
    const [withPrivateHost, setWithPrivateHost] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNode(null);
        setFeatures(null);
        setFeaturesFetched(false);

        if (id === undefined) {
            return;
        }

        apiClient?.node.get(Number(id)).then((node) => {
            setNode(node);
            setName(node.name || "");
            setPublicHost(node.publicHost || "");
            setPublicPort(node.publicPort || 8080);
            setPrivateHost(node.privateHost || "");
            setPrivatePort(node.privatePort || 8080);
            setSftpPort(node.sftpPort || 5657);
            setWithPrivateHost(!(node.publicHost === node.privateHost && node.publicPort === node.privatePort));

            apiClient?.node.features(Number(id))
                .then(setFeatures)
                .finally(() => setFeaturesFetched(true));
        });
    }, [id]);

    const updateNode = async () => {
        setLoading(true);

        const node = {
            name,
            publicHost,
            publicPort,
            privateHost: publicHost,
            privatePort: publicPort,
            sftpPort
        };

        if (withPrivateHost) {
            node.privateHost = privateHost;
            node.privatePort = privatePort;
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
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <Text style={style.header}>{name}</Text>

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
                        <TextInput
                            defaultValue={name}
                            onChangeText={setName}
                            placeholder="Name"
                            editable={!loading}
                        />

                        <TextInput
                            defaultValue={publicHost}
                            onChangeText={setPublicHost}
                            placeholder="Public Host"
                            autoCapitalize="none"
                            autoComplete="url"
                            keyboardType="url"
                            editable={!loading}
                        />

                        <TextInput
                            defaultValue={String(publicPort)}
                            onChangeText={(value) => setPublicPort(Number(value))}
                            placeholder="Public Port"
                            keyboardType="number-pad"
                            editable={!loading}
                        />

                        <Switch
                            name="Use a different host/port for server to server communication"
                            value={withPrivateHost}
                            onValueChange={setWithPrivateHost}
                            disabled={loading}
                        />

                        {withPrivateHost && (
                            <>
                                <TextInput
                                    defaultValue={privateHost}
                                    onChangeText={setPrivateHost}
                                    placeholder="Private Host"
                                    autoCapitalize="none"
                                    autoComplete="url"
                                    keyboardType="url"
                                    editable={!loading}
                                />

                                <TextInput
                                    defaultValue={String(privatePort)}
                                    onChangeText={(value) => setPrivatePort(Number(value))}
                                    placeholder="Private Port"
                                    keyboardType="number-pad"
                                    editable={!loading}
                                />
                            </>
                        )}

                        <TextInput
                            defaultValue={String(sftpPort)}
                            onChangeText={(value) => setSftpPort(Number(value))}
                            placeholder="SFTP Port"
                            keyboardType="number-pad"
                            editable={!loading}
                        />

                        {apiClient?.auth.hasScope("nodes.edit") && (
                            <Button
                                text="Update Node"
                                icon="content-save"
                                onPress={updateNode}
                                disabled={loading}
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
            </View>
        </ScrollView>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        scrollView: {
            width: "100%"
        },
        contentContainer: {
            flexGrow: 1,
            alignItems: "center"
        },
        content: {
            width: "100%",
            maxWidth: 400,
            padding: 20
        },
        header: {
            marginBottom: 10,
            color: colors.text,
            fontSize: 16
        },
        text: {
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