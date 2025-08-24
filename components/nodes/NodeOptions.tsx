import Animated, { FadeOutUp, FadeInUp, LinearTransition } from "react-native-reanimated";
import { Control, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import FormTextInput from "@/components/ui/form/FormTextInput";
import FormSwitch from "@/components/ui/form/FormSwitch";

export const NodeSchema = z.object({
    name: z.string().min(1, { message: "errors:ErrFieldRequired" }).regex(/^[a-zA-Z0-9\-._~]+$/, { message: "errors:ErrFieldHasURICharacters" }),
    publicHost: z.union([z.url({ message: "errors:ErrFieldIsInvalidHost" }), z.ipv4({ message: "errors:ErrFieldIsInvalidHost" }), z.ipv6({ message: "errors:ErrFieldIsInvalidHost" })]),
    publicPort: z.number().int().min(1, { message: "errors:ErrFieldNotBetween" }).max(65535, { message: "errors:ErrFieldNotBetween" }),
    private: z.discriminatedUnion("withPrivateHost", [
        z.object({
            withPrivateHost: z.literal(true),
            privateHost: z.union([z.url({ message: "errors:ErrFieldIsInvalidHost" }), z.ipv4({ message: "errors:ErrFieldIsInvalidHost" }), z.ipv6({ message: "errors:ErrFieldIsInvalidHost" })]),
            privatePort: z.number().int().min(1, { message: "errors:ErrFieldNotBetween" }).max(65535, { message: "errors:ErrFieldNotBetween" })
        }),
        z.object({
            withPrivateHost: z.literal(false)
        })
    ]),
    sftpPort: z.number().int().min(1, { message: "errors:ErrFieldNotBetween" }).max(65535, { message: "errors:ErrFieldNotBetween" })
});

export type NodeSchemaType = z.infer<typeof NodeSchema>;

export const NodeDefaultValues = {
    name: "",
    publicHost: "",
    publicPort: 8080,
    private: {
        withPrivateHost: false,
        privateHost: "",
        privatePort: 8080
    },
    sftpPort: 5657
};

type NodeOptionsProps = {
    control: Control<NodeSchemaType>;
    errors: FieldErrors<NodeSchemaType>;
    editable: boolean;
    withPrivateHost: boolean;
};

export default function NodeOptions(props: NodeOptionsProps) {
    const { t } = useTranslation();

    return (
        <>
            <FormTextInput
                control={props.control}
                name="name"
                placeholder={t("common:Name")}
                editable={props.editable}
                error={props.errors.name?.message}
                errorFields={{ field: t("common:Name") }}
            />

            <FormTextInput
                control={props.control}
                name="publicHost"
                placeholder={t("nodes:PublicHost")}
                autoCapitalize="none"
                autoComplete="url"
                keyboardType="url"
                editable={props.editable}
                error={props.errors.publicHost?.message}
                errorFields={{ field: t("nodes:PublicHost") }}
            />

            <FormTextInput
                control={props.control}
                name="publicPort"
                placeholder={t("nodes:PublicPort")}
                keyboardType="number-pad"
                editable={props.editable}
                error={props.errors.publicPort?.message}
                errorFields={{ field: t("nodes:PublicPort"), min: 1, max: 65535 }}
                numeric={true}
            />

            <FormSwitch
                control={props.control}
                name="private.withPrivateHost"
                label={t("nodes:WithPrivateAddress")}
                description={t("nodes:WithPrivateAddressHint")}
                disabled={!props.editable}
            />

            {props.withPrivateHost && (
                <Animated.View layout={LinearTransition} exiting={FadeOutUp} entering={FadeInUp}>
                    <FormTextInput
                        control={props.control}
                        name="private.privateHost"
                        placeholder={t("nodes:PrivateHost")}
                        autoCapitalize="none"
                        autoComplete="url"
                        keyboardType="url"
                        editable={props.editable}
                        // Idk how to fix the type error here
                        // @ts-ignore
                        error={props.errors.private?.privateHost.message}
                        errorFields={{ field: t("nodes:PrivateHost") }}
                    />

                    <FormTextInput
                        control={props.control}
                        name="private.privatePort"
                        placeholder={t("nodes:PrivatePort")}
                        keyboardType="number-pad"
                        editable={props.editable}
                        // @ts-ignore
                        error={props.errors.private?.privatePort?.message}
                        errorFields={{ field: t("nodes:PrivatePort"), min: 1, max: 65535 }}
                        numeric={true}
                    />
                </Animated.View>
            )}

            <FormTextInput
                control={props.control}
                name="sftpPort"
                placeholder={t("nodes:SftpPort")}
                keyboardType="number-pad"
                editable={props.editable}
                error={props.errors.sftpPort?.message}
                errorFields={{ field: t("nodes:SftpPort"), min: 1, max: 65535 }}
                numeric={true}
            />
        </>
    );
}