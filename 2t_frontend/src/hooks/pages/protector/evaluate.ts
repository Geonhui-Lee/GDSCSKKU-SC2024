import { ProtectorInvestigation, ProtectorRecord, ProtectorReport } from "data/standard/document/protector";
import { protectorRecordStandard } from "data/standard/protectorStandard";

export function generateProtectorReport(records: ProtectorRecord[], investigations: ProtectorInvestigation[]): ProtectorReport {
    const newProtectorReport: ProtectorReport = {
        time: {
            modified: new Date()
        }
    };

    const investigationsWithResult = investigations.filter(investigation => investigation.result !== undefined);
    const investigationsWithWarningResult = investigationsWithResult.filter(investigation => investigation.result?.status === "warning");
    const investigationsWithDangerResult = investigationsWithResult.filter(investigation => investigation.result?.status === "danger");
    if (investigationsWithDangerResult.length > 0) {
        newProtectorReport.status = "danger";
        return newProtectorReport;
    }
    else if (investigationsWithWarningResult.length > 0) {
        newProtectorReport.status = "warning";
        return newProtectorReport;
    }
    else {
        let biggestScore = 0;
        for (const record of records) {
            biggestScore = Math.max(biggestScore, record.score);
        }

        if (biggestScore >= protectorRecordStandard.standardValue.danger) {
            newProtectorReport.status = "danger";
        }
        else if (biggestScore >= protectorRecordStandard.standardValue.warning) {
            newProtectorReport.status = "warning";
        }
        else {
            newProtectorReport.status = "safe";
        }
        return newProtectorReport;
    }
}