import { Filesystem, Encoding, ReadFileResult, ReaddirResult, FileInfo, GetUriResult } from "@capacitor/filesystem";
import { demoTelenotesDocument, generateDemoData } from "data/demo/demoDocument";
import { TelenotesDocument, TelenotesManifests, TelenotesManifestContactInfo, TelenotesDocumentSingleMedia, TelenotesId } from "data/standard/document/telenotes";
import { checkFolder, getUsernameBasedFilename } from "hooks/filesystem";
import { readTelenotesManifest, readTelenotesDocumentFolder, writeTelenotesManifest, syncManifestWithDocuments } from "hooks/pages/telenotes/filesystem/manifestFS";
import { generateTelenotesIdForNewDocument } from "hooks/pages/telenotes/data";
import { deleteTelenotesDocumentMedia, getTelenotesDocumentMediaFilenameFromId, readTelenotesDocumentMediaAsManifest, writeTelenotesDocumentMedia } from "./documentMediaFS";
import { telenotesFilesystemConfig } from "data/standard/filesystemStandard";

export async function initiateFSTelenotesDocument() {
    const isTelenotesFolderExists: boolean = await checkFolder(
        telenotesFilesystemConfig.document.path,
        telenotesFilesystemConfig.document.directory,
    );

    if (!isTelenotesFolderExists) {
        await Filesystem.mkdir({
            path: telenotesFilesystemConfig.document.path,
            directory: telenotesFilesystemConfig.document.directory,
            recursive: true
        });
        await Filesystem.mkdir({
            path: telenotesFilesystemConfig.media.path,
            directory: telenotesFilesystemConfig.media.directory,
            recursive: true
        });
        await Filesystem.mkdir({
            path: telenotesFilesystemConfig.savedRecording.path,
            directory: telenotesFilesystemConfig.savedRecording.directory,
            recursive: true
        });
        writeDefaultTelenotesDocuments();
    }
}

export function getTelenotesDocumentPath(id: TelenotesId, isRawName?: boolean) {
    return telenotesFilesystemConfig.document.path + "/" + (
        (isRawName) ? (id) : getTelenotesDocumentFilename(id)
    );
}

export function getTelenotesDocumentFilename(id: TelenotesId) {
    return getUsernameBasedFilename(id) + ".json";
}

export async function readTelenotesDocument(id: TelenotesId): Promise<TelenotesDocument | undefined> {
    initiateFSTelenotesDocument();

    try {
        return await Filesystem.readFile({
            path: getTelenotesDocumentPath(id),
            directory: telenotesFilesystemConfig.document.directory,
            encoding: Encoding.UTF8
        }).then((result: ReadFileResult) => {
            const documentData: TelenotesDocument = JSON.parse(result.data as string);
            console.log("documentData", documentData);
            return documentData;
        });
    }
    catch (error) {
        return undefined;
    }
}

export async function writeTelenotesDocument(id: TelenotesId, data: TelenotesDocument): Promise<void> {
    initiateFSTelenotesDocument();
    
    await Filesystem.writeFile({
        path: getTelenotesDocumentPath(id),
        directory: telenotesFilesystemConfig.document.directory,
        data: JSON.stringify(data),
        encoding: Encoding.UTF8
    });
}

export async function writeDefaultTelenotesDocuments() {
    const demoId = demoTelenotesDocument.id;
    await Filesystem.writeFile({
        path: getTelenotesDocumentPath(demoId),
        directory: telenotesFilesystemConfig.document.directory,
        data: JSON.stringify(demoTelenotesDocument),
        encoding: Encoding.UTF8
    });
}

