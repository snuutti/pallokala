import { ReactNode } from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useIsInsideTabsNavigator from "@/hooks/useIsInsideTabsNavigator";
import { useStyle } from "@/hooks/useStyle";

type ContentWrapperProps = {
    scrollViewStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    children: ReactNode;
};

export default function ContentWrapper(props: ContentWrapperProps) {
    const isInsideTabsNavigator = useIsInsideTabsNavigator();
    const insets = useSafeAreaInsets();
    const { style } = useStyle(() =>
        StyleSheet.create({
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
                padding: 20,
                paddingBottom: isInsideTabsNavigator ? 20 : insets.bottom
            }
        })
    );

    return (
        <KeyboardAwareScrollView
            bottomOffset={50}
            style={[style.scrollView, props.scrollViewStyle]}
            contentContainerStyle={[style.contentContainer, props.contentContainerStyle]}
        >
            <View style={[style.content, props.contentStyle]}>
                {props.children}
            </View>
        </KeyboardAwareScrollView>
    );
}