import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Dropdown from "@/components/ui/Dropdown";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import useToast from "@/hooks/useToast";
import useVersionCheck from "@/hooks/useVersionCheck";

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
        { key: "key", type: "password" }
    ],
    mailjet: [
        { key: "domain", type: "text" },
        { key: "from", type: "text" },
        { key: "key", type: "password" }
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
    const { showSuccessAlert } = useToast();
    const hasEmailTest = useVersionCheck("3.0.0-rc.11");
    const [emailProvider, setEmailProvider] = useState("");
    const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultEmailSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const emailProviders = useMemo(() => {
        return Object.keys(emailProviderConfigs).map((key) => ({
            value: key,
            display: t(`settings:emailProviders.${key}`)
        }));
    }, [t]);

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

        showSuccessAlert(t("settings:Saved"));
    };

    const sendTestEmail = async () => {
        await apiClient?.settings.sendTestEmail();
        showSuccessAlert(t("settings:TestEmailSent"));
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <Dropdown
                options={emailProviders}
                value={emailProvider}
                onChange={(value) => setEmailProvider(value as string)}
                label={t("settings:EmailProvider")}
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

            {hasEmailTest && (
                <Button
                    text={t("settings:TestEmail")}
                    icon="email-fast"
                    onPress={sendTestEmail}
                />
            )}
        </ContentWrapper>
    );
}