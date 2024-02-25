import { TelenotesId } from "data/standard/document/telenotes";
import { FilesystemConfig } from "data/standard/filesystemStandard";
import { Directory } from "@capacitor/filesystem";
import { ContactManifest } from ".";
import { MessagesDocument } from "./messages";

export type ProtectorStatus = "safe" | "warning" | "danger";

export interface ProtectorReport {
    time: {
        modified: Date;
    },
    status?: ProtectorStatus
}

export interface ProtectorRecord {
    id?: string;
    type: "call" | "sms" | "messenger";
    time: {
        created: Date;
        modified?: Date;
    };
    score: number;
    contact: ContactManifest;
    data?: ProtectorRecordCallData | ProtectorRecordSMSData;
}

export interface ProtectorRecordCallData {
    callDuration: number;
    suspiciousParts: string[];
}

export interface ProtectorRecordSMSData {
    messagesDocument: MessagesDocument;
    suspiciousParts: string[];
}

export type ProtectorInvestigationId = string;

export interface ProtectorInvestigation {
    id: ProtectorInvestigationId;
    time: {
        created: Date;
        modified?: Date;
    };
    case: {
        contact: ContactManifest;
        records: ProtectorRecord[];
    }
    result?: ProtectorInvestigationResult;
}

export interface ProtectorInvestigationResult {
    status: ProtectorStatus;
    score: number;
    author: {
        association: string;
        name?: string;
        email?: string;
    };
    comments?: [];
}