import { useState, useEffect, useCallback } from "react";
import { Text, RefreshControl, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import TemplatesListItem from "@/components/templates/TemplatesListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { Template } from "pufferpanel";

export default function TemplatesScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const [data, setData] = useState<(string | Template)[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = useCallback(async () => {
        setLoading(true);

        const data = await apiClient!.template.listAllTemplates();
        const sortedRepos = data.sort((a, b) => a.id - b.id);
        const newData: (string | Template)[] = [];

        for (const repository of sortedRepos) {
            newData.push(repository.name);
            for (const template of repository.templates) {
                newData.push(template);
            }
        }

        setData(newData);
        setLoading(false);
    }, []);

    return (
        <FlashList
            data={data}
            renderItem={({ item }) => {
                if (typeof item === "string") {
                    return <Text style={style.header}>{item}</Text>;
                }

                return <TemplatesListItem template={item as Template} />;
            }}
            getItemType={(item) => {
                return typeof item === "string" ? "header" : "template";
            }}
            estimatedItemSize={80}
            contentContainerStyle={style.templatesContainer}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={loadTemplates} />
            }
        />
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        templatesContainer: {
            paddingTop: 10,
            paddingBottom: 20
        },
        header: {
            color: colors.text,
            fontSize: 16,
            marginHorizontal: 10,
            marginVertical: 5
        }
    });
}