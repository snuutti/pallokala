import { useState, useEffect } from "react";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";

export default function PanelSettingsScreen() {
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
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
        setRegistrationEnabled((await apiClient!.settings.get("panel.registrationEnabled")) === "true");
        setLoading(false);
    };

    const saveSettings = async () => {
        await apiClient?.settings.set({
            "panel.settings.masterUrl": masterUrl,
            "panel.settings.companyName": companyName,
            "panel.registrationEnabled": registrationEnabled.toString()
        });

        showSuccess("Panel settings saved");
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <TextInput
                value={masterUrl}
                onChangeText={setMasterUrl}
                placeholder="Master URL"
                autoCapitalize="none"
                keyboardType="url"
            />

            <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Company Name"
            />

            <Switch
                label="Allow users to register themselves"
                description="Self registered users can't do anything until given permissions Disabling this only prevents direct registration, invitation to a server and the Users page are not affected"
                value={registrationEnabled}
                onValueChange={setRegistrationEnabled}
            />

            <Button
                text="Save Panel Settings"
                icon="content-save"
                onPress={saveSettings}
            />
        </ContentWrapper>
    );
}