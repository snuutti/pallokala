import { useRef, useState, useEffect } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { FlashList } from "@shopify/flash-list";

type AutoScrollHookProps<T> = {
    data: T[];
};

export default function useAutoScroll<T>({ data }: AutoScrollHookProps<T>) {
    const listRef = useRef<FlashList<T>>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [listMounted, setListMounted] = useState(false);

    useEffect(() => {
        if (listMounted && isAtBottom && data.length > 0) {
            listRef.current?.scrollToEnd({ animated: false });
        }
    }, [data, listMounted, isAtBottom]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 20;
        setIsAtBottom(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom);
    };

    const handleContentSizeChange = () => {
        setListMounted(true);
    };

    const goToBottom = () => {
        listRef.current?.scrollToEnd({ animated: true });
    };

    return { listRef, isAtBottom, listMounted, handleScroll, handleContentSizeChange, goToBottom };
}