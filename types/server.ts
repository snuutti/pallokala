import { ServerStatus, ServerView, FileDesc, ConditionalMetadataType } from "pufferpanel";

export type ExtendedServerStatus = ServerStatus | "loading" | undefined;
export type ExtendedServerView = ServerView & { online: ExtendedServerStatus };

export type ExtendedFileDesc = FileDesc & { path: string };

export type ServerTasks = {
    tasks: Record<string, ServerTask>;
};

export type ServerTask = {
    name: string;
    cronSchedule: string;
    description?: string;
    operations?: ConditionalMetadataType[];
};

export type ExtendedServerTask = ServerTask & { id: string };