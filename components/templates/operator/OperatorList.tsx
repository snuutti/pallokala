import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import OperatorListItem from "@/components/templates/operator/OperatorListItem";
import Button from "@/components/ui/Button";
import { useBoundStore } from "@/stores/useBoundStore";
import { ConditionalMetadataType } from "pufferpanel";

type OperatorListProps = {
    operations: ConditionalMetadataType[];
    setOperations: (operations: ConditionalMetadataType[]) => void;
    addLabel?: string;
};

export default function OperatorList(props: OperatorListProps) {
    const { t } = useTranslation();
    const returnedOperatorData = useBoundStore(state => state.returnedOperatorData);
    const setInitialOperatorData = useBoundStore(state => state.setInitialOperatorData);
    const setReturnedOperatorData = useBoundStore(state => state.setReturnedOperatorData);
    const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!returnedOperatorData) {
            return;
        }

        if (editIndex === undefined) {
            return;
        }

        const newOperations = [...props.operations];
        newOperations[editIndex!] = returnedOperatorData;
        props.setOperations(newOperations);

        setEditIndex(undefined);
        setInitialOperatorData(undefined);
    }, [returnedOperatorData, editIndex]);

    const swap = (index1: number, index2: number) => {
        const newOperations = [...props.operations];
        const temp = newOperations[index1];
        newOperations[index1] = newOperations[index2];
        newOperations[index2] = temp;
        props.setOperations(newOperations);
    };

    const remove = (index: number) => {
        const newOperations = [...props.operations];
        newOperations.splice(index, 1);
        props.setOperations(newOperations);
    };

    const edit = (data: ConditionalMetadataType, index: number) => {
        setEditIndex(index);
        setInitialOperatorData(data);
        setReturnedOperatorData(undefined);
        router.push(`/(modal)/editoperator`);
    };

    const add = () => {
        const newOperations = [...props.operations];
        const data = {
            type: "command",
            commands: []
        };

        newOperations.push(data);

        props.setOperations(newOperations);
        edit(data, newOperations.length - 1);
    };

    return (
        <>
            {props.operations.map((operation, index) => (
                <OperatorListItem
                    key={index}
                    operation={operation}
                    canMoveUp={index > 0}
                    canMoveDown={index < props.operations.length - 1}
                    edit={() => edit(operation, index)}
                    up={() => swap(index, index - 1)}
                    down={() => swap(index, index + 1)}
                    delete={() => remove(index)}
                />
            ))}

            <Button
                text={props.addLabel || t("common:Add")}
                icon="plus"
                onPress={add}
            />
        </>
    );
}