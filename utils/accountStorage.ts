import * as SecureStore from "expo-secure-store";
import { Account } from "@/types/account";

const ACCOUNT_IDS_KEY = "user_account_ids";
const ACCOUNT_PREFIX = "user_account_";
const LAST_ACCOUNT_KEY = "last_account_id";

const getAccountKeys = async (): Promise<number[]> => {
    const keys = await SecureStore.getItemAsync(ACCOUNT_IDS_KEY);
    return keys ? JSON.parse(keys) : [];
};

const saveAccountKeys = async (keys: number[]) => {
    await SecureStore.setItemAsync(ACCOUNT_IDS_KEY, JSON.stringify(keys));
};

export const getAccount = async (id: number): Promise<Account | null> => {
    const account = await SecureStore.getItemAsync(ACCOUNT_PREFIX + String(id));
    return account ? JSON.parse(account) : null;
};

export const getAccounts = async (): Promise<Account[]> => {
    const keys = await getAccountKeys();
    const accounts = await Promise.all(
        keys.map(async key => {
            return await getAccount(key);
        })
    );

    // Remove any null accounts
    return accounts.filter((account): account is Account => account !== null);
};

export const storeAccount = async (newAccount: Account) => {
    const keys = await getAccountKeys();

    const id = Math.max(...keys, 0) + 1;
    newAccount.id = id;

    await SecureStore.setItemAsync(ACCOUNT_PREFIX + String(id), JSON.stringify(newAccount));

    keys.push(id);
    await saveAccountKeys(keys);

    await setLastAccountId(id);
};

export const updateAccount = async (updatedAccount: Account) => {
    const keys = await getAccountKeys();

    if (updatedAccount.id === undefined) {
        throw new Error("Account ID is undefined");
    }

    if (!keys.includes(updatedAccount.id)) {
        throw new Error("Account not found");
    }

    await SecureStore.setItemAsync(ACCOUNT_PREFIX + String(updatedAccount.id), JSON.stringify(updatedAccount));
};

export const removeAccount = async (id: number) => {
    const keys = await getAccountKeys();

    if (!keys.includes(id)) {
        throw new Error("Account not found");
    }

    await SecureStore.deleteItemAsync(ACCOUNT_PREFIX + String(id));

    const newKeys = keys.filter(k => k !== id);
    await saveAccountKeys(newKeys);
};

export const getLastAccountId = async (): Promise<number | null> => {
    const id = await SecureStore.getItemAsync(LAST_ACCOUNT_KEY);
    return id ? parseInt(id) : null;
};

export const setLastAccountId = async (id: number) => {
    await SecureStore.setItemAsync(LAST_ACCOUNT_KEY, String(id));
};