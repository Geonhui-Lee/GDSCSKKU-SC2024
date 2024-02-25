import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar, useIonActionSheet } from '@ionic/react';
import CommonContainer from "components/Guest/CommonContainer";
import { pageDestinations } from "data/destination";
import { alertOutline, call, chatbox, checkmarkOutline, ellipsisVertical, helpOutline, trash, warningOutline } from 'ionicons/icons';
import { useContext, useState } from 'react';
import { ContactManifest } from 'data/standard/document';
import { fetchContactManifests } from 'hooks/pages/contact/data';
import { mediaDestinations } from "data/destination";
import { ProtectorInvestigation, ProtectorRecord, ProtectorRecordCallData, ProtectorRecordSMSData } from 'data/standard/document/protector';
import { deleteProtectorRecord, generateProtectorRecordId, getAllProtectorRecords, writeProtectorRecord } from 'hooks/pages/protector/filesystem/recordFS';
import { ProtectorHQContext } from '.';
import { protectorHQContext } from 'hooks/context';
import { getDateString } from 'hooks/date';
import { deleteProtectorInvestigation } from 'hooks/pages/protector/filesystem/investigationFS';

const ProtectorHQDashboardPage: React.FC = ({}) => {
    function getContext() {
        return useContext(ProtectorHQContext) as ReturnType<typeof protectorHQContext.useContext>;
    }

    const openSuspectedCase = getContext().openSuspectedCase;
    const [protectorRecords, setProtectorRecords] = [getContext().protectorRecords, getContext().setProtectorRecords];
    const [protectorInvestigations, setProtectorInvestigations] = [getContext().protectorInvestigations, getContext().setProtectorInvestigations];

    const protectorRecordAction = {
        delete: (record: ProtectorRecord) => {
            setProtectorRecords(protectorRecords?.filter((item) => item !== record));
            if (record.id !== undefined) {
                deleteProtectorRecord(record.id);
            }
        }
    };
    const protectorInvestigationAction = {
        delete: (investigation: ProtectorInvestigation) => {
            setProtectorInvestigations(protectorInvestigations?.filter((item) => item !== investigation));
            deleteProtectorInvestigation(investigation.id);
        }
    }

    function getRecordItemIcon(record: ProtectorRecord): JSX.Element {
        if (record.type === "call") {
            return <IonIcon icon={call} slot="start" />;
        }
        else if (record.type === "sms") {
            return <IonIcon icon={chatbox} slot="start" />;
        }
        else {
            return <IonIcon icon={ellipsisVertical} slot="start" />;
        }
    }

    function getInvestigationItemIcon(investigation: ProtectorInvestigation): JSX.Element {
        if (investigation.result) {
            if (investigation.result.status === "danger") {
                return <IonIcon icon={warningOutline} slot="start" color="danger" />;
            }
            else if (investigation.result.status === "warning") {
                return <IonIcon icon={alertOutline} slot="start" color="warning" />;
            }
            else if (investigation.result.status === "safe") {
                return <IonIcon icon={checkmarkOutline} slot="start" color="success" />;
            }
        }
        return <IonIcon icon={helpOutline} slot="start" />;
    }

    const [presentActionSheet] = useIonActionSheet();
    function showActionSheet() {
        presentActionSheet({
            buttons: [],
        });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={pageDestinations.user.protect}></IonBackButton>
                    </IonButtons>
                    <IonTitle>Protector HQ</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={showActionSheet}>
                            <IonIcon icon={ellipsisVertical} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonContent>
                    <IonList inset={true}>
                        <IonItemDivider>Reported Cases</IonItemDivider>
                        {
                            (protectorInvestigations !== undefined && protectorInvestigations.length > 0) ? protectorInvestigations.map((investigation, index) => (
                                <IonItemSliding key={index}>
                                    <IonItem button={true} detail={false} onClick={() => {
                                        //setNoteId(item.id);
                                    }}>
                                        {getInvestigationItemIcon(investigation)}
                                        <IonLabel>
                                            <IonText>{investigation.case.contact.phoneNumber}</IonText>
                                            <br/>
                                            <IonNote color="medium" className="ion-text-wrap">
                                                {getDateString(
                                                    (investigation.time.modified) ? investigation.time.modified : investigation.time.created
                                                )}
                                            </IonNote>
                                        </IonLabel>
                                        <div className="metadata-end-wrapper" slot="end">
                                            <p>{
                                                (investigation.result) ? (
                                                    (investigation.result.status === "danger") ? <IonText color="danger">Danger</IonText> :
                                                    (investigation.result.status === "warning") ? <IonText color="warning">Warning</IonText> :
                                                    (investigation.result.status === "safe") ? <IonText color="success">Safe</IonText> :
                                                    "Unconfirmed"
                                                ) : "Unconfirmed"
                                            }</p>
                                        </div>
                                    </IonItem>
                                    <IonItemOptions slot="end">
                                        <IonItemOption color="danger" expandable={true} onClick={() => {
                                            protectorInvestigationAction.delete(investigation);
                                        }}>
                                            <IonIcon slot="icon-only" icon={trash}></IonIcon>
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            )) : (
                                <IonItem>
                                    <IonLabel>
                                        <h2>No investigations found</h2>
                                    </IonLabel>
                                </IonItem>
                            )
                        }
                    </IonList>
                    <IonList inset={true}>
                        <IonItemDivider>Suspected Cases</IonItemDivider>
                        {
                            (protectorRecords !== undefined && protectorRecords.length > 0) ? protectorRecords.map((record, index) => (
                                <IonItemSliding key={index}>
                                    <IonItem button={true} detail={true} onClick={() => {
                                        openSuspectedCase(record.contact);
                                    }}>
                                        {getRecordItemIcon(record)}
                                        <IonLabel>
                                            <IonText>{record.contact.phoneNumber}</IonText>
                                            <br/>
                                            <IonNote color="medium" className="ion-text-wrap">
                                                {getDateString(record.time.created)}
                                            </IonNote>
                                        </IonLabel>
                                    </IonItem>
                                    <IonItemOptions slot="end">
                                        <IonItemOption color="danger" expandable={true} onClick={() => {
                                            protectorRecordAction.delete(record);
                                        }}>
                                            <IonIcon slot="icon-only" icon={trash}></IonIcon>
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            )) : (
                                <IonItem>
                                    <IonLabel>
                                        <h2>No cases found</h2>
                                    </IonLabel>
                                </IonItem>
                            )
                        }
                    </IonList>
                </IonContent>
            </IonContent>
        </IonPage>
    );
};

export default ProtectorHQDashboardPage;