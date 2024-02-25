import { TelenotesId, TelenotesDocumentSingleMedia } from "data/standard/document/telenotes";
import { getUsernameBasedFilename } from "hooks/filesystem";
import { initiateFSTelenotesDocument } from "./documentFS";
import { FileInfo, Filesystem, GetUriResult } from "@capacitor/filesystem";
import { telenotesFilesystemConfig } from "data/standard/filesystemStandard";

export function getTelenotesDocumentMediaPath(fileName: string) {
    return telenotesFilesystemConfig.media.path + "/" + fileName;
}

export function getTelenotesDocumentMediaFilenameFromId(id: TelenotesId, fileFormat: string) {
    return id + "." + fileFormat;
}

export async function readTelenotesDocumentMedia(fileName: string): Promise<File | undefined> {
    initiateFSTelenotesDocument();

    try {
        return await Filesystem.readFile({
            path: getTelenotesDocumentMediaPath(fileName),
            directory: telenotesFilesystemConfig.media.directory,
        }).then((result) => {
            const fileData = new File([result.data as BlobPart], fileName);
            return fileData;
        });
    }
    catch (error) {
        return undefined;
    }
}

export async function readTelenotesDocumentMediaAsManifest(fileName: string): Promise<TelenotesDocumentSingleMedia | undefined> {
    initiateFSTelenotesDocument();

    try {
        return await Filesystem.getUri({
            path: getTelenotesDocumentMediaPath(fileName),
            directory: telenotesFilesystemConfig.media.directory,
        }).then((result: GetUriResult) => {
            const mediaData: TelenotesDocumentSingleMedia = {
                type: "url",
                url: result.uri
            };
            return mediaData;
        });
    }
    catch (error) {
        return undefined;
    }
}

export async function writeTelenotesDocumentMedia(fileName: string, fileData: File): Promise<void> {
    initiateFSTelenotesDocument();
    
    const fileDataInBlob = new Blob([fileData]);
    await Filesystem.writeFile({
        path: getTelenotesDocumentMediaPath(fileName),
        directory: telenotesFilesystemConfig.media.directory,
        data: fileDataInBlob,
    });
}

export async function deleteTelenotesDocumentMedia(fileName: string): Promise<void> {
    initiateFSTelenotesDocument();

    await Filesystem.deleteFile({
        path: getTelenotesDocumentMediaPath(fileName),
        directory: telenotesFilesystemConfig.media.directory,
    });
}

export async function readAllTelenotesDocumentMedia(): Promise<FileInfo[]> {
    initiateFSTelenotesDocument();

    return await Filesystem.readdir({
        path: telenotesFilesystemConfig.media.path,
        directory: telenotesFilesystemConfig.media.directory,
    }).then((result) => {
        return result.files;
    });
}

export function getFilenameFromTelenotesDocumentMedia(documentMedia: TelenotesDocumentSingleMedia): string | undefined {
    return (documentMedia.url) ? (documentMedia.url.split("/").pop() as string) : undefined;
}

export async function getTelenotesDocumentMediaUrl(fileName: string): Promise<string> {
    return await Filesystem.getUri({
        path: getTelenotesDocumentMediaPath(fileName),
        directory: telenotesFilesystemConfig.media.directory,
    }).then((result: GetUriResult) => {
        return result.uri;
    });
}