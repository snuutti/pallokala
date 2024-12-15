import { useRef, Fragment } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useStyle } from "@/hooks/useStyle";

type BreadcrumbProps = {
    path: string[];
    onNavigate: (index: number) => void;
};

export default function Breadcrumb(props: BreadcrumbProps) {
    const { style } = useStyle((colors) =>
        StyleSheet.create({
            breadcrumb: {
                paddingHorizontal: 4,
                paddingVertical: 6
            },
            divider: {
                paddingHorizontal: 4,
                paddingVertical: 6,
                color: colors.text
            },
            text: {
                color: colors.text
            }
        })
    );
    const scrollViewRef = useRef<ScrollView>(null);

    const onContentSizeChange = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <ScrollView
            horizontal={true}
            onContentSizeChange={onContentSizeChange}
            ref={scrollViewRef}
        >
            <Text style={style.divider}>/</Text>

            {props.path.map((name, index) => (
                <Fragment key={index}>
                    {index === props.path.length - 1 ? (
                        <Text style={[style.breadcrumb, style.text]}>
                            {name}
                        </Text>
                    ) : (
                        <TouchableOpacity style={style.breadcrumb} onPress={() => props.onNavigate(index)}>
                            <Text style={style.text}>
                                {name}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {index < props.path.length - 1 && (
                        <Text style={style.divider}>/</Text>
                    )}
                </Fragment>
            ))}
        </ScrollView>
    );
}