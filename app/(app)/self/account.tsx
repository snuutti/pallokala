import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useAccount } from "@/context/AccountProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";

const schema = z.object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string()
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    username: "",
    id: "",
    password: ""
};

export default function AccountDetailsScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { user, refreshSelf } = useAccount();
    const { showSuccess } = useToast();
    const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue("username", user?.username || "");
        setValue("email", user?.email || "");
    }, []);

    const updateUser = async (data: Schema) => {
        setSaving(true);

        try {
            await apiClient?.self.updateDetails(data.username, data.email, data.password);
            await refreshSelf();

            showSuccess("Account updated successfully");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <FormTextInput
                    control={control}
                    name="username"
                    placeholder="Username"
                    autoCapitalize="none"
                    autoComplete="username"
                    editable={!saving}
                    error={errors.username?.message}
                />

                <FormTextInput
                    control={control}
                    name="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={!saving}
                    error={errors.email?.message}
                />

                <FormTextInput
                    control={control}
                    name="password"
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!saving}
                    error={errors.password?.message}
                />

                <Button
                    text="Change Account Details"
                    icon="content-save"
                    onPress={handleSubmit(updateUser)}
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