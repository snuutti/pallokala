import { createContext, useContext, useState, ReactNode, ComponentProps } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import AlertModal, { AlertModalOptions } from "@/components/modal/AlertModal";
import PromptModal, { PromptModalOptions } from "@/components/modal/PromptModal";
import ListModal from "@/components/modal/ListModal";
import ColorPickerModal from "@/components/modal/ColorPickerModal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ModalContextType = {
    createModal: (
        content: ReactNode,
        options?: ModalOptions
    ) => string;
    createAlertModal: (
        title?: string,
        message?: string,
        buttons?: ModalButton[],
        options?: ModalOptions & AlertModalOptions
    ) => string;
    createMarkdownAlertModal: (
        title?: string,
        markdown?: string,
        buttons?: ModalButton[],
        options?: ModalOptions
    ) => string;
    createPromptModal: (
        title?: string,
        options?: PromptModalOptions & ModalOptions,
        buttons?: PromptModalButton[]
    ) => string;
    createListModal: (items: ListModalButton[]) => string;
    createColorPickerModal: (
        title?: string,
        defaultColor?: string,
        onColorSelected?: (color: string) => void,
        options?: ModalOptions
    ) => string;
    closeModal: (id: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

type ModalProviderProps = {
    children: ReactNode;
};

type ModalItem = {
    id: string;
    content: ReactNode;
    options: ModalOptions;
};

export type ModalOptions = {
    onClose?: () => void;
    closable?: boolean;
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

export type ListModalButton = ModalButton & {
    selected?: boolean;
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [modals, setModals] = useState<ModalItem[]>([]);

    const createModal = (
        content: ReactNode,
        options: ModalOptions = {}
    ) => {
        const id = Math.random().toString(36);
        setModals((prevModals) => [...prevModals, { id, content, options }]);
        return id;
    };

    const createAlertModal = (
        title?: string,
        message?: string,
        buttons?: ModalButton[],
        options?: ModalOptions & AlertModalOptions
    ) => {
        return createModal(
            <AlertModal
                title={title}
                message={message}
                options={options}
                buttons={buttons}
            />,
            options
        );
    };

    const createMarkdownAlertModal = (
        title?: string,
        markdown?: string,
        buttons?: ModalButton[],
        options?: ModalOptions
    ) => {
        return createModal(
            <AlertModal
                title={title}
                markdown={markdown}
                buttons={buttons}
            />,
            options
        );
    };

    const createPromptModal = (
        title?: string,
        options?: PromptModalOptions & ModalOptions,
        buttons?: PromptModalButton[]
    ) => {
        return createModal(
            <PromptModal
                title={title}
                options={options}
                buttons={buttons}
            />,
            options
        );
    };

    const createListModal = (items: ListModalButton[]) => {
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
        options?: ModalOptions
    ) => {
        return createModal(
            <ColorPickerModal
                title={title}
                defaultColor={defaultColor}
                onColorSelected={onColorSelected}
            />,
            options
        );
    }

    const closeModal = (id: string) => {
        setModals((prevModals) => {
            const modal = prevModals.find((modal) => modal.id === id);
            modal?.options.onClose?.();
            return prevModals.filter((modal) => modal.id !== id);
        });
    };

    return (
        <ModalContext.Provider value={{
            createModal,
            createAlertModal,
            createMarkdownAlertModal,
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
                    closable={modal?.options.closable}
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