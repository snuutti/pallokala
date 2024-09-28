import { ReactNode, createContext, useContext, useRef, useCallback } from "react";
import { SwitchServerModal, SwitchServerModalRef } from "@/components/SwitchServerModal";

type SwitchServerModalContextType = {
    present: () => void;
};

export const SwitchServerModalContext = createContext<SwitchServerModalContextType | undefined>(undefined);

type SwitchServerModalProviderProps = {
    children: ReactNode;
};

export const SwitchServerModalProvider = ({ children }: SwitchServerModalProviderProps) => {
    const switchServerModalRef = useRef<SwitchServerModalRef>(null);

    const present = useCallback(() => {
        switchServerModalRef.current?.present();
    }, []);

    return (
        <SwitchServerModalContext.Provider value={{ present }}>
            {children}
            <SwitchServerModal ref={switchServerModalRef} />
        </SwitchServerModalContext.Provider>
    );
}

export const useSwitchServerModal = () => {
    const context = useContext(SwitchServerModalContext);
    if (!context) {
        throw new Error("useSwitchServerModal must be used within a SwitchServerModalProvider");
    }

    return context;
}