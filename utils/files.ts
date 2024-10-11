import { FileDesc } from "pufferpanel";

type Extension = {
    type: "image" | "audio" | "video" | null;
    disableSave: boolean;
};

const extensions: Record<string, Extension> = {
    ".jpg": { type: "image", disableSave: true },
    ".jpeg": { type: "image", disableSave: true },
    ".png": { type: "image", disableSave: true },
    ".gif": { type: "image", disableSave: true },
    ".mp3": { type: "audio", disableSave: true },
    ".wav": { type: "audio", disableSave: true },
    ".ogg": { type: "audio", disableSave: true },
    ".flac": { type: "audio", disableSave: true },
    ".aac": { type: "audio", disableSave: true },
    ".alac": { type: "audio", disableSave: true },
    ".mp4": { type: "video", disableSave: true },
    ".webm": { type: "video", disableSave: true },
    ".avi": { type: "video", disableSave: true },
    ".mkv": { type: "video", disableSave: true },
    ".m4a": { type: "video", disableSave: true }
};

export function getType(file: FileDesc) {
    if (file.extension) {
        return extensions[file.extension]?.type;
    }

    return null;
}

export function skipDownload(file: FileDesc) {
    const type = getType(file);
    if (!type) {
        return false;
    }

    return ["image", "audio", "video"].includes(type);
}