export async function deleteTelenotesDocument(id: TelenotesId) {
    const documentData = await readTelenotesDocument(id);
    if (documentData?.media) {
        if (documentData.media.type === "url" && documentData.media.url) {
            const mediaFilename = documentData.media.url.split("/").pop() as string;
            deleteTelenotesDocumentMedia(mediaFilename);
        }
    }

    const documents = await readAllTelenotesDocuments();
    documents.forEach(async (file: FileInfo) => {
        const iteratedDocument = await Filesystem.readFile({
            path: telenotesFilesystemConfig.document.path + "/" + file.name,
            directory: telenotesFilesystemConfig.document.directory,
            encoding: Encoding.UTF8
        });
        const iteratedDocumentData: TelenotesDocument = JSON.parse(iteratedDocument.data as string);
        if (iteratedDocumentData.id === id) {
            await Filesystem.deleteFile({
                path: telenotesFilesystemConfig.document.path + "/" + file.name,
                directory: telenotesFilesystemConfig.document.directory
            });
            await syncManifestWithDocuments();
            return;
        }
    });
}

export async function readAllTelenotesDocuments(): Promise<FileInfo[]> {
    initiateFSTelenotesDocument();

    return await Filesystem.readdir({
        path: telenotesFilesystemConfig.document.path,
        directory: telenotesFilesystemConfig.document.directory,
    }).then((result) => {
        return result.files;
    });
}

export async function createNewEmptyDocument(contactInfo: TelenotesManifestContactInfo, id?: string): Promise<TelenotesDocument> {
    initiateFSTelenotesDocument();
    
    const newDocumentId = id ? generateTelenotesIdForNewDocument(id) : generateTelenotesIdForNewDocument();
    const newDocument: TelenotesDocument = {
        id: newDocumentId,
        manifestInfo: {
            contact: contactInfo,
        },
    };
    await writeTelenotesDocument(newDocumentId, newDocument);
    await syncManifestWithDocuments();
    return newDocument;
}

export async function createNewDemoDocument() {
    const newDocument = await createNewEmptyDocument({
        phoneNumber: "1234567890",
        name: "Demo Contact"
    });
    const newDocumentId = newDocument.id;
    const demoData = generateDemoData.telenotesDocument(newDocumentId);
    await writeTelenotesDocument(newDocumentId, demoData);
    await syncManifestWithDocuments();
}

export async function createNewDocumentFromRecording(file: File, contactInfo: TelenotesManifestContactInfo, onEventComplete?: () => void, id?: string): Promise<TelenotesDocument | undefined> {
    const newDocument = await createNewEmptyDocument(contactInfo, id);
    const newDocumentId = newDocument.id;

    const fileFormat = file.type.split("/")[1];
    const fileName = getTelenotesDocumentMediaFilenameFromId(newDocumentId, fileFormat);
    
    await writeTelenotesDocumentMedia(fileName, file);
    const mediaData: TelenotesDocumentSingleMedia | undefined = await readTelenotesDocumentMediaAsManifest(fileName)
    if (mediaData) {
        const newDocument: TelenotesDocument = {
            id: newDocumentId,
            manifestInfo: {
                contact: contactInfo,
                title: "Imported Recording Note (" + new Date().toLocaleString() + ")",
            },
            media: mediaData
        };
        await writeTelenotesDocument(newDocumentId, newDocument);
        onEventComplete?.();
        return newDocument;
    }
}

export async function uploadRecordingToDocument(file: File, documentId: string, onEventComplete?: () => void) {
    const fileFormat = file.type.split("/")[1];
    const fileName = getTelenotesDocumentMediaFilenameFromId(documentId, fileFormat);
    
    await writeTelenotesDocumentMedia(fileName, file);
    const mediaData: TelenotesDocumentSingleMedia | undefined = await readTelenotesDocumentMediaAsManifest(fileName)
    if (mediaData) {
        const documentData = await readTelenotesDocument(documentId);
        if (documentData) {
            documentData.media = mediaData;
            await writeTelenotesDocument(documentId, documentData);
            onEventComplete?.();
        }
    }
};

export async function deleteRecordingFromDocument(documentId: string, onEventComplete?: () => void) {
    const documentData = await readTelenotesDocument(documentId);
    if (documentData?.media) {
        if (documentData.media.type === "url" && documentData.media.url) {
            const mediaFilename = documentData.media.url.split("/").pop() as string;
            deleteTelenotesDocumentMedia(mediaFilename);
        }
        documentData.media = undefined;
        await writeTelenotesDocument(documentId, documentData);
        onEventComplete?.();
    }
}