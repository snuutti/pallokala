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
    PasswordLoginResult,
    OAuthClient,
    OtpEnrollResponse,
    OtpRecoveryCodes,
    WebauthnCredentialView,
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

    async head(_url: string, _params?: any, _headers?: any, _options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async get(_url: string, _params?: any, _headers?: any, _options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async post(_url: string, _data: any, _params?: any, _headers?: any, _options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async put(_url: string, _data: any, _params?: any, _headers?: any, _options?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async delete(_url: string, _params?: any, _headers?: any, _options?: any): Promise<any> {
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

    async getTheme(_name: string): Promise<ArrayBuffer> {
        throw new Error("Method not implemented.");
    }
}

class MockAuthApi implements AuthApi {
    oauth(_clientId: string, _clientSecret: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async login(_email: string, _password: string): Promise<PasswordLoginResult | boolean> {
        return Promise.resolve(true);
    }

    loginOtp(_token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    startPasskeyLogin(_email: string, _onError?: (error: any) => void): Promise<Credential> {
        throw new Error("Method not implemented.");
    }

    validatePasskeyLogin(_data: Credential): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    passkeyLogin(_email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    register(_username: string, _email: string, _password: string): Promise<boolean> {
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

    updateDetails(_username: string, _email: string, _password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    changePassword(_password: string, _newPassword: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    isOtpEnabled(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    startOtpEnroll(): Promise<OtpEnrollResponse> {
        throw new Error("Method not implemented.");
    }

    validateOtpEnroll(_token: string): Promise<OtpRecoveryCodes> {
        throw new Error("Method not implemented.");
    }

    regenerateRecoveryCodes(_token: string): Promise<OtpRecoveryCodes> {
        throw new Error("Method not implemented.");
    }

    disableOtp(_token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getPasskeys(): Promise<WebauthnCredentialView[]> {
        throw new Error("Method not implemented.");
    }

    startPasskeyEnroll(_name: string): Promise<CredentialCreationOptions> {
        throw new Error("Method not implemented.");
    }

    validatePasskeyEnroll(_data: Credential): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    enrollPasskey(_name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    deletePasskey(_id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    setAllowPasswordlessLogin(_value: boolean): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getSettings(): Promise<Record<string, string>> {
        throw new Error("Method not implemented.");
    }

    updateSetting(_key: string, _value: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getOAuthClients(): Promise<OAuthClient[]> {
        throw new Error("Method not implemented.");
    }

    createOAuthClient(_name: string, _description: string): Promise<OAuthClient> {
        throw new Error("Method not implemented.");
    }

    deleteOAuthClient(_clientId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

class MockServerApi implements ServerApi {
    create(_data: ServerCreation): Promise<string> {
        throw new Error("Method not implemented.");
    }

    list(_page?: number, _pageSize?: number | undefined, _name?: string | undefined): Promise<ServerSearchResponse> {
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

    get(_id: string, _withSocket?: boolean | undefined): Promise<Server | ServerData> {
        return Promise.resolve(new MockServer());
    }

    getStatus(_id: string): Promise<ServerStatus> {
        return Promise.resolve("online");
    }

    getStats(_id: string): Promise<ServerStats> {
        throw new Error("Method not implemented.");
    }

    getQuery(_id: string): Promise<Record<string, any>> {
        throw new Error("Method not implemented.");
    }

    canQuery(_id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    action(_id: string, _action: ServerAction, _wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    start(_id: string, _wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    restart(_id: string, _wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    stop(_id: string, _wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    kill(_id: string, _wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    install(_id: string, _wait?: boolean | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    reload(_id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    sendCommand(_id: string, _command: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getConsole(_id: string, _time?: number | undefined): Promise<ServerLogs> {
        throw new Error("Method not implemented.");
    }

    updateName(_id: string, _name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getFlags(_id: string): Promise<ServerFlags> {
        throw new Error("Method not implemented.");
    }

    setFlags(_id: string, _flags: ServerFlags): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getDefinition(_id: string): Promise<ServerDefinition> {
        throw new Error("Method not implemented.");
    }

    updateDefinition(_id: string, _data: ServerDefinition): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getData(_id: string): Promise<ServerSettings> {
        throw new Error("Method not implemented.");
    }

    adminUpdateData(_id: string, _data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updateData(_id: string, _data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getUsers(_id: string): Promise<UserPermissionsView[]> {
        throw new Error("Method not implemented.");
    }

    getUser(_id: string, _email: string): Promise<UserPermissionsView[]> {
        throw new Error("Method not implemented.");
    }

    updateUser(_id: string, _user: UserPermissionsView): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    deleteUser(_id: string, _email: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getFileUrl(_id: string, _path: string): string {
        throw new Error("Method not implemented.");
    }

    getFile(_id: string, _path?: string | undefined, _raw?: boolean | undefined): Promise<string | FileDesc[]> {
        throw new Error("Method not implemented.");
    }

    fileExists(_id: string, _path: string): Promise<false | "file" | "folder"> {
        throw new Error("Method not implemented.");
    }

    uploadFile(_id: string, _path: string, _content: any, _onUploadProgress?: ((progressEvent: ProgressEvent<EventTarget>) => void) | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    createFolder(_id: string, _path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    archiveFile(_id: string, _destination: string, _files: string | string[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    extractFile(_id: string, _path: string, _destination: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getBackups(_id: string): Promise<Backup[]> {
        throw new Error("Method not implemented.");
    }

    async createBackup(_id: string, _name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async deleteBackup(_id: string, _backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async restoreBackup(_id: string, _backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getBackupUrl(_id: string, _backupId: number): string {
        throw new Error("Method not implemented.");
    }

    deleteFile(_id: string, _path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(_id: string): Promise<boolean> {
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

    on(_event: string, _cb: (data: any) => void): () => void {
        return () => {};
    }

    emit(_event: string, _data: any): void {
        throw new Error("Method not implemented.");
    }

    startTask(f: () => void, interval: number): NodeJS.Timeout | number {
        return setTimeout(f, interval);
    }

    stopTask(ref: NodeJS.Timeout | number): void {
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
        return Promise.resolve(false);
    }

    start(): Promise<boolean> {
        return Promise.resolve(true);
    }

    restart(): Promise<boolean> {
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

    sendCommand(_command: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    getConsole(_since?: number | undefined): Promise<ServerLogs> {
        return Promise.resolve({
            epoch: 1733754325885215,
            logs: "W0RBRU1PTl0gRGFlbW9uIGhhcyBiZWVuIHN0YXJ0ZWQKW0RBRU1PTl0gU3RhcnRpbmcgc2VydmVyCltEQUVNT05dIFN0YXJ0aW5nIGNvbnRhaW5lcgpMb2FkaW5nIGxpYnJhcmllcywgcGxlYXNlIHdhaXQuLi4KWzE4OjI0OjMwIElORk9dOiBTdGFydGluZyBtaW5lY3JhZnQgc2VydmVyIHZlcnNpb24gMS4yMS4zClsxODoyNDozMCBJTkZPXTogUHJlcGFyaW5nIGxldmVsICJ3b3JsZCIKWzE4OjI0OjMwIElORk9dOiBQcmVwYXJpbmcgc3RhcnQgcmVnaW9uIGZvciBkaW1lbnNpb24gbWluZWNyYWZ0Om92ZXJ3b3JsZApbMTg6MjQ6MzAgSU5GT106IFRpbWUgZWxhcHNlZDogMzYzIG1zClsxODoyNDozMCBJTkZPXTogUHJlcGFyaW5nIHN0YXJ0IHJlZ2lvbiBmb3IgZGltZW5zaW9uIG1pbmVjcmFmdDp0aGVfbmV0aGVyClsxODoyNDozMCBJTkZPXTogVGltZSBlbGFwc2VkOiAxNDcgbXMKWzE4OjI0OjMxIElORk9dOiBQcmVwYXJpbmcgc3RhcnQgcmVnaW9uIGZvciBkaW1lbnNpb24gbWluZWNyYWZ0OnRoZV9lbmQKWzE4OjI0OjMxIElORk9dOiBUaW1lIGVsYXBzZWQ6IDM2NiBtcwpbMTg6MjQ6MzEgSU5GT106IFJ1bm5pbmcgZGVsYXllZCBpbml0IHRhc2tzClsxODoyNDozMSBJTkZPXTogRG9uZSAoMi4yNzRzKSEgRm9yIGhlbHAsIHR5cGUgImhlbHA="
        });
    }

    updateName(_name: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    getFlags(): Promise<ServerFlags> {
        return Promise.resolve({
            autoStart: true,
            autoRestartOnCrash: true,
            autoRestartOnGraceful: true
        });
    }

    setFlags(_flags: ServerFlags): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getDefinition(): Promise<ServerDefinition> {
        throw new Error("Method not implemented.");
    }

    updateDefinition(_data: ServerDefinition): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getData(): Promise<ServerSettings> {
        throw new Error("Method not implemented.");
    }

    adminUpdateData(_data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updateData(_data: Record<string, unknown>): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getUsers(): Promise<UserPermissionsView[]> {
        return Promise.resolve([]);
    }

    updateUser(_user: UserPermissionsView): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    deleteUser(_email: string): Promise<boolean> {
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

    fileExists(_path: string): Promise<false | "file" | "folder"> {
        throw new Error("Method not implemented.");
    }

    uploadFile(_path: string, _content: any, _onUploadProgress?: ((progressEvent: ProgressEvent<EventTarget>) => void) | undefined): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    createFolder(_path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    archiveFile(_destination: string, _files: string | string[]): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    extractFile(_path: string, _destination: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getBackups(): Promise<Backup[]> {
        throw new Error("Method not implemented.");
    }

    async createBackup(_name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async deleteBackup(_backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async restoreBackup(_backupId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getBackupUrl(_backupId: number): string {
        throw new Error("Method not implemented.");
    }

    deleteFile(_path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    closeSocket(): void {
    }
}

class MockNodeApi implements NodeApi {
    fixNode(_node: Node): Node {
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

    get(_id: number): Promise<Node> {
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

    deployment(_id: number): Promise<NodeDeployment> {
        return Promise.resolve({
            clientId: "",
            clientSecret: "",
            publicKey: ""
        });
    }

    features(_id: number): Promise<NodeFeatures> {
        return Promise.resolve({
            features: ["docker"],
            environments: ["docker"],
            os: "linux",
            arch: "arm64"
        });
    }

    create(_node: Node): Promise<number> {
        throw new Error("Method not implemented.");
    }

    update(_id: number, _node: Node): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(_id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

class MockUserApi implements UserApi {
    list(_page?: number): Promise<UserSearchResponse> {
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

    search(_name: string, _limit: number): Promise<User[]> {
        return Promise.resolve([
            {
                id: 1,
                username: "testuser",
                email: "test@pallokala.test"
            }
        ]);
    }

    searchEmail(_email: string, _limit: number): Promise<User[]> {
        return Promise.resolve([
            {
                id: 1,
                username: "testuser",
                email: "test@pallokala.test"
            }
        ]);
    }

    create(_username: string, _email: string, _password: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    get(_id: number): Promise<User> {
        return Promise.resolve({
            id: 1,
            username: "testuser",
            email: "test@pallokala.test"
        });
    }

    getPermissions(_id: number): Promise<string[]> {
        return Promise.resolve(["admin"]);
    }

    update(_id: number, _user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    updatePermissions(_id: number, _permissions: PermissionView): Promise<boolean> {
        return Promise.resolve(true);
    }

    delete(_id: number): Promise<boolean> {
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

    set(_data: Record<string, string>): Promise<string> {
        return Promise.resolve("");
    }

    getUserSettings(): Promise<Record<string, string>> {
        return Promise.resolve({
            "themeSettings": "{}"
        });
    }

    setUserSetting(_key: string, _value: any): Promise<boolean> {
        return Promise.resolve(true);
    }

    sendTestEmail(): Promise<boolean> {
        return Promise.resolve(true);
    }
}