import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import ContentWrapper from "@/components/screen/ContentWrapper";
import NodeOptions, { NodeDefaultValues, NodeSchema, NodeSchemaType } from "@/components/nodes/NodeOptions";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { Node } from "pufferpanel";

export default function NewNodeScreen() {
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
        <ContentWrapper>
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
        </ContentWrapper>
    );
}