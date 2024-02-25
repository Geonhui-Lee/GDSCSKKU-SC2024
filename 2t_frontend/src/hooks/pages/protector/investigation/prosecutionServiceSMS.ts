import { SmsManager } from "@byteowls/capacitor-sms";
import { ProtectorInvestigation } from "data/standard/document/protector";
import { requestProtectorInvestigationExplaination, requestProtectorInvestigationHumanResponseConfirmation } from "hooks/apiRequest";
import { SmsInboxReaderController } from "hooks/nativeController/plugin";

export const PROSECUTION_SERVICE_HOTLINE = '';

export function generateMessageForInvestigation(message: string, id: string): string {
    return message + "\n\n[[[Investigation ID: " + id + "]]]";
}

export function parseInvestigationIdFromSMS(text: string): string {
    const matches = text.match(/\[\[\[Investigation ID: (\d+)\]\]\]/);
    if (matches) {
        return matches[1];
    }
    return '';
}

export async function requestNewInvestigationToProsecutionService(investigation: ProtectorInvestigation): Promise<void> {
    const explanation = await requestProtectorInvestigationExplaination(investigation.case.records);
    const investigationStatus = await getInvestigationStatusFromProsecutionService(investigation);
    if (investigationStatus) {
        return;
    }
    SmsManager.send({
        numbers: [PROSECUTION_SERVICE_HOTLINE],
        text: generateMessageForInvestigation(explanation, investigation.id)
    });
}

export async function getInvestigationStatusFromProsecutionService(investigation: ProtectorInvestigation): Promise<ProtectorInvestigation | undefined> {
    const messages = await SmsInboxReaderController.getMessagesByPhoneNumber({ phoneNumber: PROSECUTION_SERVICE_HOTLINE });
    messages.sms.forEach(async (msgObject) => {
        if (msgObject.message.includes(investigation.id) && investigation.id === parseInvestigationIdFromSMS(msgObject.message)) {
            const newInvestigation = investigation;
            const prosecutionServiceMessageResponse = msgObject.message;
            const isVoicePhishingHumanConfirmed = await requestProtectorInvestigationHumanResponseConfirmation(prosecutionServiceMessageResponse);
            if (isVoicePhishingHumanConfirmed) {
                newInvestigation.result = {
                    status: "danger",
                    score: 100,
                    author: {
                        association: "Prosecution Service",
                    }
                }
            }
            return newInvestigation;
        }
    });
    
    return undefined;
}