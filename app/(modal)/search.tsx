import { useState, useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import { ExtendedTemplate } from "@/types/template";
import { ServerView, User, Node } from "pufferpanel";

export default function SearchScreen() {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            loading: {
                marginTop: 5
            },
            header: {
                color: colors.text,
                fontSize: 20,
                marginTop: 5
            }
        })
    );
    const { apiClient } = useApiClient();
    const [servers, setServers] = useState<ServerView[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [templates, setTemplates] = useState<ExtendedTemplate[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebouncedCallback(
        async (query: string) => {
            if (query.trim().length === 0) {
                return;
            }

            await search(query);
        },
        500
    );

    const empty = useMemo(() => {
        return servers.length === 0 && users.length === 0 && nodes.length === 0 && templates.length === 0;
    }, [servers, users, nodes, templates]);

    const reset = () => {
        setServers([]);
        setUsers([]);
        setNodes([]);
        setTemplates([]);
    };

    const search = async (query: string) => {
        setLoading(true);
        setHasSearched(true);

        const q = query.toLowerCase();
        reset();

        try {
            await Promise.all([
                findServers(q),
                apiClient?.auth.hasScope("users.info.search") ? findUsers(q) : Promise.resolve(),
                apiClient?.auth.hasScope("nodes.view") ? findNodes(q) : Promise.resolve(),
                apiClient?.auth.hasScope("templates.view") ? findTemplates(q) : Promise.resolve()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const findServers = async (query: string) => {
        const response = await apiClient!.server.list(1, 5, query);
        setServers(response.servers);
    };

    const findUsers = async (query: string) => {
        const byName = await apiClient!.user.search(query, 5);
        const byEmail = (await apiClient!.user.searchEmail(query, 5)).filter(u => {
            return byName.filter(n => {
                return n.id === u.id;
            }).length === 0;
        });

        const users = byName.concat(byEmail).slice(0, 5);
        setUsers(users);
    };

    const findNodes = async (query: string) => {
        const nodes = await apiClient!.node.list();
        const filtered = nodes.filter(n => {
            return n.name?.toLowerCase().includes(query);
        }).slice(0, 5);

        setNodes(filtered);
    };

    const findTemplates = async (query: string) => {
        const data = await apiClient!.template.listAllTemplates();
        const newData: ExtendedTemplate[] = [];

        for (const repository of data) {
            let count = 0;
            for (const template of repository.templates) {
                if (count >= 5) {
                    break;
                }

                if ((template.display || "").toLowerCase().includes(query) || template.name.toLowerCase().includes(query)) {
                    newData.push({ ...template, repository: repository.id });
                    count++;
                }
            }
        }

        setTemplates(newData);
    };

    const getServerAddress = (server: ServerView) => {
        let ip = server.node?.publicHost;
        if (server.ip && server.ip !== "0.0.0.0") {
            ip = server.ip;
        }

        return ip + (server.port ? ":" + server.port : "");
    };

    return (
        <ContentWrapper>
            <TextInput
                onChangeText={debouncedSearch}
                autoCapitalize="none"
                autoFocus={true}
            />

            {loading && (
                <ActivityIndicator size="large" color={colors.primary} style={style.loading} />
            )}

            {(empty && !loading && hasSearched) && (
                <Text style={style.header}>{t("common:NoResults")}</Text>
            )}

            {!loading && (
                <>
                    {servers.length > 0 && (
                        <>
                            <Text style={style.header}>{t("servers:Servers")}</Text>
                            {servers.map(s => (
                                <SearchItem
                                    key={s.id}
                                    title={s.name!}
                                    subline={`${getServerAddress(s)} @ ${s.node?.name}`}
                                    onPress={() => router.dismissTo(`/server/${s.id}`)}
                                />
                            ))}
                        </>
                    )}

                    {users.length > 0 && (
                        <>
                            <Text style={style.header}>{t("users:Users")}</Text>
                            {users.map(u => (
                                <SearchItem
                                    key={u.id}
                                    title={u.username!}
                                    subline={u.email!}
                                    onPress={() => router.dismissTo(`/users/${u.id}`)}
                                />
                            ))}
                        </>
                    )}

                    {nodes.length > 0 && (
                        <>
                            <Text style={style.header}>{t("nodes:Nodes")}</Text>
                            {nodes.map(n => (
                                <SearchItem
                                    key={n.id}
                                    title={n.name!}
                                    subline={`${n.publicHost}:${n.publicPort}`}
                                    onPress={() => router.dismissTo(`/nodes/${n.id}`)}
                                />
                            ))}
                        </>
                    )}

                    {templates.length > 0 && (
                        <>
                            <Text style={style.header}>{t("templates:Templates")}</Text>
                            {templates.map(t => (
                                <SearchItem
                                    key={t.name}
                                    title={t.display!}
                                    subline={t.name}
                                    onPress={() => router.dismissTo(`/(modal)/template/${t.name}?repo=${t.repository}`)}
                                />
                            ))}
                        </>
                    )}
                </>
            )}
        </ContentWrapper>
    );
}

type SearchItemProps = {
    title: string;
    subline: string;
    onPress: () => void;
};

function SearchItem(props: SearchItemProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            item: {
                padding: 15,
                flexGrow: 1,
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: colors.background,
                marginVertical: 5,
                borderRadius: 15
            },
            title: {
                color: colors.text
            },
            subline: {
                color: colors.textDisabled
            }
        })
    );

    return (
        <TouchableOpacity style={style.item} onPress={props.onPress}>
            <Text style={style.title} numberOfLines={1}>{props.title}</Text>
            <Text style={style.subline} numberOfLines={1}>{props.subline}</Text>
        </TouchableOpacity>
    );
}