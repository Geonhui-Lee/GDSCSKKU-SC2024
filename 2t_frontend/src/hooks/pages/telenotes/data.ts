import { TelenotesDocument, TelenotesDocumentSingleTranscript } from "data/standard/document/telenotes";
import { getUsernameBasedFilename } from "hooks/filesystem";

export type CachedTelenotesDocument = TelenotesDocument | undefined;

export interface CachedTelenotesDocumentContext {
    noteDocument: CachedTelenotesDocument;
    setNoteDocument: React.Dispatch<React.SetStateAction<CachedTelenotesDocument>>;
    addTranscriptItem: (index: number, newContent: string, speakerTag?: TelenotesDocumentSingleTranscript["speakerTag"]) => void;
    editTranscriptItem: (index: number, editedContent: string, speakerTag?: TelenotesDocumentSingleTranscript["speakerTag"]) => void;
    deleteTranscriptItem: (index: number) => void;
};

export function generateTelenotesIdForNewDocument(specificId?: string) {
    return "tn_" + getUsernameBasedFilename(
        (specificId) ? (specificId) : Date.now().toString()
    );
}

export function isCachedDocumentComplete(document: CachedTelenotesDocument, checkRequiredDataOnly?: boolean): boolean {
    const isRequiredDataComplete = !(
        document === undefined ||
        document.summary === undefined ||
        document.transcript === undefined || document.transcript[0] === undefined
    );
    const isOptionalDataComplete = !(
        document === undefined ||
        document.media === undefined
    );
    return (checkRequiredDataOnly) ? (
        isRequiredDataComplete
    ) : (
        isRequiredDataComplete && isOptionalDataComplete
    ); 
}