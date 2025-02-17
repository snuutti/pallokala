import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useQuickAction } from "expo-quick-actions/hooks";
import { useApiClient } from "@/context/ApiClientProvider";
import { useModal } from "@/context/ModalProvider";
import { useQuickActionsStore } from "@/stores/useQuickActionsStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { resetAllStores } from "@/stores/useBoundStore";
import {
    getAccount,
    getAccounts,
    getLastAccountId,
    removeAccount,
    setLastAccountId,
    storeAccount,
    updateAccount
} from "@/utils/accountStorage";
import UnifiedSessionStore from "@/utils/sessionStore";
import MockApiClient from "@/utils/mockApiClient";
import { getPrivateInfoReplacer } from "@/utils/json";
import * as OTPAuth from "otpauth";
import { Account, OAuthAccount, EmailAccount } from "@/types/account";
import { User, ApiClient } from "pufferpanel";

type AccountContextType = {
    accounts: Account[];
    activeAccount: Account | null;
    user: User | null;
    otpRequired: boolean;
    loading: boolean;
    error: boolean;
    changeAccount: (account: Account) => Promise<void>;
    deleteAccount: (account: Account) => Promise<void>;
    addAccount: (account: Account) => Promise<[success: boolean, error?: string]>;
    submitOtp: (code: string) => Promise<void>;
    refreshSelf: () => Promise<void>;
};

export const AccountContext = createContext<AccountContextType | undefined>(undefined);

