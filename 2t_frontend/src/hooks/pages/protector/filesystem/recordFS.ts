import { Encoding, FileInfo, Filesystem, ReadFileResult } from "@capacitor/filesystem";
import { ProtectorRecord, ProtectorReport } from "data/standard/document/protector";
import { checkFolder, getFilenameFromURI } from "hooks/filesystem";
import { protectorFilesystemConfig } from "data/standard/filesystemStandard";
import { ContactManifest } from "data/standard/document";

export async function initiateFSProtectorRecord() {
    const isProtectorRecordFolderExists: boolean = await checkFolder(
        protectorFilesystemConfig.record.path,
        protectorFilesystemConfig.record.directory,
    );

    if (!isProtectorRecordFolderExists) {
        await Filesystem.mkdir({
            path: protectorFilesystemConfig.record.path,
            directory: protectorFilesystemConfig.record.directory,
            recursive: true
        });
        writeDefaultProtectorRecords();
    }
}

export function getProtectorRecordPath(recordId: string, isRawName?: boolean) {
    return protectorFilesystemConfig.record.path + "/" + (
        (isRawName) ? (recordId) : getProtectorRecordFilename(recordId)
    );
}

export function getProtectorRecordFilename(recordId: string) {
    return recordId + ".json";
}

export function generateProtectorRecordId() {
    return Date.now().toString();
}

export async function readProtectorRecord(recordId: string): Promise<ProtectorRecord | undefined> {
    initiateFSProtectorRecord();

    try {
        return await Filesystem.readFile({
            path: getProtectorRecordPath(recordId),
            directory: protectorFilesystemConfig.record.directory,
            encoding: Encoding.UTF8
        }).then((result: ReadFileResult) => {
            const reportData: ProtectorRecord = JSON.parse(result.data as string);
            reportData.time.created = new Date(reportData.time.created);
            if (reportData.time.modified) {
                reportData.time.modified = new Date(reportData.time.modified);
            }
            if (reportData.id === undefined) {
                reportData.id = getProtectorRecordFilename(recordId)
            }
            return reportData;
        });
    }
    catch (error) {
        return undefined;
    }
}

export async function writeProtectorRecord(recordId: string, data: ProtectorRecord): Promise<void> {
    initiateFSProtectorRecord();
    
    await Filesystem.writeFile({
        path: getProtectorRecordPath(recordId),
        directory: protectorFilesystemConfig.record.directory,
        data: JSON.stringify(data),
        encoding: Encoding.UTF8
    });
}

export async function updateProtectorRecord(recordId: string, data: Partial<ProtectorRecord>): Promise<void> {
    const currentRecord = await readProtectorRecord(recordId);
    if (currentRecord !== undefined) {
        const updatedRecord: ProtectorRecord = {
            ...currentRecord,
            ...data,
            time: {
                created: currentRecord.time.created,
                modified: new Date()
            }
        };
        await writeProtectorRecord(recordId, updatedRecord);
    }
    else {
        throw new Error("Record does not exist");
    }
}

export async function updateProtectorRecords(records: ProtectorRecord[]): Promise<void> {
    for (const record of records) {
        if (record.id !== undefined) {
            await updateProtectorRecord(record.id, record);
        }
        else {
            
            throw new Error("Record does not have an ID");
        }
    }
}

export async function deleteProtectorRecord(recordId: string): Promise<void> {
    initiateFSProtectorRecord();

    await Filesystem.deleteFile({
        path: getProtectorRecordPath(recordId),
        directory: protectorFilesystemConfig.record.directory,
    });
}

export async function writeDefaultProtectorRecords() {

}

export async function getAllProtectorRecords(): Promise<ProtectorRecord[]> {
    initiateFSProtectorRecord();

    const files = await readAllProtectorRecords();
    const records: ProtectorRecord[] = [];

    for (const file of files) {
        const protectorRecordId = getFilenameFromURI(file.uri);
        if (protectorRecordId !== undefined) {
            const report = await readProtectorRecord(protectorRecordId);
            if (report) {
                records.push(report);
            }
        }
    }

    return records;
}

export async function readAllProtectorRecords(): Promise<FileInfo[]> {
    initiateFSProtectorRecord();

    return await Filesystem.readdir({
        path: protectorFilesystemConfig.record.path,
        directory: protectorFilesystemConfig.record.directory,
    }).then((result) => {
        return result.files;
    });
}