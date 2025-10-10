import { Text, View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Button from "@/components/ui/Button";
import { useStyle } from "@/hooks/useStyle";

export default function RecoveryCodesScreen() {
    const { t } = useTranslation();
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            hint: {
                color: colors.text
            },
            codes: {
                paddingVertical: 20
            },
            codeWrapper: {
                flex: 1,
                padding: 5
            },
            code: {
                backgroundColor: colors.background,
                borderRadius: 10,
                padding: 6
            },
            text: {
                color: colors.text,
                fontFamily: "UbuntuMonoBold",
                textAlign: "center"
            }
        })
    );
    const { codes: codesString } = useLocalSearchParams<{ codes: string }>();
    const codes = JSON.parse(codesString) as string[];

    const saveRecoveryCodes = async () => {
        const content = codes.join("\n");

        const file = new File(Paths.cache, "recovery-codes.txt");
        file.create({
            overwrite: true
        });
        file.write(content);

        await Sharing.shareAsync(file.uri, {
            mimeType: "text/plain",
            dialogTitle: t("users:SaveRecoveryCodes")
        });
    };

    return (
        <ContentWrapper>
            <Text style={style.hint}>{t("users:RecoveryCodesHint")}</Text>

            <FlashList
                data={codes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={style.codeWrapper}>
                        <View style={style.code}>
                            <Text selectable={true} style={style.text}>
                                {item}
                            </Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={style.codes}
                numColumns={2}
            />

            <Button
                text={t("users:SaveRecoveryCodes")}
                style="success"
                icon="download"
                onPress={saveRecoveryCodes}
            />
        </ContentWrapper>
    );
}