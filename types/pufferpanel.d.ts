declare module "pufferpanel" {
    import ax from "axios";
    import { WebSocket } from "node:http";

    export class ApiClient {
        public auth: AuthApi;
        public self: SelfApi;
        public server: ServerApi;
        public node: NodeApi;
        public user: UserApi;
        public template: TemplateApi;
        public settings: SettingsApi;

        constructor(
            host: string,
            sessionStore?: SessionStore = new InMemorySessionStore(),
            errorHandler?: (result: ErrorHandlerResult) => void,
            axios?: AxiosInstance = ax.create()
        );

        async head(url: string, params?: any, headers?: any, options?: any): Promise<any>;

        async get(url: string, params?: any, headers?: any, options?: any): Promise<any>;

        async post(url: string, data: any, params?: any, headers?: any, options?: any): Promise<any>;

        async put(url: string, data: any, params?: any, headers?: any, options?: any): Promise<any>;

        async delete(url: string, params?: any, headers?: any, options?: any): Promise<any>;

        async getConfig(): Promise<EditableConfigSettings>;

        async getTheme(name: string): Promise<ArrayBuffer>;
    }

    export type ErrorHandlerResult = {
        status: number;
        statusText: string;
        response: any;
        request: any;
        code: string;
        msg: string;
    };

    export type EditableConfigSettings = {
        branding: BrandingConfig;
        registrationEnabled: boolean;
        themes: ThemeConfig;
    };

    export type BrandingConfig = {
        name: string;
    };

    export type ThemeConfig = {
        active: string;
        available: string[];
        settings: Record<string, any>;
    };

    export class AuthApi {
        constructor(
            api: ApiClient,
            sessionStore: SessionStore
        );

        async oauth(clientId: string, clientSecret: string): Promise<boolean>;

        async login(email: string, password: string): Promise<"otp" | boolean>;

        async register(username: string, email: string, password: string): Promise<boolean>;

        async reauth(): Promise<void>;

        getToken(): string;

        isLoggedIn(): boolean;

        hasScope(scope: string): boolean;

        async logout(): Promise<void>;
    }

    export class SelfApi {
        constructor(api: ApiClient);

        async get(): Promise<User>;

        async updateDetails(username: string, email: string, password: string): Promise<boolean>;

        async changePassword(password: string, newPassword: string): Promise<boolean>;

        async isOtpEnabled(): Promise<boolean>;

        async startOtpEnroll(): Promise<OtpEnrollResponse>;

        async validateOtpEnroll(token: string): Promise<boolean>;

        async disableOtp(token: string): Promise<boolean>;

        // TODO: missing stuff
    }

    export type User = {
        id?: number;
        username?: string;
        email?: string;
        password?: string;
        newPassword?: string;
    };

    export type OtpEnrollResponse = {
        secret: string;
        img: string;
    };

    export class UserApi {
        constructor(api: ApiClient);

        async list(page: number = 1): Promise<UserSearchResponse>;

        async search(name: string, limit: number): Promise<User[]>;

        async searchEmail(email: string, limit: number): Promise<User[]>;

        async create(username: string, email: string, password: string): Promise<number>;

        async get(id: number): Promise<User>;

        async getPermissions(id: number): Promise<string[]>;

        async update(id: number, user: User): Promise<boolean>;

        async updatePermissions(id: number, permissions: PermissionView): Promise<boolean>;

        async delete(id: number): Promise<boolean>;
    }

    export type UserSearchResponse = Metadata & {
        users: User[];
    };

    export type PermissionView = {
        scopes: string[];
    };

    export type Metadata = {
        paging: Paging;
    };

    export type Paging = {
        page: number;
        pageSize: number;
        maxSize: number;
        total: number;
    };

    export class NodeApi {
        constructor(api: ApiClient);

        fixNode(node: Node): Node;

        async list(): Promise<Node[]>;

        async get(id: number): Promise<Node>;

        async deployment(id: number): Promise<NodeDeployment>;

        async features(id: number): Promise<NodeFeatures>;

        async create(node: Node): Promise<number>;

        async update(id: number, node: Node): Promise<boolean>;

        async delete(id: number): Promise<boolean>;
    }

    export type Node = {
        id: number;
        name?: string;
        publicHost?: string;
        privateHost?: string;
        publicPort?: number;
        privatePort?: number;
        sftpPort?: number;
        isLocal: boolean;
    };

    export type NodeDeployment = {
        clientId: string;
        clientSecret: string;
        publicKey: string;
    };

    export type NodeFeatures = {
        features: string[];
        environments: string[];
        os: string;
        arch: string;
    };

    export class ServerApi {
        constructor(api: ApiClient);

        async create(data: ServerCreation): Promise<string>;

        async list(page: number = 1, pageSize?: number, name?: string): Promise<ServerSearchResponse>;

        async get(id: string, withSocket?: boolean = true): Promise<Server | ServerData>;

        async getStatus(id: string): Promise<ServerStatus>;

        async getStats(id: string): Promise<ServerStats>;

        async getQuery(id: string): Promise<Record<string, any>>;

        async canQuery(id: string): Promise<boolean>;

        async action(id: string, action: ServerAction, wait?: boolean = false): Promise<boolean>;

        async start(id: string, wait?: boolean = false): Promise<boolean>;

        async stop(id: string, wait?: boolean = false): Promise<boolean>;

        async kill(id: string, wait?: boolean = false): Promise<boolean>;

        async install(id: string, wait?: boolean = false): Promise<boolean>;

        async reload(id: string): Promise<boolean>;

        async sendCommand(id: string, command: string): Promise<boolean>;

        async getConsole(id: string, time?: number = 0): Promise<ServerLogs>;

        async updateName(id: string, name: string): Promise<boolean>;

        async getFlags(id: string): Promise<ServerFlags>;

        async setFlags(id: string, flags: ServerFlags): Promise<boolean>;

        // TODO: definition, data

        async getUsers(id: string): Promise<UserPermissionsView[]>;

        async getUser(id: string, email: string): Promise<UserPermissionsView[]>;

        async updateUser(id: string, user: UserPermissionsView): Promise<boolean>;

        async deleteUser(id: string, email: string): Promise<boolean>;

        getFileUrl(id: string, path: string): string;

        async getFile(id: string, path?: string = "", raw?: boolean = false): Promise<FileDesc[] | string>;

        async fileExists(id: string, path: string): Promise<"file" | "folder" | false>;

        async uploadFile(id: string, path: string, content: any, onUploadProgress?: (progressEvent: any) => void): Promise<boolean>;

        async createFolder(id: string, path: string): Promise<boolean>;

        async archiveFile(id: string, destination: string, files: string | string[]): Promise<boolean>;

        async extractFile(id: string, path: string, destination: string): Promise<boolean>;

        async deleteFile(id: string, path: string): Promise<boolean>;

        async delete(id: string): Promise<boolean>;
    }

    export type ServerSearchResponse = Metadata & {
        servers: ServerView[];
    };

    export type ServerStatus = "installing" | "online" | "offline";

    export type ServerStats = {
        cpu: number;
        memory: number;
        jvm?: JvmStats;
    };

    export type JvmStats = {
        heapUsed: number;
        heapTotal: number;
        metaspaceUsed: number;
        metaspaceTotal: number;
    };

    export type ServerAction = "start" | "stop" | "kill" | "install";

    export type ServerLogs = {
        epoch?: number; // todo: can this ever be undefined?
        logs: string;
    };

    export type ServerFlags = {
        autoStart?: boolean;
        autoRestartOnCrash?: boolean;
        autoRestartOnGraceful?: boolean;
    };

    export type UserPermissionsView = {
        username?: string;
        email: string;
        scopes: string[];
    };

    export type FileDesc = {
        name: string;
        modifyTime?: number;
        size?: number;
        isFile: boolean;
        extension?: string;
    };

    export class Server {
        public readyState: WebSocket.CONNECTING | WebSocket.OPEN | WebSocket.CLOSING | WebSocket.CLOSED;

        public id: string;
        public ip: string;
        public name: string;
        public node: string;
        public port: number;
        public type: string;

        constructor(api: ApiClient, serverData: ServerData);

        hasScope(scope: string): boolean;

        on(event: string, cb: (data: any) => void): () => void;

        emit(event: string, data: any): void;

        startTask(f: () => void, interval: number): NodeJS.Timeout;

        stopTask(ref: NodeJS.Timeout): void;

        needsPolling(): boolean;

        async getStatus(): Promise<ServerStatus>;

        async getStats(): Promise<ServerStats>;

        async getQuery(): Promise<Record<string, any>>;

        async canQuery(): Promise<boolean>;

        async start(): Promise<boolean>;

        async stop(): Promise<boolean>;

        async kill(): Promise<boolean>;

        async install(): Promise<boolean>;

        async reload(): Promise<boolean>;

        async sendCommand(command: string): Promise<boolean>;

        async getConsole(since?: number = 0): Promise<ServerLogs>;

        async updateName(name: string): Promise<boolean>;

        async getFlags(): Promise<ServerFlags>;

        async setFlags(flags: ServerFlags): Promise<boolean>;

        // TODO: definition, data

        async delete(): Promise<boolean>;

        async getUsers(): Promise<UserPermissionsView[]>;

        async updateUser(user: UserPermissionsView): Promise<boolean>;

        async deleteUser(email: string): Promise<boolean>;

        getFileUrl(path: string): string;

        async getFile(path?: string = "", raw?: boolean = false): Promise<FileDesc[] | string>;

        async fileExists(path: string): Promise<"file" | "folder" | false>;

        async uploadFile(path: string, content: any, onUploadProgress?: (progressEvent: any) => void): Promise<boolean>;

        async createFolder(path: string): Promise<boolean>;

        async archiveFile(destination: string, files: string | string[]): Promise<boolean>;

        async extractFile(path: string, destination: string): Promise<boolean>;

        async deleteFile(path: string): Promise<boolean>;

        closeSocket(): void;
    }

    export type ServerData = {
        server: ServerView;
        permissions: {
            scopes: string[];
        };
    };

    export type ServerView = {
        id?: string;
        name?: string;
        nodeId?: number;
        node?: Node;
        data?: any;
        users?: ServerUser[];
        ip?: string;
        port?: number;
        type: string;
        icon?: string;
        canGetStatus?: boolean;
    };

    export type ServerUser = {
        username: string;
        scopes: string[];
    };

    export class TemplateApi {
        constructor(api: ApiClient);

        async listRepos(): Promise<TemplateRepo[]>;

        async listRepoTemplates(repo: number): Promise<Template[]>;

        async listAllTemplates(): Promise<AllTemplatesResponse>;

        async get(repo: number, name: string): Promise<Template>;

        async exists(repo: number, name: string): Promise<boolean>;

        async save(name: string, template: Template): Promise<boolean>;

        async delete(name: string): Promise<boolean>;

        async getRepo(repo: number): Promise<Template[]>;

        async saveRepo(repo: number, config: TemplateRepo): Promise<boolean>;

        async deleteRepo(repo: number): Promise<boolean>;
    }

    export type TemplateRepo = {
        id: number;
        name: string;
        url: string;
        branch: string;
        isLocal: boolean;
    };

    export type Template = {
        // TODO: missing stuff
        type: string;
        display?: string;
        name: string;
        readme?: string;
    };

    export type AllTemplatesResponse = {
        name: string;
        id: number;
        templates: Template[];
    };

    export class SettingsApi {
        constructor(api: ApiClient);

        async get(key: string): Promise<any>;

        async set(data: Record<string, any>): Promise<any>;

        async getUserSettings(): Promise<Array<{ key: string, value: any }>>;

        async setUserSetting(key: string, value: any): Promise<boolean>;
    }

    export class SessionStore {
        setToken(token: string): void;

        setScopes(scopes: string[]): void;

        getToken(): string | null;

        getScopes(): string[] | null;

        isLoggedIn(): boolean;

        deleteSession(): void;
    }

    export type CookieOptions = {
        domain: string;
        path: string;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
    };

    export class InMemorySessionStore extends SessionStore {
    }

    export class ClientCookieSessionStore extends SessionStore {
        constructor(options?: CookieOptions);
    }

    export class ServerCookieSessionStore extends SessionStore {
        constructor(options?: CookieOptions);
    }
}