import { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useServer } from "@/context/ServerProvider";
import useToast from "@/hooks/useToast";
import useVersionCheck from "@/hooks/useVersionCheck";
import { useStyle } from "@/hooks/useStyle";
import { useBoundStore } from "@/stores/useBoundStore";

const basePerms = [
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
    const { server } = useServer();
    const { showSuccessAlert } = useToast();
    const { email } = useLocalSearchParams<{ email: string }>();
    const hasBackups = useVersionCheck("3.0.0-rc.7");
    const user = useBoundStore(state => state.serverUsers[server!.id]).find((u) => u.email === email);
    const modifyServerUser = useBoundStore(state => state.modifyServerUser);
    const removeServerUser = useBoundStore(state => state.removeServerUser);
    const [perms, setPerms] = useState<string[]>([]);

    useEffect(() => {
        const perms = [...basePerms];
        if (hasBackups) {
            perms.push(
                "server.backup.view",
                "server.backup.create",
                "server.backup.restore",
                "server.backup.delete"
            );
        }

        setPerms(perms);
    }, [hasBackups, email]);

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

        modifyServerUser(server!.id, user.email, updatedUser);
        await server?.updateUser(updatedUser);

        showSuccessAlert(t("users:UpdateSuccess"));
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
        removeServerUser(server!.id, user.email);
        router.back();

        showSuccessAlert(t("users:DeleteSuccess"));
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