import { useEffect, useRef, useState } from "react";
import ProtectorHQDashboardPage from "./Dashboard";
import { ProtectorInvestigation, ProtectorInvestigationResult, ProtectorRecord } from "data/standard/document/protector";
import { getAllProtectorRecords, updateProtectorRecord, updateProtectorRecords } from "hooks/pages/protector/filesystem/recordFS";
import { protectorHQContext } from "hooks/context";
import { createNewInvestigation, getAllProtectorInvestigations, updateProtectorInvestigation, updateProtectorInvestigationForTesting } from "hooks/pages/protector/filesystem/investigationFS";
import { ContactManifest } from "data/standard/document";
import SuspectedCaseModal from "components/Protector/ProtectorHQ/SuspectedCaseModal";
import { IonAlert } from "@ionic/react";
import { useTimeout } from "usehooks-ts";
import { syncReportWithRecordsAndInvestigation } from "hooks/pages/protector/filesystem/reportFS";
import { getInvestigationStatusFromProsecutionService, requestNewInvestigationToProsecutionService } from "hooks/pages/protector/investigation/prosecutionServiceSMS";

export const ProtectorHQContext = protectorHQContext.createContext();

const ProtectorHQPage: React.FC = () => {
    const [protectorRecords, setProtectorRecords] = useState<ProtectorRecord[] | undefined>([]);
    const [protectorInvestigations, setProtectorInvestigations] = useState<ProtectorInvestigation[] | undefined>([]);
    function doBackgroundProcess() {
        syncDataFromFilesystem();
        updateProtectorInvestigationStatus();
    }
    function syncDataFromFilesystem() {
        getAllProtectorRecords().then((result) => {
            setProtectorRecords(result);
        });
        getAllProtectorInvestigations().then((result) => {
            setProtectorInvestigations(result);
        });
    }
    function updateProtectorInvestigationStatus() {
        if (protectorInvestigations)
        protectorInvestigations.forEach((investigation) => {
            getInvestigationStatusFromProsecutionService(investigation).then((result) => {
                if (result) {
                    setProtectorInvestigations(protectorInvestigations.map((value) => {
                        if (value.id === result.id) {
                            return result;
                        }
                        return value;
                    }));
                }
            });
        });
    }

    const suspectedCaseModalRef = useRef<HTMLIonModalElement>(null);
    function openSuspectedCase(contact: ContactManifest) {
        setSuspectedCaseTargetContact(contact);
        suspectedCaseModalRef.current?.present();
    }
    const [suspectedCaseTargetContact, setSuspectedCaseTargetContact] = useState<ContactManifest | undefined>(undefined);

    const [reportData, setReportData] = useState<{ contact: ContactManifest, records: ProtectorRecord[] } | undefined>(undefined);
    const reportRecordsAlertRef = useRef<HTMLIonAlertElement>(null);
    function openReportRecordsAlert(contact: ContactManifest, records: ProtectorRecord[]) {
        reportRecordsAlertRef.current?.present();
        setReportData({
            contact: contact,
            records: records
        })
    }
    function onReportRecordsConfirm() {
        if (reportData === undefined || reportData.contact === undefined || reportData.records === undefined) return;
        suspectedCaseModalRef.current?.dismiss();
        
        createNewInvestigation(reportData.contact, reportData.records).then((result: ProtectorInvestigation) => {
            setProtectorInvestigations([...protectorInvestigations!, result]);
            requestNewInvestigationToProsecutionService(result);
            // const testResult: ProtectorInvestigationResult = {
            //     status: "danger",
            //     score: 100,
            //     author: {
            //         association: "Teletect"
            //     }
            // };
            // const dateAfterOneHour = new Date(Number(new Date()) + 3600000);
            // setTimeout(() => {
            //     updateProtectorInvestigationForTesting(result.id, {
            //         time: {
            //             created: result.time.created,
            //             modified: dateAfterOneHour
            //         },
            //         result: testResult
            //     });
            // }, 5000);
        });
    }

    useEffect(() => {
        doBackgroundProcess();
        const interval = setInterval(() => {
            doBackgroundProcess();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (protectorRecords !== undefined) {
            updateProtectorRecords(protectorRecords);
        }
        syncReportWithRecordsAndInvestigation();
    }, [protectorRecords]);
    useEffect(() => {
        if (protectorInvestigations !== undefined) {
            protectorInvestigations.forEach((investigation) => {
                updateProtectorInvestigation(investigation.id, investigation);
            });
        }
        syncReportWithRecordsAndInvestigation();
    }, [protectorInvestigations]);

    return <ProtectorHQContext.Provider value={{
        syncDataFromFilesystem: syncDataFromFilesystem,
        openSuspectedCase: openSuspectedCase,
        protectorRecords: protectorRecords,
        setProtectorRecords: setProtectorRecords,
        protectorInvestigations: protectorInvestigations,
        setProtectorInvestigations: setProtectorInvestigations
    }}>
        <ProtectorHQDashboardPage />
        <SuspectedCaseModal
            modalRef={suspectedCaseModalRef}
            targetContact={suspectedCaseTargetContact}
            doReportRecords={openReportRecordsAlert}
        />
        <IonAlert
            ref={reportRecordsAlertRef}
            header="Confirm"
            message="Do you want to report these records?"
            buttons={[
                {
                    text: "Cancel",
                    role: "cancel"
                },
                {
                    text: "Report",
                    handler: () => {
                        onReportRecordsConfirm();
                    }
                }
            ]}
        ></IonAlert>
    </ProtectorHQContext.Provider>
};

export default ProtectorHQPage;