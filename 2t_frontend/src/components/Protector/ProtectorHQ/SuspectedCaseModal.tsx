import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { ContactManifest } from "data/standard/document";
import { ProtectorRecord, ProtectorRecordCallData, ProtectorRecordSMSData } from "data/standard/document/protector";
import { protectorHQContext } from "hooks/context";
import { getDateString } from "hooks/date";
import { callOutline, chatboxOutline, caretForwardOutline, warningOutline, eyeOutline, helpOutline, cashOutline, linkOutline } from "ionicons/icons";
import { ProtectorHQContext } from "pages/Protector/ProtectorHQ";
import { useContext, useEffect, useState } from "react";

interface SuspectedCaseModalProps {
    modalRef: React.RefObject<HTMLIonModalElement>;
    targetContact?: ContactManifest;
    doReportRecords: (contact: ContactManifest, records: ProtectorRecord[]) => void;
}

const SuspectedCaseModal: React.FC<SuspectedCaseModalProps> = ({modalRef, targetContact, doReportRecords}) => {
    function getContext() {
        return useContext(ProtectorHQContext) as ReturnType<typeof protectorHQContext.useContext>;
    }
    
    const [segmantValue, setSegmentValue] = useState<"report" | "history">("report");
    const [protectorRecords, setProtectorRecords] = [getContext().protectorRecords, getContext().setProtectorRecords];
    const relevantProtectorRecords: ProtectorRecord[] = protectorRecords?.filter(record => {
        return record.contact.phoneNumber === targetContact?.phoneNumber;
    }) ?? [];

    function reportRecords() {
        if (targetContact === undefined) return;
        doReportRecords(targetContact, relevantProtectorRecords);
    }

    return <>{(targetContact) ? (
        <IonModal ref={modalRef}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => modalRef.current?.dismiss()}>Close</IonButton>
                    </IonButtons>
                    <IonTitle>
                        <IonSegment value={segmantValue} onIonChange={e => setSegmentValue(e.detail.value as any)}>
                        <IonSegmentButton value="report">
                            <IonLabel>Report</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="history">
                            <IonLabel>History</IonLabel>
                        </IonSegmentButton>
                        </IonSegment>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>{
                (segmantValue === "report") ? (<>
                    <IonList inset={true}>
                        <IonItemDivider>Detected Content</IonItemDivider>
                        {
                            (relevantProtectorRecords.filter(record => record.type === "call").length > 0) ? (<>
                                <IonItem>
                                    <IonIcon icon={callOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Call</h2>
                                        {(relevantProtectorRecords.filter(record => record.type === "call")).map((record, index) => {
                                            return (<IonLabel key={index}>
                                                {(record.data) ? (
                                                    (record.data as ProtectorRecordCallData).suspiciousParts.map((part, index) => {
                                                        return <p key={index}>{part}</p>;
                                                    })
                                                ) : (<></>)}
                                            </IonLabel>)
                                        })}
                                    </IonLabel>
                                </IonItem>
                            </>) : (<></>)
                        }
                        {
                            (relevantProtectorRecords.filter(record => record.type === "sms").length > 0) ? (<>
                                <IonItem>
                                    <IonIcon icon={chatboxOutline} slot="start" />
                                    <IonLabel>
                                        <h2>Message</h2>
                                        {(relevantProtectorRecords.filter(record => record.type === "sms")).map((record, index) => {
                                            return (<IonLabel key={index}>
                                                {(record.data) ? (
                                                    (record.data as ProtectorRecordSMSData).suspiciousParts.map((part, index) => {
                                                        return <p key={index}>{part}</p>;
                                                    })
                                                ) : (<></>)}
                                            </IonLabel>)
                                        })}
                                    </IonLabel>
                                </IonItem>
                            </>) : (<></>)
                        }
                    </IonList>
                    <IonList inset={true}>
                        <IonItemDivider>Suggestions</IonItemDivider>
                        <IonItemGroup>
                            <IonItem button={true} detailIcon={caretForwardOutline} onClick={reportRecords}>
                                <IonIcon icon={warningOutline} slot="start" color="danger" />
                                <IonLabel color="danger">
                                    <h2>Report suspicious matters</h2>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel style={{ paddingLeft: 42 }}>
                                    <p>Get the confirmation of the suspicious matters by making a <span style={{
                                    color: "var(--ion-color-dark)"
                                    }}>report to Teletect and the national authorities.</span></p>
                                </IonLabel>
                            </IonItem>
                        </IonItemGroup>
                        <IonItem>
                            <IonIcon icon={eyeOutline} slot="start" />
                            <IonLabel>
                                <h2>Stay alert</h2>
                                <p>You may be a target of a scam! Always be cautious of any suspicious activities.</p>
                            </IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonIcon icon={cashOutline} slot="start" />
                            <IonLabel>
                                <h2>Avoid any financial transactions</h2>
                                <p>No government or financial institution will ask you to make a payment over the phone.</p>
                            </IonLabel>
                        </IonItem>
                        <IonItem button={true} onClick={() => { window.open("https://portal.kfb.or.kr/voice/vphishing_correspond.php", "_blank") }}>
                            <IonIcon icon={linkOutline} slot="start" />
                            <IonLabel>
                                <h2>Don't panic</h2>
                                <p>Visit the official government website to understand how to respond to the current situation to avoid unwanted consequences.</p>
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </>) : (<>
                    <IonList inset={true}>
                        <IonItemDivider>History</IonItemDivider>
                        {
                            relevantProtectorRecords.map((record, index) => {
                                return (<IonItem key={index}>
                                    <IonIcon icon={
                                        record.type === "sms" ? chatboxOutline : 
                                        record.type === "call" ? callOutline :
                                        helpOutline
                                    } slot="start" />
                                    <IonLabel color="medium">{
                                        (record.data) ? (
                                            record.data.suspiciousParts.map((part, index) => {
                                                return <p key={index}>{part}</p>;
                                            })
                                        ) : (<></>)
                                    }</IonLabel>
                                    <div className="metadata-end-wrapper" slot="end">
                                        <p>{getDateString(record.time.created)}</p>
                                    </div>
                                </IonItem>)
                            })
                        }
                    </IonList>
                </>)
            }</IonContent>
            <IonFooter collapse="fade">
                <IonToolbar>
                    <IonButton
                        expand="block" size="large" color="danger"
                        onClick={reportRecords}
                        style={{ margin: 16 }}
                    >Report Now</IonButton>
                </IonToolbar>
            </IonFooter>
        </IonModal>
    ) : (
        <IonModal ref={modalRef}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => modalRef.current?.dismiss()}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>
                        Error
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
        </IonModal>
    )}</>;
};

export default SuspectedCaseModal;