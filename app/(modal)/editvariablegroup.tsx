import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import LoadingScreen from "@/components/screen/LoadingScreen";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";

const schema = z.object({
    display: z.string().trim().min(1, { message: "templates:errors.DisplayInvalid" }),
    description: z.string(),
    condition: z.string().optional()
});

type Schema = z.infer<typeof schema>;

const defaultValues: Schema = {
    display: "",
    description: "",
    condition: ""
};

export default function EditVariableGroup() {
    const { t } = useTranslation();
    const initialVariableGroupData = useBoundStore(state => state.initialVariableGroupData);
    const setReturnedVariableGroupData = useBoundStore(state => state.setReturnedVariableGroupData);
    const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        if (!initialVariableGroupData) {
            return;
        }

        setValue("display", initialVariableGroupData.display, { shouldValidate: true });
        setValue("description", initialVariableGroupData.description, { shouldValidate: true });
        setValue("condition", initialVariableGroupData.if, { shouldValidate: true });
        setLoading(false);
    }, [initialVariableGroupData]);

    const save = (data: Schema) => {
        setReturnedVariableGroupData({
            ...initialVariableGroupData!,
            display: data.display,
            description: data.description,
            if: data.condition
        });

        router.back();
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="display"
                placeholder={t("templates:Display")}
                error={errors.display?.message}
            />

            <FormTextInput
                control={control}
                name="description"
                placeholder={t("templates:variables.Description")}
                error={errors.description?.message}
            />

            <FormTextInput
                control={control}
                name="condition"
                placeholder={t("common:Conditions")}
                description={t("templates:variables.ConditionHint")}
                error={errors.condition?.message}
            />

            <Button
                text={t("common:Apply")}
                icon="content-save"
                onPress={handleSubmit(save)}
                disabled={!isValid}
            />
        </ContentWrapper>
    );
}