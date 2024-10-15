import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { Node } from "pufferpanel";

export default function NewNodeScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const [name, setName] = useState("");
    const [publicHost, setPublicHost] = useState("");
    const [publicPort, setPublicPort] = useState(8080);
    const [privateHost, setPrivateHost] = useState("");
    const [privatePort, setPrivatePort] = useState(8080);
    const [sftpPort, setSftpPort] = useState(5657);
    const [withPrivateHost, setWithPrivateHost] = useState(false);
    const [loading, setLoading] = useState(false);

    const createNode = async () => {
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
            const id = await apiClient?.node.create(node as Node);

            setName("");
            setPublicHost("");
            setPublicPort(8080);
            setPrivateHost("");
            setPrivatePort(8080);
            setSftpPort(5657);
            setWithPrivateHost(false);

            showSuccess("Node created successfully");
            router.push(`./${id}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
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

                <Button text="Create Node" icon="content-save" onPress={createNode} disabled={loading} />
            </View>
        </ScrollView>
    );
}

function styling() {
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
        }
    });
}