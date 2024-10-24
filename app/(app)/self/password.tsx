import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";

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
    const { style } = useStyle(styling);
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
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
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
            </View>
        </ScrollView>
    );
}

function styling() {
    return StyleSheet.create({
        scrollView: {
            width: "100%"
        },
        contentContainer: {
            flexGrow: 1,
            alignItems: "center"
        },
        content: {
            width: "100%",
            maxWidth: 400,
            padding: 20
        }
    });
}