import { MessagesDocument } from "data/standard/document/messages";
import { SmsInboxReaderController } from "hooks/nativeController/plugin";

export function getIdFromMessagesDocument(messagesDocument: MessagesDocument): string {
    switch (messagesDocument.type) {
        case "messenger":
            return `messenger_${messagesDocument.contact.phoneNumber}`;
        case "sms":
        default:
            return `sms_${messagesDocument.contact.phoneNumber}`;
    }
}

export function getMessagesDocumentFromId(messagesDocuments: MessagesDocument[], id: string): MessagesDocument | undefined {
    return messagesDocuments.find((messagesDocument) => getIdFromMessagesDocument(messagesDocument) === id);
}

export async function getDeviceSMSMessages(): Promise<Array<{from: string; message: string;}>> {
    const messages = await SmsInboxReaderController.getAllMessages();
    return messages.sms;
}