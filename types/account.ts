export type BaseAccount = {
    id?: number;
    serverAddress: string;
    type: "oauth" | "email";
};

export type OAuthAccount = BaseAccount & {
    type: "oauth";
    clientId: string;
    clientSecret: string;
};

export type EmailAccount = BaseAccount & {
    type: "email";
    email: string;
    password: string;
};

export type Account = OAuthAccount | EmailAccount;