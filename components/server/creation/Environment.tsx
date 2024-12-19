import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import FormTextInput from "@/components/ui/form/FormTextInput";
import FormMultiSelect from "@/components/ui/form/FormMultiSelect";
import FormDropdown from "@/components/ui/form/FormDropdown";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { Node, NodeFeatures } from "pufferpanel";

const schema = z.object({
    name: z.string().min(1, { message: "servers:NameInvalid" }).regex(/^[\x20-\x7e]+$/, { message: "servers:NameInvalid" }),
    users: z.string().array().min(1, { message: "servers:AtLeastOneUserRequired" }),
    node: z.number().int().nonnegative(),
    environment: z.string()
        .refine((val) => val !== "unsupported", {
            message: "servers:NoSupportedEnvironmentOnSelectedNode"
        })
        .refine((val) => val !== "fetcherror", {
            message: "servers:CannotFetchNodeEnvironments"
        })
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    name: "",
    users: [],
    node: -1
};

type EnvironmentProps = {
    next: (name: string, node: number, os: string, arch: string, environment: string, users: string[]) => void;
};

export default function Environment(props: EnvironmentProps) {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { user } = useAccount();
    const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [nodes, setNodes] = useState<Node[]>([]);
    const [nodeFeatures, setNodeFeatures] = useState<NodeFeatures | null>(null);
    const [availableEnvironments, setAvailableEnvironments] = useState<{ value: string, display: string }[]>([]);

    useEffect(() => {
        setValue("users", [user!.username!], { shouldValidate: true });

        apiClient?.node.list().then((nodes) => {
            setNodes(nodes);

            if (nodes.length === 1) {
                setValue("node", nodes[0].id, { shouldValidate: true });
                nodeChanged(nodes[0].id);
            }
        });
    }, []);

    const nodeOptions = useMemo(() => {
        return nodes.map(node => ({
            value: node.id,
            display: node.name!
        }));
    }, [nodes]);

    const nodeChanged = useCallback(async (id: number) => {
        if (id === -1) {
            return;
        }

        try {
            const nodeFeatures = await apiClient?.node.features(id);
            if (!nodeFeatures) {
                return;
            }

            nodeFeatures.environments = nodeFeatures.environments.filter(env => {
                if (env === "docker") {
                    return nodeFeatures.features.includes("docker");
                } else if (env === "tty" || env === "standard") {
                    return false;
                } else {
                    return true;
                }
            });

            const availableEnvs = nodeFeatures.environments.map(env => ({
                value: env,
                display: t(`env:${env}.name`)
            }));

            setNodeFeatures(nodeFeatures);
            setAvailableEnvironments(availableEnvs);

            if (availableEnvs.length > 0) {
                setValue("environment", availableEnvs[0].value, { shouldValidate: true });
            } else {
                setValue("environment", "unsupported", { shouldValidate: true });
            }
        } catch (e) {
            setAvailableEnvironments([]);
            setValue("environment", "fetcherror", { shouldValidate: true });
        }
    }, []);

    const fetchUsers = async (query: string) => {
        const res = await apiClient?.user.search(query);
        return res?.map(user => user.username!) ?? [];
    };

    const saveEnvironment = (data: Schema) => {
        props.next(data.name, data.node, nodeFeatures!.os, nodeFeatures!.arch, data.environment, data.users);
    };

    return (
        <>
            <FormTextInput
                control={control}
                name="name"
                placeholder={t("servers:Name")}
                error={errors.name?.message}
            />

            <FormMultiSelect
                control={control}
                name="users"
                label={t("users:Users")}
                options={fetchUsers}
                error={errors.users?.message}
            />

            <FormDropdown
                control={control}
                name="node"
                options={nodeOptions}
                label={t("nodes:Node")}
                onChange={nodeChanged}
            />

            <FormDropdown
                control={control}
                name="environment"
                options={availableEnvironments}
                label={t("servers:Environment")}
                disabled={availableEnvironments.length === 0}
                error={errors.environment?.message}
            />

            <Button
                text={t("common:Next")}
                icon="check"
                onPress={handleSubmit(saveEnvironment)}
                disabled={!isValid}
            />
        </>
    );
}