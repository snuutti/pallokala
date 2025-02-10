import "@dylankenneally/react-native-ssh-sftp";

declare module "@dylankenneally/react-native-ssh-sftp" {
    interface LsResult {
        permissions: number;
    }
}