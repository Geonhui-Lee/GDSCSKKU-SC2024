import { useState, useEffect } from "react";
import { ProtectorReport } from "data/standard/document/protector";
import { ProtectorFeed } from "data/standard/protectorStandard";
import { requestProtectorFeed } from "hooks/apiRequest";
import { protectorContext } from "hooks/context";
import { readProtectorReport, syncReportWithRecordsAndInvestigation, updateProtectorReport } from "hooks/pages/protector/filesystem/reportFS";
import ProtectorSlidesPage from "pages/Protector/ProtectorSlides";

export const ProtectorPageContext = protectorContext.createContext();

const ProtectorPage: React.FC = () => {

    const [protectorReport, setProtectorReport] = useState<ProtectorReport | undefined>();
    function syncReportFromFilesystem() {
        readProtectorReport().then((result: ProtectorReport) => {
            setProtectorReport(result);
        });
    }
    useEffect(() => {
        syncReportFromFilesystem();
        const interval = setInterval(() => {
            syncReportFromFilesystem();
            syncReportWithRecordsAndInvestigation();
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (protectorReport !== undefined) {
            updateProtectorReport(protectorReport).then(() => {});
        }
    }, [protectorReport]);

    return (
        <ProtectorPageContext.Provider value={{ report: protectorReport, setReport: setProtectorReport }}>
            <ProtectorSlidesPage />
        </ProtectorPageContext.Provider>
    );
};

export default ProtectorPage;