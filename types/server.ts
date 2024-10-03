import { ServerStatus, ServerView } from "pufferpanel";

export type ExtendedServerStatus = ServerStatus | "loading" | undefined;
export type ExtendedServerView = ServerView & { online: ExtendedServerStatus };