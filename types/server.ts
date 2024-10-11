import { ServerStatus, ServerView, FileDesc } from "pufferpanel";

export type ExtendedServerStatus = ServerStatus | "loading" | undefined;
export type ExtendedServerView = ServerView & { online: ExtendedServerStatus };

export type ExtendedFileDesc = FileDesc & { path: string };