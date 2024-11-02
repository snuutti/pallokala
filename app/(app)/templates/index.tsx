import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TemplatesListItem from "@/components/templates/TemplatesListItem";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { AllTemplatesResponse } from "pufferpanel";

export default function TemplatesScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const [templatesByRepo, setTemplatesByRepo] = useState<AllTemplatesResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient?.template.listAllTemplates().then((data) => {
            const sortedRepos = data.sort((a, b) => a.id - b.id);
            setTemplatesByRepo(sortedRepos);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            {templatesByRepo.map((repository) => (
                <View key={repository.id}>
                    <Text style={style.header}>{repository.name}</Text>

                    {repository.templates.map((template) => (
                        <TemplatesListItem
                            key={template.name}
                            template={template}
                        />
                    ))}
                </View>
            ))}
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