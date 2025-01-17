import { useState, useEffect, Fragment } from "react";
import { Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";

const scopes = {
    general: [
        "admin",
        "login",
        "self.edit",
        "self.clients",
        "settings.edit"
    ],
    servers: [
        "server.create"
    ],
    nodes: [
        "nodes.view",
        "nodes.create",
        "nodes.edit",
        "nodes.deploy",
        "nodes.delete"
    ],
    users: [
        "users.info.search",
        "users.info.view",
        "users.info.edit",
        "users.perms.view",
        "users.perms.edit"
    ],
    templates: [
        "templates.view",
        "templates.local.edit",
        "templates.repo.view",
        "templates.repo.add",
        "templates.repo.remove"
    ]
};

export default function PermissionScreen() {
    const { t, i18n } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            header: {
                color: colors.text,
                fontSize: 16
            }
        })
    );
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const id = useBoundStore(state => state.currentUser);
    const [permissions, setPermissions] = useState<string[] | null>(null);

    useEffect(() => {
        setPermissions(null);

        if (id === -1) {
            return;
        }

        apiClient?.user.getPermissions(Number(id)).then(setPermissions);
    }, [id]);

    const permissionCategoryHeading = (category: string) => {
        const map: Record<string, string> = {
            servers: "servers:Servers",
            nodes: "nodes:Nodes",
            users: "users:Users",
            templates: "templates:Templates"
        };

        return t(map[category]);
    };

    const scopeLabel = (scope: string) => {
        return t(`scopes:name.${scope.replace(/\./g, "-")}`);
    };

    const scopeDescription = (scope: string) => {
        const key = `scopes:hint.${scope.replace(/\./g, "-")}`;
        if (!i18n.exists(key)) {
            return undefined;
        }

        return t(key);
    };

    const togglePermission = (scope: string) => {
        if (permissions === null) {
            return;
        }

        if (!permissions.includes(scope)) {
            setPermissions([...permissions, scope]);
        } else {
            setPermissions(permissions.filter(e => e !== scope));
        }
    };

    const permissionDisabled = (scope: string) => {
        if (!apiClient?.auth.hasScope("user.perms.edit")) {
            return true;
        }

        if (scope === "admin" && apiClient?.auth.hasScope("admin")) {
            return false;
        }

        if (scope === "admin") {
            return true;
        }

        if (permissions?.includes("admin")) {
            return true;
        }

        return !apiClient?.auth.hasScope(scope);
    }

    const updatePermissions = async () => {
        await apiClient?.user.updatePermissions(Number(id), { scopes: permissions! });
        showSuccess(t("users:UpdateSuccess"));
    };

    if (!permissions) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            {Object.entries(scopes).map(([categoryName, scopes]) => (
                <Fragment key={categoryName}>
                    {categoryName !== "general" && (
                        <Text style={style.header}>{permissionCategoryHeading(categoryName)}</Text>
                    )}

                    {scopes.map(scope => (
                        <Switch
                            key={scope}
                            label={scopeLabel(scope)}
                            description={scopeDescription(scope)}
                            value={permissions.includes(scope)}
                            onValueChange={() => togglePermission(scope)}
                            disabled={permissionDisabled(scope)}
                        />
                    ))}
                </Fragment>
            ))}

            {apiClient?.auth.hasScope("user.perms.edit") && (
                <Button
                    text={t("users:UpdatePermissions")}
                    icon="content-save"
                    onPress={updatePermissions}
                />
            )}
        </ContentWrapper>
    );
}