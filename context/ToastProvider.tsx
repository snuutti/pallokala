import { createContext, useContext, useState, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import Toast, { ToastType } from "@/components/Toast";

type ToastContextType = {
    showToast: (type: ToastType, message: string, onPress?: () => void) => void;
    showSuccess: (message: string, onPress?: () => void) => void;
    showError: (message: string, onPress?: () => void) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastProviderProps = {
    children: ReactNode;
};

type ToastItem = {
    id: string;
    type: ToastType;
    message: string;
    onPress?: () => void;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (type: ToastType, message: string, onPress?: () => void) => {
        const id = Math.random().toString(36);
        setToasts((prevToasts) => [...prevToasts, { id, type, message, onPress }]);
    };

    const showSuccess = (message: string, onPress?: () => void) => {
        showToast("success", message, onPress);
    };

    const showError = (message: string, onPress?: () => void) => {
        showToast("error", message, onPress);
    };

    const dismissToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
            {children}
            <View style={styles.wrapper}>
                {toasts.map((toast) => (
                    <Animated.View key={toast.id} layout={LinearTransition.springify()}>
                        <Toast
                            id={toast.id}
                            type={toast.type}
                            message={toast.message}
                            onDismiss={dismissToast}
                            onPress={toast.onPress}
                        />
                    </Animated.View>
                ))}
            </View>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 20
    }
});
