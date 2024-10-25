import { useState, useEffect, Fragment } from "react";
import { Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

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
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [permissions, setPermissions] = useState<string[] | null>(null);

    useEffect(() => {
        setPermissions(null);

        if (id === undefined) {
            return;
        }

        apiClient?.user.getPermissions(Number(id)).then(setPermissions);
    }, [id]);

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
        showSuccess("User permissions have been updated.");
    };

    if (!permissions) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            {Object.entries(scopes).map(([categoryName, scopes]) => (
                <Fragment key={categoryName}>
                    <Text style={style.header}>{categoryName}</Text>
                    {scopes.map(scope => (
                        <Switch
                            key={scope}
                            label={scope}
                            value={permissions.includes(scope)}
                            onValueChange={() => togglePermission(scope)}
                            disabled={permissionDisabled(scope)}
                        />
                    ))}
                </Fragment>
            ))}

            {apiClient?.auth.hasScope("user.perms.edit") && (
                <Button
                    text="Update User Permissions"
                    icon="content-save"
                    onPress={updatePermissions}
                />
            )}
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        header: {
            color: colors.text,
            fontSize: 16
        }
    });
}