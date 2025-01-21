import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import StepProgress from "@/components/ui/StepProgress";
import Environment from "@/components/server/creation/Environment";
import SelectTemplate from "@/components/server/creation/SelectTemplate";
import Settings from "@/components/server/creation/Settings";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import useBackHandler from "@/hooks/useBackHandler";
import { useBoundStore } from "@/stores/useBoundStore";
import { Template, ServerSettings, MetadataType, ServerCreation, ServerData } from "pufferpanel";

export default function CreateServerScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            missingPermissions: {
                color: colors.text,
                fontSize: 16,
                textAlign: "center"
            }
        })
    );
    const { apiClient } = useApiClient();
    const addServer = useBoundStore(state => state.addServer);
    const [step, setStep] = useState<"environment" | "template" | "settings">("environment");
    const [name, setName] = useState("");
    const [node, setNode] = useState(0);
    const [os, setOs] = useState("");
    const [arch, setArch] = useState("");
    const [environment, setEnvironment] = useState("");
    const [users, setUsers] = useState<string[]>([]);
    const [template, setTemplate] = useState<Template | null>(null);

    useBackHandler(() => {
        if (step === "template") {
            setStep("environment");
            return true;
        }

        if (step === "settings") {
            setStep("template");
            return true;
        }

        return false;
    });

    const environmentNext = (name: string, node: number, os: string, arch: string, environment: string, users: string[]) => {
        setName(name);
        setNode(node);
        setOs(os);
        setArch(arch);
        setEnvironment(environment);
        setUsers(users);
        setStep("template");
    };

    const templateNext = (template: Template) => {
        setTemplate(template);
        setStep("settings");
    };

    const createServer = async (settings: ServerSettings, environment: MetadataType) => {
        const request: ServerCreation = {
            ...template!,
            name: name,
            node: node,
            environment: environment,
            users: users,
            data: {}
        };

        for (const key in settings.data) {
            request.data![key] = settings.data[key];

            if (settings.data[key].type === "boolean") {
                request.data![key].value = settings.data[key].value !== "false" && settings.data[key].value !== false;
            }

            if (settings.data[key].type === "integer") {
                request.data![key].value = Number(settings.data[key].value);
            }
        }

        const id = await apiClient?.server.create(request);

        const data = await apiClient?.server.get(id!, false) as ServerData;
        addServer({ ...data.server, online: "offline" });

        router.dismissTo(`/(app)/server/${id}`);
    };

    if (!apiClient?.auth.hasScope("nodes.view") || !apiClient?.auth.hasScope("templates.view")) {
        return (
            <ContentWrapper>
                <Text style={style.missingPermissions}>{t("servers:CreateMissingPermissions")}</Text>
            </ContentWrapper>
        );
    }

    return (
        <ContentWrapper>
            <StepProgress
                steps={["cube", "file-code", "cog"]}
                current={step === "environment" ? 0 : step === "template" ? 1 : 2}
            />

            {step === "environment" && (
                <Environment next={environmentNext} />
            )}

            {step === "template" && (
                <SelectTemplate
                    env={environment}
                    os={os}
                    arch={arch}
                    next={templateNext}
                    back={() => setStep("environment")}
                />
            )}

            {step === "settings" && (
                <Settings
                    template={template!}
                    environment={environment}
                    createServer={createServer}
                    back={() => setStep("template")}
                />
            )}
        </ContentWrapper>
    );
}