import {
    ApiClient,
    AuthApi,
    SelfApi,
    ServerApi,
    NodeApi,
    UserApi,
    SettingsApi,
    SessionStore,
    EditableConfigSettings,
    OAuthClient,
    OtpEnrollResponse,
    User,
    FileDesc,
    Backup,
    Server,
    ServerAction,
    ServerData,
    ServerDefinition,
    ServerFlags,
    ServerLogs,
    ServerCreation,
    ServerSearchResponse,
    ServerSettings,
    ServerStats,
    ServerStatus,
    UserPermissionsView,
    Node,
    NodeDeployment,
    NodeFeatures,
    PermissionView,
    UserSearchResponse
} from "pufferpanel";

export default class MockApiClient extends ApiClient {
    constructor(host: string, sessionStore: SessionStore) {
        super(host, sessionStore);

        this.auth = new MockAuthApi();
        this.self = new MockSelfApi();
        this.server = new MockServerApi();
        this.node = new MockNodeApi();
        this.user = new MockUserApi();
        this.settings = new MockSettingsApi();
    }

    async head(url: string, params?: any, headers?: any, options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async get(url: string, params?: any, headers?: any, options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async post(url: string, data: any, params?: any, headers?: any, options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async put(url: string, data: any, params?: any, headers?: any, options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async delete(url: string, params?: any, headers?: any, options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getConfig(): Promise<EditableConfigSettings> {
        return Promise.resolve({
            branding: {
                name: "Pallokala Test Mode"
            },
            registrationEnabled: false,
            themes: {
                active: "",
                available: [],
                settings: {}
            }
        });
    }

    async getTheme(name: string): Promise<ArrayBuffer> {
        throw new Error("Method not implemented.");
    }
}

class MockAuthApi implements AuthApi {
    oauth(clientId: string, clientSecret: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async login(email: string, password: string): Promise<"otp" | boolean> {
        return Promise.resolve(true);
    }

    loginOtp(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    register(username: string, email: string, password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    reauth(): Promise<void> {
        return Promise.resolve();
    }

    getToken(): string {
        throw new Error("Method not implemented.");
    }

    isLoggedIn(): boolean {
        return true;
    }

    hasScope(scope: string): boolean {
        // "To review your app, Google Play must be able to access all parts of it."
        // I'll add these if they ask for them, but from experience I doubt they'll even launch the app once.
        return scope !== "server.create" && scope !== "nodes.create" && scope !== "users.info.edit"
            && scope !== "templates.view" && scope !== "self.edit" && scope !== "self.clients";
    }

    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

class MockSelfApi implements SelfApi {
    get(): Promise<User> {
        return Promise.resolve({
            id: 1,
            username: "testuser",
            email: "test@pallokala.test",
            otpEnabled: false
        });
    }

    updateDetails(username: string, email: string, password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    changePassword(password: string, newPassword: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    isOtpEnabled(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    startOtpEnroll(): Promise<OtpEnrollResponse> {
        throw new Error("Method not implemented.");
    }

    validateOtpEnroll(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    disableOtp(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getSettings(): Promise<Record<string, string>> {
        throw new Error("Method not implemented.");
    }

    updateSetting(key: string, value: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getOAuthClients(): Promise<OAuthClient[]> {
        throw new Error("Method not implemented.");
    }

    createOAuthClient(name: string, description: string): Promise<OAuthClient> {
        throw new Error("Method not implemented.");
    }

    deleteOAuthClient(clientId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

class MockServerApi implements ServerApi {
    create(data: ServerCreation): Promise<string> {
        throw new Error("Method not implemented.");
    }

    list(page?: number, pageSize?: number | undefined, name?: string | undefined): Promise<ServerSearchResponse> {
        return Promise.resolve({
            paging: {
                page: 1,
                pageSize: 20,
                maxSize: 100,
                total: 1
            },
            servers: [
                {
                    id: "123abc",
                    name: "Test Server",
                    node: {
                        id: 0,
                        name: "LocalNode",
                        publicHost: "pallokala.test",
                        publicPort: 443,
                        sftpPort: 5657,
                        isLocal: true
                    },
                    ip: "0.0.0.0",
                    port: 25565,
                    type: "minecraft-java",
                    icon: "minecraft-java",
                    canGetStatus: true
                }
            ]
        });
    }

    get(id: string, withSocket?: boolean | undefined): Promise<Server | ServerData> {
        return Promise.resolve(new MockServer());
    }

    getStatus(id: string): Promise<ServerStatus> {
        return Promise.resolve("online");
    }

    getStats(id: string): Promise<ServerStats> {
        throw new Error("Method not implemented.");
    }

    getQuery(id: string): Promise<Record<string, any>> {
        throw new Error("Method not implemented.");
    }

    canQuery(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    action(id: string, action: ServerAction, wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    start(id: string, wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    stop(id: string, wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    kill(id: string, wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    install(id: string, wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    reload(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    sendCommand(id: string, command: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getConsole(id: string, time?: number | undefined): Promise<ServerLogs> {
        throw new Error("Method not implemented.");
    }

    updateName(id: string, name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getFlags(id: string): Promise<ServerFlags> {
        throw new Error("Method not implemented.");
    }

    setFlags(id: string, flags: ServerFlags): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getDefinition(id: string): Promise<ServerDefinition> {
        throw new Error("Method not implemented.");
    }

    updateDefinition(id: string, data: ServerDefinition): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getData(id: string): Promise<ServerSettings> {
        throw new Error("Method not implemented.");
    }

    adminUpdateData(id: string, data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updateData(id: string, data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getUsers(id: string): Promise<UserPermissionsView[]> {
        throw new Error("Method not implemented.");
    }

    getUser(id: string, email: string): Promise<UserPermissionsView[]> {
        throw new Error("Method not implemented.");
    }

    updateUser(id: string, user: UserPermissionsView): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    deleteUser(id: string, email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getFileUrl(id: string, path: string): string {
        throw new Error("Method not implemented.");
    }

    getFile(id: string, path?: string | undefined, raw?: boolean | undefined): Promise<string | FileDesc[]> {
        throw new Error("Method not implemented.");
    }

    fileExists(id: string, path: string): Promise<false | "file" | "folder"> {
        throw new Error("Method not implemented.");
    }

    uploadFile(id: string, path: string, content: any, onUploadProgress?: ((progressEvent: ProgressEvent<EventTarget>) => void) | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    createFolder(id: string, path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    archiveFile(id: string, destination: string, files: string | string[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    extractFile(id: string, path: string, destination: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getBackups(id: string): Promise<Backup[]> {
        throw new Error("Method not implemented.");
    }

    async createBackup(id: string, name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async deleteBackup(id: string, backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async restoreBackup(id: string, backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getBackupUrl(id: string, backupId: number): string {
        throw new Error("Method not implemented.");
    }

    deleteFile(id: string, path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

class MockServer implements Server {
    public readyState: any;
    public id: string;
    public ip: string;
    public name: string;
    public node: Node;
    public port: number;
    public type: string;

    constructor() {
        this.id = "123abc";
        this.name = "Test Server";
        this.ip = "0.0.0.0";
        this.node = {
            id: 0,
            name: "LocalNode",
            publicHost: "pallokala.test",
            publicPort: 443,
            sftpPort: 5657,
            isLocal: true
        };
        this.port = 25565;
        this.type = "minecraft-java";
    }

    hasScope(scope: string): boolean {
        return scope !== "server.files.edit" && scope !== "server.data.view" && scope !== "server.users.create"
            && scope !== "server.data.edit" && scope !== "server.flags.edit" && scope !== "server.tasks.view"
            && scope !== "server.backup.view" && scope !== "server.definition.view" && scope !== "server.delete";
    }

    on(event: string, cb: (data: any) => void): () => void {
        return () => {};
    }

    emit(event: string, data: any): void {
        throw new Error("Method not implemented.");
    }

    startTask(f: () => void, interval: number): NodeJS.Timeout {
        return setTimeout(f, interval);
    }

    stopTask(ref: NodeJS.Timeout): void {
        clearTimeout(ref);
    }

    needsPolling(): boolean {
        return false;
    }

    getStatus(): Promise<ServerStatus> {
        throw new Error("Method not implemented.");
    }

    getStats(): Promise<ServerStats> {
        return Promise.resolve({
            cpu: 50,
            memory: 1024
        });
    }

    getQuery(): Promise<Record<string, any>> {
        throw new Error("Method not implemented.");
    }

    canQuery(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    start(): Promise<boolean> {
        return Promise.resolve(true);
    }

    stop(): Promise<boolean> {
        return Promise.resolve(true);
    }

    kill(): Promise<boolean> {
        return Promise.resolve(true);
    }

    install(): Promise<boolean> {
        return Promise.resolve(true);
    }

    reload(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    sendCommand(command: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    getConsole(since?: number | undefined): Promise<ServerLogs> {
        return Promise.resolve({
            epoch: 1733754325885215,
            logs: "W0RBRU1PTl0gRGFlbW9uIGhhcyBiZWVuIHN0YXJ0ZWQKW0RBRU1PTl0gU3RhcnRpbmcgc2VydmVyCltEQUVNT05dIFN0YXJ0aW5nIGNvbnRhaW5lcgpMb2FkaW5nIGxpYnJhcmllcywgcGxlYXNlIHdhaXQuLi4KWzE4OjI0OjMwIElORk9dOiBTdGFydGluZyBtaW5lY3JhZnQgc2VydmVyIHZlcnNpb24gMS4yMS4zClsxODoyNDozMCBJTkZPXTogUHJlcGFyaW5nIGxldmVsICJ3b3JsZCIKWzE4OjI0OjMwIElORk9dOiBQcmVwYXJpbmcgc3RhcnQgcmVnaW9uIGZvciBkaW1lbnNpb24gbWluZWNyYWZ0Om92ZXJ3b3JsZApbMTg6MjQ6MzAgSU5GT106IFRpbWUgZWxhcHNlZDogMzYzIG1zClsxODoyNDozMCBJTkZPXTogUHJlcGFyaW5nIHN0YXJ0IHJlZ2lvbiBmb3IgZGltZW5zaW9uIG1pbmVjcmFmdDp0aGVfbmV0aGVyClsxODoyNDozMCBJTkZPXTogVGltZSBlbGFwc2VkOiAxNDcgbXMKWzE4OjI0OjMxIElORk9dOiBQcmVwYXJpbmcgc3RhcnQgcmVnaW9uIGZvciBkaW1lbnNpb24gbWluZWNyYWZ0OnRoZV9lbmQKWzE4OjI0OjMxIElORk9dOiBUaW1lIGVsYXBzZWQ6IDM2NiBtcwpbMTg6MjQ6MzEgSU5GT106IFJ1bm5pbmcgZGVsYXllZCBpbml0IHRhc2tzClsxODoyNDozMSBJTkZPXTogRG9uZSAoMi4yNzRzKSEgRm9yIGhlbHAsIHR5cGUgImhlbHA="
        });
    }

    updateName(name: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    getFlags(): Promise<ServerFlags> {
        return Promise.resolve({
            autoStart: true,
            autoRestartOnCrash: true,
            autoRestartOnGraceful: true
        });
    }

    setFlags(flags: ServerFlags): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getDefinition(): Promise<ServerDefinition> {
        throw new Error("Method not implemented.");
    }

    updateDefinition(data: ServerDefinition): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getData(): Promise<ServerSettings> {
        throw new Error("Method not implemented.");
    }

    adminUpdateData(data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updateData(data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getUsers(): Promise<UserPermissionsView[]> {
        return Promise.resolve([]);
    }

    updateUser(user: UserPermissionsView): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    deleteUser(email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getFileUrl(path: string): string {
        return path;
    }

    getFile(path?: string | undefined, raw?: boolean | undefined): Promise<string | FileDesc[]> {
        if (path === "/server.properties" && raw) {
            return Promise.resolve(`#Minecraft server properties
#Fri Dec 06 16:04:34 UTC 2024
hello=world`);
        }

        return Promise.resolve(
            [
                {
                    name: "server.properties",
                    modifyTime: 1737401211,
                    size: 1024,
                    isFile: true,
                    extension: ".properties"
                }
            ]
        );
    }

    fileExists(path: string): Promise<false | "file" | "folder"> {
        throw new Error("Method not implemented.");
    }

    uploadFile(path: string, content: any, onUploadProgress?: ((progressEvent: ProgressEvent<EventTarget>) => void) | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    createFolder(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    archiveFile(destination: string, files: string | string[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    extractFile(path: string, destination: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getBackups(): Promise<Backup[]> {
        throw new Error("Method not implemented.");
    }

    async createBackup(name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async deleteBackup(backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async restoreBackup(backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getBackupUrl(backupId: number): string {
        throw new Error("Method not implemented.");
    }

    deleteFile(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    closeSocket(): void {
    }
}

class MockNodeApi implements NodeApi {
    fixNode(node: Node): Node {
        throw new Error("Method not implemented.");
    }

    list(): Promise<Node[]> {
        return Promise.all([
            {
                id: 0,
                name: "LocalNode",
                publicHost: "pallokala.test",
                privateHost: "pallokala.test",
                publicPort: 443,
                privatePort: 443,
                sftpPort: 5657,
                isLocal: true
            }
        ]);
    }

    get(id: number): Promise<Node> {
        return Promise.resolve({
            id: 0,
            name: "LocalNode",
            publicHost: "pallokala.test",
            privateHost: "pallokala.test",
            publicPort: 443,
            privatePort: 443,
            sftpPort: 5657,
            isLocal: true
        });
    }

    deployment(id: number): Promise<NodeDeployment> {
        return Promise.resolve({
            clientId: "",
            clientSecret: "",
            publicKey: ""
        });
    }

    features(id: number): Promise<NodeFeatures> {
        return Promise.resolve({
            features: ["docker"],
            environments: ["docker"],
            os: "linux",
            arch: "arm64"
        });
    }

    create(node: Node): Promise<number> {
        throw new Error("Method not implemented.");
    }

    update(id: number, node: Node): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

class MockUserApi implements UserApi {
    list(page?: number): Promise<UserSearchResponse> {
        return Promise.resolve({
            paging: {
                page: 1,
                pageSize: 20,
                maxSize: 100,
                total: 1
            },
            users: [
                {
                    id: 1,
                    username: "testuser",
                    email: "test@pallokala.test"
                }
            ]
        });
    }

    search(name: string, limit: number): Promise<User[]> {
        return Promise.resolve([
            {
                id: 1,
                username: "testuser",
                email: "test@pallokala.test"
            }
        ]);
    }

    searchEmail(email: string, limit: number): Promise<User[]> {
        return Promise.resolve([
            {
                id: 1,
                username: "testuser",
                email: "test@pallokala.test"
            }
        ]);
    }

    create(username: string, email: string, password: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    get(id: number): Promise<User> {
        return Promise.resolve({
            id: 1,
            username: "testuser",
            email: "test@pallokala.test"
        });
    }

    getPermissions(id: number): Promise<string[]> {
        return Promise.resolve(["admin"]);
    }

    update(id: number, user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updatePermissions(id: number, permissions: PermissionView): Promise<boolean> {
        return Promise.resolve(true);
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

class MockSettingsApi implements SettingsApi {
    get(key: string): Promise<string> {
        if (key === "panel.settings.masterUrl") {
            return Promise.resolve("http://pallokala.test");
        }

        if (key === "panel.settings.companyName") {
            return Promise.resolve("Pallokala Test Mode");
        }

        if (key === "panel.registrationEnabled") {
            return Promise.resolve("false");
        }

        return Promise.resolve("");
    }

    set(data: Record<string, string>): Promise<string> {
        return Promise.resolve("");
    }

    getUserSettings(): Promise<Record<string, string>> {
        return Promise.resolve({
            "themeSettings": "{}"
        });
    }

    setUserSetting(key: string, value: any): Promise<boolean> {
        return Promise.resolve(true);
    }
}