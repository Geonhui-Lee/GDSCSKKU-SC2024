import { ProtectorInvestigation, ProtectorInvestigationId } from "data/standard/document/protector";

export function requestNewInvestigation(investigation: ProtectorInvestigation): Promise<void> {
    return Promise.resolve();
}

export async function getInvestigationStatus(id: ProtectorInvestigationId): Promise<ProtectorInvestigation> {
    return {
        id: "123",
        time: {
            created: new Date()
        },
        case: {
            contact: {
                name: "John Doe",
                phoneNumber: "1234567890"
            },
            records: []
        }
    };
}