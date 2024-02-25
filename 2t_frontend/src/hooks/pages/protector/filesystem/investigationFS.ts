import { Encoding, FileInfo, Filesystem, ReadFileResult } from "@capacitor/filesystem";
import { ContactManifest } from "data/standard/document";
import { ProtectorInvestigation, ProtectorRecord } from "data/standard/document/protector";
import { protectorFilesystemConfig } from "data/standard/filesystemStandard";
import { checkFolder, getFilenameFromURI } from "hooks/filesystem";

export async function initiateFSProtectorInvestigation() {
    const isProtectorInvestigationFolderExists: boolean = await checkFolder(
        protectorFilesystemConfig.investigation.path,
        protectorFilesystemConfig.investigation.directory,
    );

    if (!isProtectorInvestigationFolderExists) {
        await Filesystem.mkdir({
            path: protectorFilesystemConfig.investigation.path,
            directory: protectorFilesystemConfig.investigation.directory,
            recursive: true
        });
        writeDefaultProtectorInvestigations();
    }
}

export function getProtectorInvestigationIdPath(investigationId: string, isRawName?: boolean) {
    return protectorFilesystemConfig.investigation.path + "/" + (
        (isRawName) ? (investigationId) : getProtectorInvestigationFilename(investigationId)
    );
}

export function getProtectorInvestigationFilename(investigationId: string) {
    return investigationId + ".json";
}

export function generateProtectorInvestigationId(contact: ContactManifest) {
    return contact.phoneNumber + "_" + Date.now();
}

export async function readProtectorInvestigation(investigationId: string): Promise<ProtectorInvestigation | undefined> {
    initiateFSProtectorInvestigation();

    try {
        return await Filesystem.readFile({
            path: getProtectorInvestigationIdPath(investigationId),
            directory: protectorFilesystemConfig.investigation.directory,
            encoding: Encoding.UTF8
        }).then((result: ReadFileResult) => {
            const investigationData: ProtectorInvestigation = JSON.parse(result.data as string);
            investigationData.time.created = new Date(investigationData.time.created);
            if (investigationData.time.modified) {
                investigationData.time.modified = new Date(investigationData.time.modified);
            }
            return investigationData;
        });
    }
    catch (error) {
        return undefined;
    }
}

export async function writeProtectorInvestigation(investigationId: string, data: ProtectorInvestigation): Promise<void> {
    initiateFSProtectorInvestigation();
    
    await Filesystem.writeFile({
        path: getProtectorInvestigationIdPath(investigationId),
        directory: protectorFilesystemConfig.investigation.directory,
        data: JSON.stringify(data),
        encoding: Encoding.UTF8
    });
}

export async function updateProtectorInvestigation(investigationId: string, data: Partial<ProtectorInvestigation>): Promise<void> {
    const currentRecord = await readProtectorInvestigation(investigationId);
    if (currentRecord !== undefined) {
        const updatedRecord: ProtectorInvestigation = {
            ...currentRecord,
            ...data,
            time: {
                created: currentRecord.time.created,
                modified: new Date()
            }
        };
        await writeProtectorInvestigation(investigationId, updatedRecord);
    }
    else {
        throw new Error("Investigation does not exist");
    }
}

export async function updateProtectorInvestigationForTesting(investigationId: string, data: Partial<ProtectorInvestigation>): Promise<void> {
    const currentRecord = await readProtectorInvestigation(investigationId);
    if (currentRecord !== undefined) {
        const updatedRecord: ProtectorInvestigation = {
            ...currentRecord,
            ...data,
        };
        await writeProtectorInvestigation(investigationId, updatedRecord);
    }
    else {
        throw new Error("Investigation does not exist");
    }
}

export async function deleteProtectorInvestigation(recordId: string): Promise<void> {
    initiateFSProtectorInvestigation();

    await Filesystem.deleteFile({
        path: getProtectorInvestigationIdPath(recordId),
        directory: protectorFilesystemConfig.investigation.directory,
    });
}

export async function writeDefaultProtectorInvestigations() {
}

export async function getAllProtectorInvestigations(): Promise<ProtectorInvestigation[]> {
    initiateFSProtectorInvestigation();

    const files = await readAllProtectorInvestigations();
    const investigations: ProtectorInvestigation[] = [];

    for (const file of files) {
        const investigationRecordId = getFilenameFromURI(file.uri);
        if (investigationRecordId !== undefined) {
            const investigation = await readProtectorInvestigation(investigationRecordId);
            if (investigation) {
                investigations.push(investigation);
            }
        }
    }

    return investigations;
}

export async function readAllProtectorInvestigations(): Promise<FileInfo[]> {
    initiateFSProtectorInvestigation();

    return await Filesystem.readdir({
        path: protectorFilesystemConfig.investigation.path,
        directory: protectorFilesystemConfig.investigation.directory,
    }).then((result) => {
        return result.files;
    });
}

export async function createNewInvestigation(contact: ContactManifest, relevantRecords: ProtectorRecord[]): Promise<ProtectorInvestigation> {
    initiateFSProtectorInvestigation();
    
    const newInvestigationId = generateProtectorInvestigationId(contact);
    const newInvestigation: ProtectorInvestigation = {
        id: newInvestigationId,
        time: {
            created: new Date(),
        },
        case: {
            contact: contact,
            records: relevantRecords,
        },
    };
    await writeProtectorInvestigation(newInvestigationId, newInvestigation);
    return newInvestigation;
}