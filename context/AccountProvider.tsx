import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { router } from "expo-router";
import { useApiClient } from "@/context/ApiClientProvider";
import {
    getAccount,
    getAccounts,
    getLastAccountId,
    removeAccount,
    setLastAccountId,
    storeAccount
} from "@/utils/accountStorage";
import { Account, OAuthAccount } from "@/types/account";
import { User } from "pufferpanel";

type AccountContextType = {
    accounts: Account[];
    activeAccount: Account | null;
    user: User | null;
    loading: boolean;
    changeAccount: (account: Account) => Promise<void>;
    deleteAccount: (account: Account) => Promise<void>;
    addAccount: (account: Account) => Promise<boolean>;
};

export const AccountContext = createContext<AccountContextType | undefined>(undefined);

type AccountProviderProps = {
    children: ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
    const { apiClient, changeServer } = useApiClient();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccount, setActiveAccount] = useState<Account | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAccounts();
    }, []);

    useEffect(() => {
        if (apiClient !== undefined) {
            return;
        }

        initialLogin();
    }, [apiClient]);

    const loadAccounts = () => {
        getAccounts().then(setAccounts);
    };

    const initialLogin = async () => {
        setLoading(true);

        const lastAccountId = await getLastAccountId();
        let account: Account | null = null;

        if (lastAccountId !== null) {
            account = await getAccount(lastAccountId);
            console.log("Last account found", account);
        }

        if (account === null) {
            const accounts = await getAccounts();
            if (accounts.length === 0) {
                console.log("No accounts found");
                router.replace("../login");
                return;
            }

            account = accounts[0];
            console.log("Using first account", account);
        }

        if (account === null) {
            console.log("Account returned was null?");
            router.replace("../login");
            return;
        }

        await changeAccount(account);
    };

    const changeAccount = async (account: Account) => {
        console.log("Switching to account", account);
        setLoading(true);
        setUser(null);

        const apiClient = changeServer(account.serverAddress);
        const oauthAccount = account as OAuthAccount; // TODO: handle email/password login

        const result = await apiClient.auth.oauth(oauthAccount.clientId, oauthAccount.clientSecret);
        if (result) {
            setActiveAccount(account);
            router.replace("/");
            await setLastAccountId(account.id!);

            setUser(await apiClient.self.get());
        } else {
            console.error("Login failed");
        }

        setLoading(false);
    };

    const deleteAccount = async (account: Account) => {
        await removeAccount(account.id!);
        loadAccounts();

        if (activeAccount?.id === account.id) {
            setLoading(true);
            setActiveAccount(null);
            setUser(null);

            await initialLogin();
        }
    };

    const addAccount = async (account: Account): Promise<boolean> => {
        const apiClient = changeServer(account.serverAddress);
        const oauthAccount = account as OAuthAccount; // TODO: handle email/password login

        const result = await apiClient.auth.oauth(oauthAccount.clientId, oauthAccount.clientSecret);
        if (result) {
            await storeAccount(account);
            loadAccounts();
            await changeAccount(account);
            return true;
        }

        return false;
    };

    return (
        <AccountContext.Provider value={{ accounts, activeAccount, user, loading, changeAccount, deleteAccount, addAccount }}>
            {children}
        </AccountContext.Provider>
    );
}

export const useAccount = () => {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error("useAccount must be used within an AccountProvider");
    }

    return context;
}