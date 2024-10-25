import { useState } from "react";
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

            showSuccess("Password updated successfully");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ContentWrapper>
            <FormTextInput
                control={control}
                name="old"
                placeholder="Old Password"
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!saving}
                error={errors.old?.message}
            />

            <FormTextInput
                control={control}
                name="new"
                placeholder="New Password"
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!saving}
                error={errors.new?.message}
            />

            <FormTextInput
                control={control}
                name="confirm"
                placeholder="Confirm Password"
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!saving}
                error={errors.confirm?.message}
            />

            <Button
                text="Change Password"
                icon="content-save"
                onPress={handleSubmit(updatePassword)}
                disabled={saving || !isValid}
            />
        </ContentWrapper>
    );
}