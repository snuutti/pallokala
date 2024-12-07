import { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useServer } from "@/context/ServerProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";
import { UserPermissionsView } from "pufferpanel";

const perms = [
    "server.view",
    "server.admin",
    "server.delete",
    "server.definition.view",
    "server.definition.edit",
    "server.data.view",
    "server.data.edit",
    "server.data.edit.admin",
    "server.flags.view",
    "server.flags.edit",
    "server.name.edit",
    "server.users.view",
    "server.users.create",
    "server.users.edit",
    "server.users.delete",
    "server.start",
    "server.stop",
    "server.kill",
    "server.install",
    "server.files.view",
    "server.files.edit",
    "server.sftp",
    "server.console",
    "server.console.send",
    "server.stats",
    "server.status"
];

export default function EditUserScreen() {
    const { t, i18n } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            text: {
                color: colors.text,
                fontSize: 20,
                marginBottom: 5
            }
        })
    );
    const { apiClient } = useApiClient();
    const { server } = useServer();
    const { showSuccess } = useToast();
    const { email } = useLocalSearchParams<{ email: string }>();
    const [user, setUser] = useState<UserPermissionsView | null>(null);

    useEffect(() => {
        apiClient!.server.getUser(server!.id, email).then((user) => {
            setUser(user[0]);
        });
    }, [email]);

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

    const togglePermission = async (scope: string) => {
        if (!user) {
            return;
        }

        const newPerms = user.scopes.includes(scope)
            ? user.scopes.filter((s) => s !== scope)
            : [...user.scopes, scope];

        const updatedUser = {
            ...user,
            scopes: newPerms
        };

        setUser(updatedUser);
        await server?.updateUser(updatedUser);

        showSuccess(t("users:UpdateSuccess"));
    };

    const permissionDisabled = (scope: string) => {
        if (!server?.hasScope("server.users.edit")) {
            return true;
        }

        return !server?.hasScope(scope);
    };

    const deleteUser = async () => {
        if (!user) {
            return;
        }

        await server?.deleteUser(user.email);
        router.back();

        showSuccess(t("users:DeleteSuccess"));
    };

    if (!user) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Text style={style.text}>{user.username}</Text>

            {perms.map((scope) => (
                <Switch
                    key={scope}
                    label={scopeLabel(scope)}
                    description={scopeDescription(scope)}
                    value={user.scopes.includes(scope)}
                    onValueChange={() => togglePermission(scope)}
                    disabled={permissionDisabled(scope)}
                />
            ))}

            {server?.hasScope("server.users.delete") && (
                <Button
                    text={t("users:Delete")}
                    icon="trash-can"
                    style="danger"
                    onPress={deleteUser}
                />
            )}
        </ContentWrapper>
    );
}