import { mediaDestinations } from "data/destination";
import { MessagesDocument, MessagesDocuments } from "data/standard/document/messages";
import { getDateString } from "hooks/date";

export type GrouppedMessagesDocuments = Record<string, MessagesDocuments>;

export const getMessagesDocumentItemValue = {
    personName: (item: MessagesDocument) => {
        return item.contact.name || item.contact.phoneNumber;
    },
    message: (item: MessagesDocument) => {
        return item.chat[item.chat.length - 1].message;
    },
    dateString: (item: MessagesDocument) => {
        const latestMessageDate = new Date(item.chat[item.chat.length - 1].time);
        return getDateString(latestMessageDate);
    },
    avatar: (item: MessagesDocument) => {
        return mediaDestinations.user.telenotes.avatar.default;
    },
};