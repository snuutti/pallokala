export type ServerFile = {
    name: string;
    isFile: boolean;
    modifyTime?: number;
    size?: number;
    extension?: string;
};