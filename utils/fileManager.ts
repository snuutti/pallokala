import SSHClient from "@dylankenneally/react-native-ssh-sftp";
import { ExtendedFileDesc } from "@/types/server";
import { FileDesc, Server } from "pufferpanel";

export interface FileManager {
    close(): void;

    ls(path: string): Promise<FileDesc[]>;

    rename(oldPath: string, newPath: string): Promise<void>;
}

export class HttpFileManager implements FileManager {
    private readonly server: Server;

    constructor(server: Server) {
        this.server = server;
    }

    close(): void {
    }

    async ls(path: string): Promise<FileDesc[]> {
        return await this.server.getFile(path) as FileDesc[];
    }

    rename(_oldPath: string, _newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export type SftpConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
};

export type SftpFileDesc = (FileDesc | ExtendedFileDesc) & {
    lastAccess: number;
    user: number;
    group: number;
    permissions: number;
    flags: number;
};

export class SftpFileManager implements FileManager {
    private client: SSHClient | null = null;

    async connect(config: SftpConfig): Promise<void> {
        this.client = await SSHClient.connectWithPassword(config.host, config.port, config.username, config.password);
        await this.client.connectSFTP();

        console.log(`SFTP connection successful to ${config.host}:${config.port}`);
    }

    close(): void {
        this.client?.disconnect();
    }

    async ls(path: string): Promise<SftpFileDesc[]> {
        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        const results = await this.client!.sftpLs(path);
        const files = results.map((result) => {
            return {
                name: result.isDirectory
                    ? result.filename.slice(0, -1)
                    : result.filename,
                modifyTime: parseInt(result.modificationDate),
                size: result.fileSize,
                isFile: !result.isDirectory,
                extension: result.filename.includes(".")
                    ? result.filename.slice(result.filename.lastIndexOf("."))
                    : "",
                lastAccess: parseInt(result.lastAccess),
                user: result.ownerUserID,
                group: result.ownerGroupID,
                permissions: result.permissions,
                flags: result.flags
            } as SftpFileDesc;
        });

        if (path !== "/") {
            files.push({
                name: "..",
                isFile: false,
                lastAccess: 0,
                user: 0,
                group: 0,
                permissions: 0,
                flags: 0
            });
        }

        return files;
    }

    async rename(oldPath: string, newPath: string): Promise<void> {
        await this.client!.sftpRename(oldPath, newPath);
    }
}