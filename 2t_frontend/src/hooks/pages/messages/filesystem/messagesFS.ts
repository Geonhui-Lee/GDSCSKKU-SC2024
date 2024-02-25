import { Encoding, FileInfo, Filesystem, ReadFileResult } from "@capacitor/filesystem";
import { MessagesDocument } from "data/standard/document/messages";
import { messagesFilesystemConfig } from "data/standard/filesystemStandard";
import { checkFolder } from "hooks/filesystem";

export async function initiateFSMessagesRecord() {
    const isMessagesFolderExists: boolean = await checkFolder(
        messagesFilesystemConfig.chat.path,
        messagesFilesystemConfig.chat.directory,
    );

    if (!isMessagesFolderExists) {
        await Filesystem.mkdir({
            path: messagesFilesystemConfig.chat.path,
            directory: messagesFilesystemConfig.chat.directory,
            recursive: true
        });
    }
}

export function getMessagesDocumentPath(chatId: string, isRawName?: boolean) {
    return messagesFilesystemConfig.chat.path + "/" + (
        (isRawName) ? (chatId) : getMessagesDocumentFilename(chatId)
    );
}

export function getMessagesDocumentFilename(chatId: string) {
    return chatId + ".json";
}

export async function readMessagesDocument(chatId: string): Promise<MessagesDocument | undefined> {
    initiateFSMessagesRecord();

    try {
        return await Filesystem.readFile({
            path: getMessagesDocumentPath(chatId),
            directory: messagesFilesystemConfig.chat.directory,
            encoding: Encoding.UTF8
        }).then((result: ReadFileResult) => {
            const reportData: MessagesDocument = JSON.parse(result.data as string);
            reportData.chat.forEach((chat) => {
                chat.time = new Date(chat.time);
            });
            return reportData;
        });
    }
    catch (error) {
        return undefined;
    }
}

export async function writeMessagesDocument(chatId: string, data: MessagesDocument): Promise<void> {
    initiateFSMessagesRecord();

    await Filesystem.writeFile({
        path: getMessagesDocumentPath(chatId),
        directory: messagesFilesystemConfig.chat.directory,
        data: JSON.stringify(data),
        encoding: Encoding.UTF8
    });
}

export async function updateMessagesDocument(chatId: string, data: Partial<MessagesDocument>): Promise<void> {
    const currentDocument = await readMessagesDocument(chatId);
    if (currentDocument) {
        const updatedDocument: MessagesDocument = {
            ...currentDocument,
            ...data,
        };
        await writeMessagesDocument(chatId, updatedDocument);
    }
    else {
        throw new Error("Document not found");
    }
}

export async function deleteMessagesDocument(chatId: string): Promise<void> {
    initiateFSMessagesRecord();

    await Filesystem.deleteFile({
        path: getMessagesDocumentPath(chatId),
        directory: messagesFilesystemConfig.chat.directory
    });
}

export async function getAllMessagesDocuments(): Promise<MessagesDocument[]> {
    initiateFSMessagesRecord();

    const messagesDocuments: MessagesDocument[] = [];
    const folderFileInfo: FileInfo[] = await readAllMessagesDocuments();
    folderFileInfo.forEach(async (fileInfo) => {
        const document: MessagesDocument | undefined = await readMessagesDocument(fileInfo.uri);
        if (document) {
            messagesDocuments.push(document);
        }
    });

    return messagesDocuments;
}

export async function readAllMessagesDocuments(): Promise<FileInfo[]>{
    return await Filesystem.readdir({
        path: messagesFilesystemConfig.chat.path,
        directory: messagesFilesystemConfig.chat.directory,
    }).then((result) => {
        return result.files;
    });
}

export async function syncMessagesDocumentsWithDevice() {
    
}