import { TelenotesManifestContactInfo } from "data/standard/document/telenotes";

export interface MessagesDocument {
    type: "sms" | "messenger";
    contact: TelenotesManifestContactInfo;
    chat: MessagesSingleChat[];
};

export type MessagesDocuments = MessagesDocument[];

export interface MessagesSingleChat {
    sender: "user" | "opponent";
    message: string;
    time: Date;
};