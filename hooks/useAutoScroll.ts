import { useRef, useState, useEffect } from "react";
import { LegendListRef } from "@legendapp/list";

type AutoScrollHookProps<T> = {
    data: T[];
    inverted?: boolean;
};

export default function useAutoScroll<T>({ data, inverted }: AutoScrollHookProps<T>) {
    const listRef = useRef<LegendListRef>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [listMounted, setListMounted] = useState(false);

    useEffect(() => {
        if (listMounted && isAtBottom && data.length > 0 && !inverted) {
            listRef.current?.scrollToEnd({ animated: false });
        }
    }, [data, listMounted, isAtBottom]);

    const handleScroll = () => {
        setIsAtBottom(listRef.current?.getState().isAtEnd || false);
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