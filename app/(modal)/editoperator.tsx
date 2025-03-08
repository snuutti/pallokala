import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ContentWrapper from "@/components/screen/ContentWrapper";
import Operator from "@/components/templates/operator/Operator";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";
import { ConditionalMetadataType } from "pufferpanel";

export default function EditOperatorScreen() {
    const { t } = useTranslation();
    const initialOperatorData = useBoundStore(state => state.initialOperatorData);
    const setReturnedOperatorData = useBoundStore(state => state.setReturnedOperatorData);
    const [data, setData] = useState<ConditionalMetadataType>({});

    useEffect(() => {
        setData(initialOperatorData ?? {});
    }, [initialOperatorData]);

    const save = () => {
        setReturnedOperatorData(data);
        router.back();
    };

    return (
        <ContentWrapper>
            <Operator
                data={data}
                setData={setData}
            />

            <Button
                text={t("common:Save")}
                icon="content-save"
                onPress={save}
            />
        </ContentWrapper>
    );
}