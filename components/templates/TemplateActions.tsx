import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";

type TemplateActionsProps = {
    isValid: boolean;
};

export default function TemplateActions(props: TemplateActionsProps) {
    const { t } = useTranslation();

    return (
        <>
            <Button
                text={t("templates:Delete")}
                icon="trash-can"
                style="danger"
                onPress={() => {}}
            />

            <Button
                text={t("templates:Save")}
                icon="content-save"
                onPress={() => {}}
                disabled={!props.isValid}
            />
        </>
    );
}