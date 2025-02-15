import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import useToast from "@/hooks/useToast";
import { updateAccount } from "@/utils/accountStorage";
import { EmailAccount } from "@/types/account";

const schema = z.object({
    old: z.string().min(1, { message: "errors:ErrFieldRequired" }),
    new: z.string().min(8, { message: "errors:ErrFieldLength" }),
    confirm: z.string()
}).refine(data => data.new === data.confirm, {
    path: ["confirm"],
    message: "errors:ErrPasswordsNotIdentical"
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
    const { activeAccount } = useAccount();
    const { showSuccessAlert } = useToast();
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

            if (activeAccount!.type === "email") {
                const account = activeAccount as EmailAccount;
                account.password = data.new;
                await updateAccount(account);
            }

            showSuccessAlert(t("users:PasswordChanged"));
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
                errorFields={{ field: t("users:OldPassword") }}
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
                errorFields={{ field: t("users:NewPassword"), length: 8 }}
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