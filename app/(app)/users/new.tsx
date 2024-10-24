import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useStyle } from "@/hooks/useStyle";

const schema = z.object({
    username: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(1)
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    username: "",
    email: "",
    password: ""
};

export default function NewUserScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });
    const [loading, setLoading] = useState(false);

    const createUser = async (data: Schema) => {
        setLoading(true);

        try {
            const id = await apiClient!.user.create(data.username, data.email, data.password);
            reset();
            router.push(`./${id}`);
        } finally {
            setLoading(false);
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
                    editable={!loading}
                    error={errors.username?.message}
                />

                <FormTextInput
                    control={control}
                    name="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    editable={!loading}
                    error={errors.email?.message}
                />

                <FormTextInput
                    control={control}
                    name="password"
                    placeholder="Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!loading}
                    error={errors.password?.message}
                />

                <Button
                    text="Create User"
                    onPress={handleSubmit(createUser)}
                    disabled={loading || !isValid}
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