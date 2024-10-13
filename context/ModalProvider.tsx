import { createContext, useContext, useState, ReactNode, ComponentProps } from "react";
import { KeyboardTypeOptions } from "react-native";
import ModalWrapper from "@/components/modal/ModalWrapper";
import AlertModal from "@/components/modal/AlertModal";
import PromptModal from "@/components/modal/PromptModal";
import ListModal from "@/components/modal/ListModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ModalContextType = {
    createModal: (
        content: ReactNode,
        onClose?: () => void
    ) => string;
    createAlertModal: (
        title?: string,
        message?: string,
        buttons?: ModalButton[],
        onClose?: () => void
    ) => string;
    createPromptModal: (
        title?: string,
        placeholder?: string,
        inputType?: KeyboardTypeOptions,
        buttons?: PromptModalButton[],
        onClose?: () => void
    ) => string;
    createListModal: (items: ModalButton[]) => string;
    closeModal: (id: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalProviderProps = {
    children: ReactNode;
};

type ModalItem = {
    id: string;
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
        onClose?: () => void
    ) => {
        const id = Math.random().toString(36);
        setModals((prevModals) => [...prevModals, { id, content, onClose }]);
        return id;
    };

    const createAlertModal = (
        title?: string,
        message?: string,
        buttons?: ModalButton[],
        onClose?: () => void
    ) => {
        return createModal(
            <AlertModal
                title={title}
                message={message}
                buttons={buttons}
            />,
            onClose
        );
    };

    const createPromptModal = (
        title?: string,
        placeholder?: string,
        inputType?: KeyboardTypeOptions,
        buttons?: PromptModalButton[],
        onClose?: () => void
    ) => {
        return createModal(
            <PromptModal
                title={title}
                placeholder={placeholder}
                inputType={inputType}
                buttons={buttons}
            />,
            onClose
        );
    };

    const createListModal = (items: ModalButton[]) => {
        return createModal(
            <ListModal
                items={items}
            />
        );
    };

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
            closeModal
        }}>
            {children}
            {modals.map((modal) => (
                <ModalWrapper
                    key={modal.id}
                    id={modal.id}
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