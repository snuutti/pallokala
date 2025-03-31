import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";

export default function EditVariableGroup() {
    const { t } = useTranslation();
    const initialVariableGroupData = useBoundStore(state => state.initialVariableGroupData);
    const setReturnedVariableGroupData = useBoundStore(state => state.setReturnedVariableGroupData);
    const [display, setDisplay] = useState("");
    const [description, setDescription] = useState("");
    const [condition, setCondition] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        if (!initialVariableGroupData) {
            return;
        }

        setDisplay(initialVariableGroupData.display);
        setDescription(initialVariableGroupData.description);
        setCondition(initialVariableGroupData.if || "");
        setLoading(false);
    }, [initialVariableGroupData]);

    const save = () => {
        setReturnedVariableGroupData({
            ...initialVariableGroupData!,
            display,
            description,
            if: condition
        });

        router.back();
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <TextInput
                value={display}
                onChangeText={setDisplay}
                placeholder={t("templates:Display")}
            />

            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={t("templates:variables.Description")}
            />

            <TextInput
                value={condition}
                onChangeText={setCondition}
                placeholder={t("common:Conditions")}
                description={t("templates:variables.ConditionHint")}
            />

            <Button
                text={t("common:Apply")}
                icon="content-save"
                onPress={save}
                // TODO: add disabled state
            />
        </ContentWrapper>
    );
}