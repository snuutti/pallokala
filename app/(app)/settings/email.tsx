import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useModal, ModalButton } from "@/context/ModalProvider";
import { useToast } from "@/context/ToastProvider";

const emailProviderConfigs: Record<string, { key: string; type: string }[]> = {
    none: [],
    smtp: [
        { key: "from", type: "text" },
        { key: "host", type: "text" },
        { key: "username", type: "text" },
        { key: "password", type: "password" }
    ],
    mailgun: [
        { key: "domain", type: "text" },
        { key: "from", type: "text" },
        { key: "key", type: "text" }
    ],
    mailjet: [
        { key: "domain", type: "text" },
        { key: "from", type: "text" },
        { key: "key", type: "text" }
    ]
};

type EmailSettings = {
    [key: string]: string;
    from: string;
    domain: string;
    key: string;
    host: string;
    username: string;
    password: string;
};

const defaultEmailSettings: EmailSettings = {
    from: "",
    domain: "",
    key: "",
    host: "",
    username: "",
    password: ""
};

export default function EmailSettingScreen() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { createListModal } = useModal();
    const { showSuccess } = useToast();
    const [emailProvider, setEmailProvider] = useState("");
    const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultEmailSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        let provider = await apiClient!.settings.get("panel.email.provider");
        if (!provider || !emailProviderConfigs[provider]) {
            provider = "none";
        }

        setEmailProvider(provider);

        const settings = { ...defaultEmailSettings };
        for (const key in emailSettings) {
            settings[key] = await apiClient!.settings.get(`panel.email.${key}`);
        }

        setEmailSettings(settings);

        setLoading(false);
    };

    const saveSettings = async () => {
        const data: Record<string, string> = {
            "panel.email.provider": emailProvider
        };

        for (const key in emailSettings) {
            data[`panel.email.${key}`] = emailSettings[key];
        }

        await apiClient?.settings.set(data);

        showSuccess(t("settings:Saved"));
    };

    const pickEmailProvider = () => {
        const items: ModalButton[] = [];

        for (const provider in emailProviderConfigs) {
            items.push({
                text: t(`settings:emailProviders.${provider}`),
                onPress: () => setEmailProvider(provider)
            });
        }

        createListModal(items);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Button
                text={`${t("settings:EmailProvider")}: ${t(`settings:emailProviders.${emailProvider}`)}`}
                onPress={pickEmailProvider}
            />

            {emailProviderConfigs[emailProvider].map((setting) => (
                <TextInput
                    key={setting.key}
                    value={emailSettings[setting.key]}
                    onChangeText={(value) => setEmailSettings({ ...emailSettings, [setting.key]: value })}
                    placeholder={t(`settings:email.${setting.key}`)}
                    autoCapitalize="none"
                    secureTextEntry={setting.type === "password"}
                />
            ))}

            <Button
                text={t("settings:SaveEmailSettings")}
                icon="content-save"
                onPress={saveSettings}
            />
        </ContentWrapper>
    );
}