type AccountProviderProps = {
    children: ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
    const { t } = useTranslation();
    const action = useQuickAction();
    const { apiClient, config, sessionTimedOut, changeServer } = useApiClient();
    const { createAlertModal } = useModal();
    const setCurrentAction = useQuickActionsStore(state => state.setCurrentAction);
    const setThemeSettings = useSettingsStore(state => state.setThemeSettings);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activeAccount, setActiveAccount] = useState<Account | null>(null);
    const [newAccount, setNewAccount] = useState<Account | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [otpRequired, setOtpRequired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        loadAccounts();
    }, []);

    useEffect(() => {
        if (apiClient !== undefined || action) {
            return;
        }

        initialLogin(null);
    }, [apiClient, action]);

    useEffect(() => {
        if (!sessionTimedOut) {
            return;
        }

        console.log("Session timed out, reauthenticating");
        initialLogin(null);
    }, [sessionTimedOut]);

    useEffect(() => {
        if (!action) {
            return;
        }

        const accountId = action?.params?.accountId as number | null;
        if (accountId === null) {
            return;
        }

        const serverId = action!.params!.serverId as string;

        if (accountId === activeAccount?.id) {
            setCurrentAction({ serverId, accountId });
            return;
        }

        initialLogin(accountId).then(() => {
            setCurrentAction({ serverId, accountId });
        });
    }, [action]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (apiClient?.auth.isLoggedIn()) {
                try {
                    apiClient?.auth.reauth();
                } catch (e) {
                    console.error("Reauth failed", e);
                }
            }
        }, 1000 * 60 * 15);

        return () => clearInterval(interval);
    }, [apiClient]);

    useEffect(() => {
        if (!apiClient || !config || !activeAccount || !user) {
            return;
        }

        const updatedAccount = activeAccount;
        updatedAccount.nickname = user.username + " @ " + config.branding.name;

        updateAccount(updatedAccount).then(() => {
            setActiveAccount(updatedAccount);
            loadAccounts();
        });
    }, [apiClient, config, activeAccount, user]);

    const loadAccounts = () => {
        getAccounts().then(setAccounts);
    };

    const initialLogin = async (accountId: number | null) => {
        setLoading(true);

        let account: Account | null = null;

        if (accountId !== null) {
            account = await getAccount(accountId);
            console.log("Using app shortcut account", JSON.stringify(account, getPrivateInfoReplacer()));
        }

        if (account === null) {
            const lastAccountId = await getLastAccountId();
            if (lastAccountId !== null) {
                account = await getAccount(lastAccountId);
                console.log("Last account found", JSON.stringify(account, getPrivateInfoReplacer()));
            }
        }

        if (account === null) {
            const accounts = await getAccounts();
            if (accounts.length === 0) {
                console.log("No accounts found");
                router.replace("../(auth)/email");
                return;
            }

            account = accounts[0];
            console.log("Using first account", JSON.stringify(account, getPrivateInfoReplacer()));
        }

        if (account === null) {
            console.log("Account returned was null?");
            router.replace("../(auth)/email");
            return;
        }

        await changeAccount(account);
    };

    const changeAccount = async (account: Account) => {
        console.log("Switching to account", JSON.stringify(account, getPrivateInfoReplacer()));
        setLoading(true);
        setError(false);
        setActiveAccount(null);
        setNewAccount(account);
        setUser(null);
        setOtpRequired(false);

        resetAllStores();

        const apiClient = changeServer(account.serverAddress);

        try {
            let success = false;

            if (account.type === "oauth") {
                const oauthAccount = account as OAuthAccount;

                const result = await apiClient.auth.oauth(oauthAccount.clientId, oauthAccount.clientSecret);
                if (result) {
                    success = true;
                } else {
                    console.error("Login failed");
                }
            } else if (account.type === "email") {
                const emailAccount = account as EmailAccount;

                const result = await apiClient.auth.login(emailAccount.email, emailAccount.password);
                if (result === true) {
                    success = true;
                } else if (result === "otp") {
                    if (emailAccount.otpSecret) {
                        try {
                            const totp = new OTPAuth.TOTP({
                                secret: emailAccount.otpSecret
                            });

                            await apiClient.auth.loginOtp(totp.generate());
                            success = true;
                        } catch (e) {
                            console.error("OTP login failed", e);

                            setOtpRequired(true);

                            createAlertModal(
                                t("users:OtpNeeded"),
                                t("app:Auth.OtpSecretError"),
                                [
                                    {
                                        text: t("common:Close"),
                                        icon: "close"
                                    }
                                ]
                            );
                        }
                    } else {
                        setOtpRequired(true);
                    }
                } else {
                    console.error("Login failed");
                }
            }

            if (success) {
                await postLogin(apiClient, account);
            }
        } catch (e) {
            console.error("Login errored", e);
            setError(true);
        }

        setLoading(false);
    };

    const postLogin = async (apiClient: ApiClient, account: Account) => {
        setActiveAccount(account);
        router.replace("/");
        await setLastAccountId(account.id!);
        setUser(await apiClient.self.get());

        try {
            const settings = await apiClient.settings.getUserSettings();
            if (settings["themeSettings"]) {
                setThemeSettings(JSON.parse(settings["themeSettings"]));
            } else {
                setThemeSettings({});
            }
        } catch (e) {
            setThemeSettings({});
            console.error("Failed to get user settings", e);
        }

        await apiClient.auth.reauth();
        setNewAccount(null);
    };

    const deleteAccount = async (account: Account) => {
        await removeAccount(account.id!);
        loadAccounts();

        if (activeAccount?.id === account.id) {
            setLoading(true);
            setActiveAccount(null);
            setUser(null);

            await initialLogin(null);
        }
    };

    const addAccount = async (account: Account): Promise<[success: boolean, error?: string]> => {
        let apiClient: ApiClient;
        if (account.serverAddress === "http://pallokala.test") {
            apiClient = new MockApiClient(account.serverAddress, new UnifiedSessionStore());
        } else {
            apiClient = new ApiClient(account.serverAddress, new UnifiedSessionStore());
        }

        let success = false;
        let tryVersion = true;

        if (account.type === "oauth") {
            const oauthAccount = account as OAuthAccount;
            success = await apiClient.auth.oauth(oauthAccount.clientId, oauthAccount.clientSecret);
        } else if (account.type === "email") {
            const emailAccount = account as EmailAccount;
            const result = await apiClient.auth.login(emailAccount.email, emailAccount.password);
            success = result === true || result === "otp";
            tryVersion = result === true;
        }

        if (success && tryVersion) {
            try {
                await apiClient.auth.reauth();
            } catch {
                return [false, t("app:Auth.UnsupportedVersion")];
            }
        }

        if (success) {
            await storeAccount(account);
            loadAccounts();
            await changeAccount(account);
            return [true];
        }

        return [false];
    };

    const submitOtp = async (code: string) => {
        await apiClient!.auth.loginOtp(code);
        await postLogin(apiClient!, newAccount!);
        setOtpRequired(false);
    };

    const refreshSelf = async () => {
        if (!apiClient || !activeAccount) {
            return;
        }

        setUser(await apiClient.self.get());
    };

    return (
        <AccountContext.Provider value={{ accounts, activeAccount, user, otpRequired, loading, error, changeAccount, deleteAccount, addAccount, submitOtp, refreshSelf }}>
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