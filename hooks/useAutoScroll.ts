import { useRef, useState, useEffect } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { FlashList } from "@shopify/flash-list";

type AutoScrollHookProps<T> = {
    data: T[];
    inverted?: boolean;
};

export default function useAutoScroll<T>({ data, inverted }: AutoScrollHookProps<T>) {
    const listRef = useRef<FlashList<T>>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [listMounted, setListMounted] = useState(false);

    useEffect(() => {
        if (listMounted && isAtBottom && data.length > 0 && !inverted) {
            listRef.current?.scrollToEnd({ animated: false });
        }
    }, [data, listMounted, isAtBottom]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;

        if (inverted) {
            setIsAtBottom(contentOffset.y <= paddingToBottom);
        } else {
            setIsAtBottom(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom);
        }
    };

    const handleContentSizeChange = () => {
        setListMounted(true);
    };

    const goToBottom = () => {
        if (inverted) {
            listRef.current?.scrollToIndex({ index: 0, animated: true });
        } else {
            listRef.current?.scrollToEnd({ animated: true });
        }
    };

    return { listRef, isAtBottom, listMounted, handleScroll, handleContentSizeChange, goToBottom };
}