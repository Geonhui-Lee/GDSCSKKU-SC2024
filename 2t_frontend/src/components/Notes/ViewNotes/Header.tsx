import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip, IonText, IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import DelayedRenderingComponent from "components/Miscellaneous/DelayedRenderComponent";
import { TelenotesDocument, TelenotesManifest } from "data/standard/document/telenotes";
import { getTelenotesItemValue } from "hooks/pages/telenotes/search";
import { CachedTelenotesDocument, isCachedDocumentComplete } from "hooks/pages/telenotes/data";
import { CachedNoteDocumentContext } from "pages/Notes/ViewNotes";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import ViewNoteDocumentChecker from "./DocumentChecker";

interface ViewNoteDocumentHeaderProps {
    manifest?: TelenotesManifest;
    documentCheckerModalRef: React.RefObject<HTMLIonModalElement>;
}

const ViewNoteDocumentHeader: React.FC<ViewNoteDocumentHeaderProps> = ({ manifest, documentCheckerModalRef }) => {

    const [document, setDocument] = [
        useContext(CachedNoteDocumentContext)?.noteDocument,
        useContext(CachedNoteDocumentContext)?.setNoteDocument
    ] as [CachedTelenotesDocument, React.Dispatch<React.SetStateAction<CachedTelenotesDocument>>];

    if (manifest === undefined) {
        return <DelayedRenderingComponent content={<>Failed to load the manifest data.</>} loadingMessage={"Loading manifeset..."} time={0} />
    }
    else if (document === undefined) {
        return <DelayedRenderingComponent content={<>Undefined document data.</>} loadingMessage={"Loading document..."} time={0} />
    }
    else if (document.summary === undefined) {
        return <DelayedRenderingComponent content={<>Undefined summary data..</>} loadingMessage={"Loading summary..."} time={0} />
    }
    else {
        const documentSummary = document.summary;
        return (<>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle style={{ fontSize: 24 }}>{manifest.info?.title}</IonCardTitle>
                    <IonCardSubtitle>
                        {getTelenotesItemValue.dateString(manifest)} {getTelenotesItemValue.timeString(manifest)}
                    </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <section style={{ marginBottom: 8 }}>
                        <IonText color="dark">{documentSummary.description}</IonText>
                    </section>
                    <section>
                        {
                            documentSummary.lists.length > 0 ? (
                                    <ul style={{ margin: 0 }}>
                                        {documentSummary.lists.map((item, index) => (
                                            <li key={index} style={{ marginBottom: 4 }}>{item}</li>
                                        ))}
                                    </ul>
                                
                            ) : (<></>)
                        }
                    </section>
                    <section style={{ marginTop: 16 }}>
                        {
                            documentSummary.keywords.length > 0 ? (
                                    documentSummary.keywords.map((item, index) => (
                                        <IonChip key={index}>{item}</IonChip>
                                    ))
                                ) : (<></>)
                        }
                    </section>
                    {
                        isCachedDocumentComplete(document) ? (<></>) : (
                            <section style={{ marginTop: 16 }}>
                                <IonText>
                                    Some document data is unavailable. <a style={{ cursor: "pointer" }} onClick={() => {
                                        documentCheckerModalRef.current?.present();
                                    }}>Tap here</a> to open the document checker.
                                </IonText>
                            </section>
                        )
                    }
                </IonCardContent>
            </IonCard>
        </>)
    }

};

export default ViewNoteDocumentHeader;