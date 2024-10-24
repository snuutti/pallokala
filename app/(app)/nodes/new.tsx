import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import NodeOptions, { NodeDefaultValues, NodeSchema, NodeSchemaType } from "@/components/nodes/NodeOptions";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { Node } from "pufferpanel";

export default function NewNodeScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { control, handleSubmit, watch, reset, formState: { errors, isValid } } = useForm<NodeSchemaType>({
        defaultValues: NodeDefaultValues,
        resolver: zodResolver(NodeSchema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(false);

    const createNode = async (data: NodeSchemaType) => {
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
            const id = await apiClient?.node.create(node as Node);
            reset();

            showSuccess("Node created successfully");
            router.push(`./${id}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <NodeOptions
                    control={control}
                    errors={errors}
                    editable={!loading}
                    withPrivateHost={watch("private.withPrivateHost")!}
                />

                <Button
                    text="Create Node"
                    icon="content-save"
                    onPress={handleSubmit(createNode)}
                    disabled={loading || !isValid}
                />
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