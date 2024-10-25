import { Text, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import ContentWrapper from "@/components/screen/ContentWrapper";
import FormTextInput from "@/components/ui/form/FormTextInput";
import Button from "@/components/ui/Button";
import { useAccount } from "@/context/AccountProvider";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";
import { OAuthAccount } from "@/types/account";

const schema = z.object({
    address: z.string().url(),
    id: z.string().uuid(),
    secret: z.string().length(48)
});

type Schema = z.infer<typeof schema>;

const defaultValues = {
    address: "",
    id: "",
    secret: ""
};

export default function Login() {
    const { style } = useStyle(styling);
    const { addAccount } = useAccount();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm<Schema>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    const logIn = async (data: Schema) => {
        const account: OAuthAccount = {
            serverAddress: data.address,
            nickname: "",
            type: "oauth",
            clientId: data.id,
            clientSecret: data.secret
        };

        if (await addAccount(account)) {
            router.replace("/");
        } else {
            console.error("Login failed");
        }
    };

    return (
        <ContentWrapper scrollViewStyle={style.scrollView} contentContainerStyle={style.contentContainer}>
            <Text style={style.header}>Welcome!</Text>
            <Text style={style.subheader}>Add a new PufferPanel server to get started.</Text>

            <FormTextInput
                control={control}
                name="address"
                placeholder="Server address"
                autoCapitalize="none"
                autoComplete="url"
                keyboardType="url"
                error={errors.address?.message}
            />

            <FormTextInput
                control={control}
                name="id"
                placeholder="Client ID"
                autoCapitalize="none"
                autoComplete="off"
                error={errors.id?.message}
            />

            <FormTextInput
                control={control}
                name="secret"
                placeholder="Client secret"
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry={true}
                error={errors.secret?.message}
            />

            <Button
                text="Add Account"
                onPress={handleSubmit(logIn)}
                disabled={!isValid}
            />
        </ContentWrapper>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        scrollView: {
            backgroundColor: colors.background
        },
        contentContainer: {
            justifyContent: "center"
        },
        header: {
            color: colors.text,
            fontSize: 32
        },
        subheader: {
            color: colors.text,
            fontSize: 16,
            marginBottom: 5
        }
    });
}