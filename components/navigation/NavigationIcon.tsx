import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { type IconProps } from "@react-native-vector-icons/common";
import { type ComponentProps } from "react";

export default function NavigationIcon({ style, ...rest }: IconProps<ComponentProps<typeof MaterialCommunityIcons>["name"]>) {
    return <MaterialCommunityIcons size={28} style={style} {...rest} />;
}