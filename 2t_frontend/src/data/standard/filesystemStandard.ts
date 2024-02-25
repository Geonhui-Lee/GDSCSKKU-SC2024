import { Directory } from "@capacitor/filesystem";

export interface FilesystemConfig {
    path: string;
    directory: Directory;
}

export const rootFilesystemConfig = {
    telenotesManifestFile: {
        path: "telenotes.json",
        directory: Directory.Documents
    } as FilesystemConfig,
    protectorReportFile: {
        path: "protector_report.json",
        directory: Directory.Documents
    }
}

export const protectorFilesystemConfig = {
    record: {
        path: "protector_record",
        directory: Directory.Documents
    } as FilesystemConfig,
    investigation: {
        path: "protector_investigation",
        directory: Directory.Documents
    } as FilesystemConfig,
}

export const telenotesFilesystemConfig = {
    document: {
        path: "telenotes_document",
        directory: Directory.Documents
    } as FilesystemConfig,
    media: {
        path: "telenotes_media",
        directory: Directory.Documents
    } as FilesystemConfig,
    savedRecording: {
        path: "telenotes_saved_recording",
        directory: Directory.Documents
    } as FilesystemConfig,
}

export const messagesFilesystemConfig = {
    chat: {
        path: "messages_chat",
        directory: Directory.Documents
    } as FilesystemConfig
}