import { useLocalSearchParams } from "expo-router";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Copyable from "@/components/ui/Copyable";

export default function OAuthCredentialsScreen() {
    const { id, secret } = useLocalSearchParams<{ id: string, secret: string }>();

    return (
        <ContentWrapper>
            <Copyable label="Client ID" text={id} />
            <Copyable label="Client Secret" text={secret} />
        </ContentWrapper>
    );
}