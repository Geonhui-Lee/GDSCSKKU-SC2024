import { Encoding, FileInfo, Filesystem, ReadFileResult } from "@capacitor/filesystem";
import { demoProtectorReport } from "data/demo/demoDocument";
import { ProtectorInvestigation, ProtectorRecord, ProtectorReport } from "data/standard/document/protector";
import { rootFilesystemConfig } from "data/standard/filesystemStandard";
import { generateProtectorReport } from "../evaluate";
import { readAllProtectorRecords, readProtectorRecord } from "./recordFS";
import { getFilenameFromURI } from "hooks/filesystem";
import { readAllProtectorInvestigations, readProtectorInvestigation } from "./investigationFS";

export const defaultProtectorReport = demoProtectorReport;

export async function initiateFSProtectorReport() {
    const isProtectorReportExists: boolean = await Filesystem.readFile({
        path: rootFilesystemConfig.protectorReportFile.path,
        directory: rootFilesystemConfig.protectorReportFile.directory,
    }).then(() => {
        return true;
    }).catch(() => {
        return false;
    });

    if (!isProtectorReportExists) {
        await Filesystem.writeFile({
            path: rootFilesystemConfig.protectorReportFile.path,
            directory: rootFilesystemConfig.protectorReportFile.directory,
            data: JSON.stringify(defaultProtectorReport),
            encoding: Encoding.UTF8
        });
    }
}

export async function readProtectorReport(): Promise<ProtectorReport> {
    await initiateFSProtectorReport();

    return await Filesystem.readFile({
        path: rootFilesystemConfig.protectorReportFile.path,
        directory: rootFilesystemConfig.protectorReportFile.directory,
        encoding: Encoding.UTF8
    }).then((result: ReadFileResult) => {
        const reportData: ProtectorReport = JSON.parse(result.data as string);
        reportData.time.modified = new Date(reportData.time.modified);
        return reportData;
    }); 
}

export async function writeProtectorReport(data: ProtectorReport): Promise<void> {
    await initiateFSProtectorReport();

    const dataAsString: string = JSON.stringify(data);

    await Filesystem.writeFile({
        path: rootFilesystemConfig.protectorReportFile.path,
        directory: rootFilesystemConfig.protectorReportFile.directory,
        data: dataAsString,
        encoding: Encoding.UTF8
    });
}

export async function updateProtectorReport(data: Partial<ProtectorReport>): Promise<void> {
    const currentReport: ProtectorReport = await readProtectorReport();
    const updatedReport: ProtectorReport = {
        ...currentReport,
        ...data,
        time: {
            modified: new Date()
        }
    };
    await writeProtectorReport(updatedReport);
}

export async function syncReportWithRecordsAndInvestigation() {
    const recordFiles = await readAllProtectorRecords();
    const records: ProtectorRecord[] = [];
    const investigationFiles = await readAllProtectorInvestigations();
    const investigations: ProtectorInvestigation[] = [];

    for (const file of investigationFiles) {
        const protectorInvestigationId = getFilenameFromURI(file.uri);
        if (protectorInvestigationId !== undefined) {
            const investigation = await readProtectorInvestigation(protectorInvestigationId);
            if (investigation) {
                investigations.push(investigation);
            }
        }
    }
    
    for (const file of recordFiles) {
        const protectorRecordId = getFilenameFromURI(file.uri);
        if (protectorRecordId !== undefined) {
            const report = await readProtectorRecord(protectorRecordId);
            if (report) {
                records.push(report);
            }
        }
    }

    const newProtectorReport: ProtectorReport = generateProtectorReport(records, investigations);
    await updateProtectorReport(newProtectorReport);
}