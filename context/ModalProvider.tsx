import { createContext, useContext, useState, ReactNode, ComponentProps } from "react";
import { KeyboardTypeOptions } from "react-native";
import ModalWrapper from "@/components/modal/ModalWrapper";
import AlertModal from "@/components/modal/AlertModal";
import PromptModal from "@/components/modal/PromptModal";
import ListModal from "@/components/modal/ListModal";
import ColorPickerModal from "@/components/modal/ColorPickerModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ModalContextType = {
    createModal: (
        content: ReactNode,
        onClose?: () => void,
        closable?: boolean
    ) => string;
    createAlertModal: (
        title?: string,
        message?: string,
        buttons?: ModalButton[],
        onClose?: () => void,
        closable?: boolean
    ) => string;
    createPromptModal: (
        title?: string,
        placeholder?: string,
        inputType?: KeyboardTypeOptions,
        buttons?: PromptModalButton[],
        onClose?: () => void,
        closable?: boolean
    ) => string;
    createListModal: (items: ModalButton[]) => string;
    createColorPickerModal: (
        title?: string,
        defaultColor?: string,
        onColorSelected?: (color: string) => void,
        onClose?: () => void
    ) => string;
    closeModal: (id: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalProviderProps = {
    children: ReactNode;
};

type ModalItem = {
    id: string;
    closable?: boolean;
    content: ReactNode;
    onClose?: () => void;
};

export type ModalButton = {
    text: string;
    icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
    style?: "danger" | "success";
    onPress?: () => void;
};

export type PromptModalButton = Omit<ModalButton, "onPress"> & {
    onPress?: (value: string) => void;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [modals, setModals] = useState<ModalItem[]>([]);

    const createModal = (
        content: ReactNode,
        onClose?: () => void,
        closable = true
    ) => {
        const id = Math.random().toString(36);
        setModals((prevModals) => [...prevModals, { id, closable, content, onClose }]);
        return id;
    };

    const createAlertModal = (
        title?: string,
        message?: string,
        buttons?: ModalButton[],
        onClose?: () => void,
        closable?: boolean
    ) => {
        return createModal(
            <AlertModal
                title={title}
                message={message}
                buttons={buttons}
            />,
            onClose,
            closable
        );
    };

    const createPromptModal = (
        title?: string,
        placeholder?: string,
        inputType?: KeyboardTypeOptions,
        buttons?: PromptModalButton[],
        onClose?: () => void,
        closable?: boolean
    ) => {
        return createModal(
            <PromptModal
                title={title}
                placeholder={placeholder}
                inputType={inputType}
                buttons={buttons}
            />,
            onClose,
            closable
        );
    };

    const createListModal = (items: ModalButton[]) => {
        return createModal(
            <ListModal
                items={items}
            />
        );
    };

    const createColorPickerModal = (
        title?: string,
        defaultColor?: string,
        onColorSelected?: (color: string) => void,
        onClose?: () => void
    ) => {
        return createModal(
            <ColorPickerModal
                title={title}
                defaultColor={defaultColor}
                onColorSelected={onColorSelected}
            />,
            onClose
        );
    }

    const closeModal = (id: string) => {
        setModals((prevModals) => {
            const modal = prevModals.find((modal) => modal.id === id);
            modal?.onClose?.();
            return prevModals.filter((modal) => modal.id !== id);
        });
    };

    return (
        <ModalContext.Provider value={{
            createModal,
            createAlertModal,
            createPromptModal,
            createListModal,
            createColorPickerModal,
            closeModal
        }}>
            {children}
            {modals.map((modal) => (
                <ModalWrapper
                    key={modal.id}
                    id={modal.id}
                    closable={modal.closable}
                    content={modal.content}
                    closeModal={closeModal}
                />
            ))}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
};