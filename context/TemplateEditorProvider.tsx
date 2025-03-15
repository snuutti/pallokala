import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useApiClient } from "@/context/ApiClientProvider";
import { ExtendedTemplate } from "@/types/template";

type TemplateEditorContextType = {
    template: ExtendedTemplate | undefined;
    json: string | undefined;
    setTemplate: (template: ExtendedTemplate) => void;
    loadTemplate: (name: string, repo: number) => Promise<void>;
    error: boolean;
};

export const TemplateEditorContext = createContext<TemplateEditorContextType | undefined>(undefined);

type TemplateEditorProviderProps = {
    children: ReactNode;
};

export const TemplateEditorProvider = ({ children }: TemplateEditorProviderProps) => {
    const { apiClient } = useApiClient();
    const [template, setTemplate] = useState<ExtendedTemplate | undefined>(undefined);
    const [error, setError] = useState(false);

    const json = useMemo(() => {
        if (!template) {
            return undefined;
        }

        const newTemplate = { ...template };
        delete (newTemplate as Partial<ExtendedTemplate>).repository;

        return JSON.stringify(newTemplate, undefined, 4);
    }, [template]);

    const loadTemplate = async (name: string, repo: number) => {
        setError(false);
        setTemplate(undefined);

        try {
            const newTemplate = await apiClient!.template.get(repo, name);
            setTemplate({ ...newTemplate, repository: repo });
        } catch (e) {
            console.error("Failed to load template", e);
            setError(true);
        }
    };

    return (
        <TemplateEditorContext.Provider value={{ template, json, setTemplate, loadTemplate, error }}>
            {children}
        </TemplateEditorContext.Provider>
    );
}

export const useTemplateEditor = () => {
    const context = useContext(TemplateEditorContext);
    if (context === undefined) {
        throw new Error("useTemplateEditor must be used within a TemplateEditorProvider");
    }

    return context;
};