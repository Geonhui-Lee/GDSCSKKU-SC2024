import { FilesystemConfig } from "data/standard/filesystemStandard";
import { Directory } from "@capacitor/filesystem";

export type TelenotesId = string;

export interface TelenotesManifest {
    id: TelenotesId;
    time: {
        created: Date;
        modified?: Date;
    };
    info: TelenotesManifestInfo;
};

export interface TelenotesManifestInfo {
    contact: TelenotesManifestContactInfo;
    title?: string;
}

export interface TelenotesManifestContactInfo {
    name?: string;
    phoneNumber: string;
}

export type TelenotesManifests = TelenotesManifest[];

export interface TelenotesDocument {
    id: TelenotesId;
    manifestInfo: TelenotesManifestInfo;
    transcript?: TelenotesDocumentSingleTranscript[];
    summary?: TelenotesDocumentSingleSummary;
    media?: TelenotesDocumentSingleMedia;
};

export interface TelenotesDocumentSingleTranscript {
    speakerTag?: "user" | "opponent";
    content: string;
};

export interface TelenotesDocumentSingleSummary {
    description: string;
    lists: string[];
    keywords: string[];
};

export interface TelenotesDocumentSingleMedia {
    type: "url";
    url?: string;
};