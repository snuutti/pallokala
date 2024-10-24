import { Control, FieldErrors } from "react-hook-form";
import { z } from "zod";
import FormTextInput from "@/components/ui/form/FormTextInput";
import FormSwitch from "@/components/ui/form/FormSwitch";

export const NodeSchema = z.object({
    name: z.string().min(1),
    publicHost: z.union([z.string().url(), z.string().ip()]),
    publicPort: z.number().int().min(1).max(65535),
    private: z.discriminatedUnion("withPrivateHost", [
        z.object({
            withPrivateHost: z.literal(true),
            privateHost: z.union([z.string().url(), z.string().ip()]),
            privatePort: z.number().int().min(1).max(65535)
        }),
        z.object({
            withPrivateHost: z.literal(false)
        })
    ]),
    sftpPort: z.number().int().min(1).max(65535)
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
    return (
        <>
            <FormTextInput
                control={props.control}
                name="name"
                placeholder="Name"
                editable={props.editable}
                error={props.errors.name?.message}
            />

            <FormTextInput
                control={props.control}
                name="publicHost"
                placeholder="Public Host"
                autoCapitalize="none"
                autoComplete="url"
                keyboardType="url"
                editable={props.editable}
                error={props.errors.publicHost?.message}
            />

            <FormTextInput
                control={props.control}
                name="publicPort"
                placeholder="Public Port"
                keyboardType="number-pad"
                editable={props.editable}
                error={props.errors.publicPort?.message}
                numeric={true}
            />

            <FormSwitch
                control={props.control}
                name="private.withPrivateHost"
                label="Use a different host/port for server to server communication"
                disabled={!props.editable}
            />

            {props.withPrivateHost && (
                <>
                    <FormTextInput
                        control={props.control}
                        name="private.privateHost"
                        placeholder="Private Host"
                        autoCapitalize="none"
                        autoComplete="url"
                        keyboardType="url"
                        editable={props.editable}
                        // Idk how to fix the type error here
                        // @ts-ignore
                        error={props.errors.private?.privateHost.message}
                    />

                    <FormTextInput
                        control={props.control}
                        name="private.privatePort"
                        placeholder="Private Port"
                        keyboardType="number-pad"
                        editable={props.editable}
                        // @ts-ignore
                        error={props.errors.private?.privatePort?.message}
                        numeric={true}
                    />
                </>
            )}

            <FormTextInput
                control={props.control}
                name="sftpPort"
                placeholder="SFTP Port"
                keyboardType="number-pad"
                editable={props.editable}
                error={props.errors.sftpPort?.message}
            />
        </>
    );
}