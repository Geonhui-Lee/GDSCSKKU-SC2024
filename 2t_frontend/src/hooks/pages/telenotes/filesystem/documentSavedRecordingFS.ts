import { FileInfo, Filesystem } from "@capacitor/filesystem";
import { TelenotesGenerateDocumentResponse } from "data/standard/apiStandard";
import { ContactManifest } from "data/standard/document";
import { telenotesFilesystemConfig } from "data/standard/filesystemStandard";
import { requestTelenotesDocumentGeneration } from "hooks/apiRequest";
import { createNewDocumentFromRecording, initiateFSTelenotesDocument, writeTelenotesDocument } from "hooks/pages/telenotes/filesystem/documentFS";

export async function readAllSavedRecordings(): Promise<FileInfo[]> {
    initiateFSTelenotesDocument();

    return await Filesystem.readdir({
        path: telenotesFilesystemConfig.savedRecording.path,
        directory: telenotesFilesystemConfig.savedRecording.directory,
    }).then((result) => {
        return result.files;
    });
}

export function parseContactInfoFromFilename(fileName: string): ContactManifest {
    const fileNameSplit = fileName.split("_");
    return {
        phoneNumber: fileNameSplit[0],
        name: fileNameSplit[1],
    };
}

export async function importAllSavedRecordingsToTelenotes(onEventComplete?: () => void) {
    initiateFSTelenotesDocument();

    const savedRecordings: FileInfo[] = await readAllSavedRecordings();
    for (const savedRecording of savedRecordings) {
        function onCreateNoteDocumentComplete() {
            Filesystem.deleteFile({
                path: savedRecording.uri,
                directory: telenotesFilesystemConfig.savedRecording.directory
            });
        }

        const savedRecordingRead: string | Blob = await Filesystem.readFile({
            path: savedRecording.uri,
            directory: telenotesFilesystemConfig.savedRecording.directory,
        }).then((result) => {
            return result.data;
        });
        const savedRecordingBlob = new Blob([savedRecordingRead]);
        const savedRecordingFile = new File([savedRecordingBlob], savedRecording.name);

        const newDocument = await createNewDocumentFromRecording(
            savedRecordingFile,
            parseContactInfoFromFilename(savedRecording.name),
            onCreateNoteDocumentComplete
        );

        if (newDocument === undefined) return;
        const documentGenerationResponse: TelenotesGenerateDocumentResponse = await requestTelenotesDocumentGeneration(newDocument.id, savedRecordingFile);
        const generatedDocumentData: TelenotesGenerateDocumentResponse["document"] = documentGenerationResponse.document;
        newDocument.summary = generatedDocumentData.summary;
        newDocument.transcript = generatedDocumentData.transcript;
        writeTelenotesDocument(newDocument.id, newDocument);
    }
};