import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import TemplateActions from "@/components/templates/TemplateActions";
import { useTemplateEditor } from "@/context/TemplateEditorProvider";

const schema = z.object({
    name: z.string().min(1, { message: "templates:errors.NameInvalid" }), // TODO: cannot contain spaces or special chars, check uniqueness
    display: z.string().min(1, { message: "templates:errors.DisplayInvalid" }),
    type: z.string().min(1, { message: "templates:errors.TypeInvalid" }),
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    name: "",
    display: "",
    type: ""
};

export default function GeneralScreen() {
    const { t } = useTranslation();
    const { template } = useTemplateEditor();
    const { control, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="name"
                placeholder={t("common:Name")}
                description={t("templates:description.Name")}
                error={errors.name?.message}
            />

            <FormTextInput
                control={control}
                name="display"
                placeholder={t("templates:Display")}
                description={t("templates:description.Display")}
                error={errors.display?.message}
            />

            <FormTextInput
                control={control}
                name="type"
                placeholder={t("templates:Type")}
                description={t("templates:description.Type")}
                error={errors.type?.message}
            />

            <TemplateActions isValid={isValid} />
        </ContentWrapper>
    );
}