import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import useToast from "@/hooks/useToast";

export default function PanelSettingsScreen() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { showSuccessAlert } = useToast();
    const [masterUrl, setMasterUrl] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [registrationEnabled, setRegistrationEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setMasterUrl(await apiClient!.settings.get("panel.settings.masterUrl"));
        setCompanyName(await apiClient!.settings.get("panel.settings.companyName"));
        const registrationEnabled = await apiClient!.settings.get("panel.registrationEnabled");
        setRegistrationEnabled(registrationEnabled === "true" || Boolean(registrationEnabled));
        setLoading(false);
    };

    const saveSettings = async () => {
        await apiClient?.settings.set({
            "panel.settings.masterUrl": masterUrl,
            "panel.settings.companyName": companyName,
            "panel.registrationEnabled": registrationEnabled.toString()
        });

        showSuccessAlert(t("settings:Saved"));
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <TextInput
                value={masterUrl}
                onChangeText={setMasterUrl}
                placeholder={t("settings:MasterUrl")}
                description={t("settings:MasterUrlHint")}
                autoCapitalize="none"
                keyboardType="url"
            />

            <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder={t("settings:CompanyName")}
            />

            <Switch
                label={t("settings:RegistrationEnabled")}
                description={t("settings:RegistrationEnabledHint")}
                value={registrationEnabled}
                onValueChange={setRegistrationEnabled}
            />

            <Button
                text={t("settings:SavePanelSettings")}
                icon="content-save"
                onPress={saveSettings}
            />
        </ContentWrapper>
    );
}