import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useApiClient } from "@/context/ApiClientProvider";
import { useToast } from "@/context/ToastProvider";
import { useStyle } from "@/hooks/useStyle";

export default function ChangePasswordScreen() {
    const { style } = useStyle(styling);
    const { apiClient } = useApiClient();
    const { showSuccess } = useToast();
    const [saving, setSaving] = useState(false);
    const [passwordOld, setPasswordOld] = useState("");
    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const updatePassword = async () => {
        setSaving(true);

        try {
            await apiClient?.self.changePassword(passwordOld, passwordNew);

            showSuccess("Password updated successfully");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={style.scrollView} contentContainerStyle={style.contentContainer}>
            <View style={style.content}>
                <TextInput
                    defaultValue={passwordOld}
                    onChangeText={setPasswordOld}
                    placeholder="Old Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!saving}
                />

                <TextInput
                    defaultValue={passwordNew}
                    onChangeText={setPasswordNew}
                    placeholder="New Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!saving}
                />

                <TextInput
                    defaultValue={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    secureTextEntry={true}
                    editable={!saving}
                />

                <Button
                    text="Change Password"
                    icon="content-save"
                    onPress={updatePassword}
                    disabled={saving}
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