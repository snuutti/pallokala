import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";

const schema = z.object({
    old: z.string().min(1),
    new: z.string().min(8),
    confirm: z.string()
}).refine(data => data.new === data.confirm, {
    path: ["confirm"]
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    old: "",
    new: "",
    confirm: ""
};

export default function ChangePasswordScreen() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [saving, setSaving] = useState(false);

    const updatePassword = async (data: Schema) => {
        setSaving(true);

        try {
            await apiClient?.self.changePassword(data.old, data.new);

            showSuccess(t("users:PasswordChanged"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="old"
                placeholder={t("users:OldPassword")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!saving}
                error={errors.old?.message}
            />

            <FormTextInput
                control={control}
                name="new"
                placeholder={t("users:NewPassword")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!saving}
                error={errors.new?.message}
            />

            <FormTextInput
                control={control}
                name="confirm"
                placeholder={t("users:ConfirmPassword")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!saving}
                error={errors.confirm?.message}
            />

            <Button
                text={t("users:ChangePassword")}
                icon="content-save"
                onPress={handleSubmit(updatePassword)}
                disabled={saving || !isValid}
            />
        </ContentWrapper>
    );
}