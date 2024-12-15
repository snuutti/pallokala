import { useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useModal } from "@/context/ModalProvider";
import { useStyle } from "@/hooks/useStyle";

export type MultiSelectProps = {
    label?: string;
    error?: string;
    errorFields?: Record<string, unknown>;
    items: string[];
    onChange: (items: string[]) => void;
    options: (query: string) => Promise<string[]>;
    disabled?: boolean;
};

export default function MultiSelect(props: MultiSelectProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            label: {
                color: colors.text,
                marginHorizontal: 16,
                marginTop: 5,
                alignSelf: "flex-start"
            },
            container: {
                width: "100%",
                marginVertical: 5,
                padding: 16,
                borderRadius: 16,
                borderColor: colors.textDisabled,
                borderWidth: 2,
                backgroundColor: colors.background,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 5
            },
            disabled: {
                opacity: 0.5
            },
            error: {
                borderColor: colors.error
            },
            errorText: {
                color: colors.error,
                marginHorizontal: 16,
                marginBottom: 5,
                alignSelf: "flex-start"
            }
        })
    );
    const { createModal } = useModal();

    const addItem = (item: string) => {
        props.onChange([...props.items, item]);
    };

    const openAddItemModal = () => {
        createModal(
            <MultiSelectSearchModal
                selectedItems={props.items}
                onSelect={addItem}
                options={props.options}
            />
        );
    };

    return (
        <>
            {props.label && (
                <Text style={style.label}>{props.label}</Text>
            )}

            <View
                style={[
                    style.container,
                    props.disabled && style.disabled,
                    props.error && style.error
                ]}
            >
                {props.items.map((item) => (
                    <MultiSelectPill
                        key={item}
                        text={item}
                        remove={() => {
                            props.onChange(props.items.filter((i) => i !== item));
                        }}
                        disabled={props.disabled}
                    />
                ))}

                {!props.disabled && (
                    <TouchableOpacity onPress={openAddItemModal}>
                        <MaterialCommunityIcons name="plus-circle" size={20} color={colors.text} />
                    </TouchableOpacity>
                )}
            </View>

            {props.error && (
                <Text style={style.errorText}>{props.error}</Text>
            )}
        </>
    );
}

type MultiSelectPillProps = {
    text: string;
    remove: () => void;
    disabled?: boolean;
};

function MultiSelectPill(props: MultiSelectPillProps) {
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            pill: {
                backgroundColor: colors.primary,
                borderRadius: 16,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 6,
                paddingRight: 2,
                paddingVertical: 2
            },
            text: {
                color: colors.textPrimary
            },
            remove: {
                marginLeft: 5
            }
        })
    );

    return (
        <View style={style.pill}>
            <Text style={style.text}>{props.text}</Text>

            {!props.disabled && (
                <TouchableOpacity style={style.remove} onPress={props.remove}>
                    <MaterialCommunityIcons name="close-circle" size={20} color={colors.textPrimary} />
                </TouchableOpacity>
            )}
        </View>
    );
}

type MultiSelectSearchModalProps = {
    selectedItems: string[];
    onSelect: (item: string) => void;
    options: (query: string) => Promise<string[]>;
    handleClose?: () => void;
};

function MultiSelectSearchModal(props: MultiSelectSearchModalProps) {
    const { t } = useTranslation();
    const { style, colors } = useStyle((colors) =>
        StyleSheet.create({
            container: {
                justifyContent: "center",
                alignItems: "center"
            },
            loading: {
                marginTop: 5
            },
            noResults: {
                color: colors.text,
                fontSize: 20,
                marginTop: 5
            }
        })
    );
    const [loading, setLoading] = useState(false);
    const [hasSelected, setHasSelected] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [items, setItems] = useState<string[]>([]);

    const debouncedSearch = useDebouncedCallback(
        async (query: string) => {
            if (query.trim().length === 0) {
                return;
            }

            setLoading(true);
            setHasSearched(true);
            setItems([]);
            const items = await props.options(query);
            setItems(items.filter((item) => !props.selectedItems.includes(item)));
            setLoading(false);
        },
        500
    );

    return (
        <View style={style.container}>
            <TextInput
                placeholder={t("users:Username")}
                onChangeText={debouncedSearch}
                autoCapitalize="none"
                autoFocus={true}
                editable={!hasSelected}
            />

            {loading && (
                <ActivityIndicator size="large" color={colors.primary} style={style.loading} />
            )}

            {items.map((item) => (
                <Button
                    key={item}
                    text={item}
                    onPress={() => {
                        setHasSelected(true);
                        setItems(items.filter((i) => i !== item));
                        props.onSelect(item);
                        props.handleClose!();
                    }}
                    disabled={hasSelected}
                />
            ))}

            {items.length === 0 && !loading && hasSearched && (
                <Text style={style.noResults}>{t("common:NoResults")}</Text>
            )}
        </View>
    );
}