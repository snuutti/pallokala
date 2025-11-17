import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useBoundStore } from "@/stores/useBoundStore";

const schema = z.object({
    username: z.string().min(5, { message: "errors:ErrFieldLength" }),
    email: z.email({ message: "errors:ErrFieldNotEmail" }),
    password: z.string().min(1, { message: "errors:ErrFieldRequired" })
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    username: "",
    email: "",
    password: ""
};

export default function CreateUserScreen() {
    const { t } = useTranslation();
    const { apiClient } = useApiClient();
    const addUser = useBoundStore(state => state.addUser);
    const { control, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const createUser = async (data: Schema) => {
        const id = await apiClient!.user.create(data.username, data.email, data.password);
        addUser({ id, username: data.username, email: data.email });

        router.dismissTo(`/(app)/users/${id}`);
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
                placeholder={t("users:Password")}
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                editable={!isSubmitting}
                error={errors.password?.message}
                errorFields={{ field: t("users:Password") }}
            />

            <Button
                text={t("users:Create")}
                icon="content-save"
                onPress={handleSubmit(createUser)}
                disabled={isSubmitting || !isValid}
            />
        </ContentWrapper>
    );
}