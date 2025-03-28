import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Dropdown from "@/components/ui/Dropdown";
import EnvironmentConfig from "@/components/templates/EnvironmentConfig";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";
import { MetadataType } from "pufferpanel";
import { EnvironmentDefault, environmentDefaults } from "@/types/template";

export default function EditEnvironmentScreen() {
    const { t } = useTranslation();
    const initialEnvironmentData = useBoundStore(state => state.initialEnvironmentData);
    const setReturnedEnvironmentData = useBoundStore(state => state.setReturnedEnvironmentData);
    const [data, setData] = useState<MetadataType>({});

    useEffect(() => {
        setData(initialEnvironmentData?.data ?? {});
    }, [initialEnvironmentData]);

    const environments = useMemo(() => {
        return initialEnvironmentData?.unsupportedEnvironments.map(env => ({
            value: env.value,
            display: t(env.label)
        })) || [];
    }, [initialEnvironmentData, t]);

    const setType = (type: string) => {
        const newData = { ...environmentDefaults[type as keyof EnvironmentDefault] };
        setData(newData);
    };

    const save = () => {
        setReturnedEnvironmentData(data);
        router.back();
    };

    return (
        <ContentWrapper>
            {initialEnvironmentData?.adding && (
                <Dropdown
                    options={environments}
                    value={data.type!}
                    onChange={(value) => setType(value as string)}
                    label={t("templates:Environments")}
                />
            )}

            <EnvironmentConfig
                environment={data}
                onChange={setData}
                noFieldsMessage={t("env:NoEnvFields")}
            />

            <Button
                text={t("common:Save")}
                icon="content-save"
                onPress={save}
            />
        </ContentWrapper>
    );
}