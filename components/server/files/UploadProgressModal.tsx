import { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import ProgressBar from "@/components/ui/ProgressBar";
import { useStyle } from "@/hooks/useStyle";
import { Colors } from "@/constants/Colors";

export type UploadFile = {
    uri: string;
    name: string;
    path: string;
    size: number;
    progress: number;
};

export type UploadState = {
    total: number;
    files: UploadFile[];
};

type UploadProgressModalProps = {
    state: UploadState;
    uploadFile: (file: UploadFile, onUploadProgress: (event: ProgressEvent) => void) => Promise<void>;
    handleClose?: () => void;
};

export default function UploadProgressModal(props: UploadProgressModalProps) {
    const { t } = useTranslation();
    const { style } = useStyle(styling);
    const [state, setState] = useState<UploadState>(props.state);
    const currentRef = useRef(0);

    useEffect(() => {
        upload();
    }, []);

    const upload = async () => {
        try {
            for (let i = 0; i < state.files.length; i++) {
                currentRef.current = i;
                await props.uploadFile(state.files[i], onUploadProgress);
            }
        } finally {
            props.handleClose?.();
        }
    };

    const onUploadProgress = useCallback((event: ProgressEvent) => {
        setState((state) => {
            const newState = { ...state };
            const current = currentRef.current;
            newState.files[current].progress = Math.min(event.loaded, state.files[current].size);
            return newState;
        });
    }, []);

    return (
        <View style={style.container}>
            <Text style={style.title}>{t("files:UploadProgress")}</Text>

            <Text style={style.body}>{t("files:CurrentlyUploading", { current: currentRef.current + 1, total: state.total })}</Text>
            <Text style={style.body}>{state.files[currentRef.current].name}</Text>

            <ProgressBar
                max={state.files[currentRef.current].size}
                value={state.files[currentRef.current].progress}
                text={t("files:Current")}
            />

            <ProgressBar
                max={state.files.reduce((acc, file) => acc + file.size, 0)}
                value={state.files.reduce((acc, file) => acc + file.progress, 0)}
                text={t("files:Total")}
            />
        </View>
    );
}

function styling(colors: Colors) {
    return StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center"
        },
        title: {
            color: colors.text,
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10
        },
        body: {
            color: colors.text,
            fontSize: 16,
            marginBottom: 20,
            alignSelf: "flex-start"
        }
    });
}