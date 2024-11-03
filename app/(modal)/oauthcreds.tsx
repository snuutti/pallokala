import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Copyable from "@/components/ui/Copyable";

export default function OAuthCredentialsScreen() {
    const { t } = useTranslation();
    const { id, secret } = useLocalSearchParams<{ id: string, secret: string }>();

    return (
        <ContentWrapper>
            <Copyable label={t("oauth:ClientId")} text={id} />
            <Copyable label={t("oauth:ClientSecret")} text={secret} />
        </ContentWrapper>
    );
}