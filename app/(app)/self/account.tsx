import { useEffect } from "react";
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
    username: z.string().min(5, { message: "errors:ErrFieldLength" }),
    email: z.email({ message: "errors:ErrFieldNotEmail" }),
    password: z.string().min(8, { message: "errors:ErrPasswordRequirements" })
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    username: "",
    id: "",
    password: ""
};

export default function AccountDetailsScreen() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const { activeAccount, user, refreshSelf } = useAccount();
    const { showSuccessAlert } = useToast();
    const { control, handleSubmit, setValue, formState: { errors, isValid, isSubmitting } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    useEffect(() => {
        setValue("username", user?.username || "");
        setValue("email", user?.email || "");
    }, []);

    const updateUser = async (data: Schema) => {
        await apiClient?.self.updateDetails(data.username, data.email, data.password);
        await refreshSelf();

        if (activeAccount!.type === "email") {
            const account = activeAccount as EmailAccount;
            account.email = data.email;
            await updateAccount(account);
        }

        showSuccessAlert(t("users:InfoChanged"));
    };

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="username"
                placeholder={t("users:Username")}
                autoCapitalize="none"
                autoComplete="username"
                editable={!isSubmitting}
                error={errors.username?.message}
                errorFields={{ field: t("users:Username"), length: 5 }}
            />

            <FormTextInput
                control={control}
                name="email"
                placeholder={t("users:Email")}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                editable={!isSubmitting}
                error={errors.email?.message}
                errorFields={{ field: t("users:Email") }}
            />

            <FormTextInput
                control={control}
                name="password"
                placeholder={t("users:ConfirmPassword")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!isSubmitting}
                error={errors.password?.message}
            />

            <Button
                text={t("users:ChangeInfo")}
                icon="content-save"
                onPress={handleSubmit(updateUser)}
                disabled={isSubmitting || !isValid}
            />
        </ContentWrapper>
    );
}