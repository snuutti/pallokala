export type Node = {
    id: number;
    name: string;
    publicHost: string;
    publicPort: number;
    sftpPort: number;
    isLocal: boolean;
};

export type Server = {
    id: string;
    name: string;
    node: Node;
    ip: string;
    port: number;
    type: string;
    icon: string;
    canGetStatus: boolean;
};