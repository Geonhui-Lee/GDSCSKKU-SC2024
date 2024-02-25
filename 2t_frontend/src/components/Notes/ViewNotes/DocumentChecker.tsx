import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonText, IonIcon, IonItem, IonLabel, IonList, IonNote } from "@ionic/react";
import CommonContainer from "components/Guest/CommonContainer";
import { TelenotesManifest } from "data/standard/document/telenotes";
import { stickyFooterStyle } from "data/style";
import { requestTelenotesDocumentGeneration } from "hooks/apiRequest";
import { CachedTelenotesDocument, isCachedDocumentComplete } from "hooks/pages/telenotes/data";
import { readTelenotesDocument, uploadRecordingToDocument } from "hooks/pages/telenotes/filesystem/documentFS";
import { deleteTelenotesDocumentMedia, getFilenameFromTelenotesDocumentMedia, readTelenotesDocumentMedia } from "hooks/pages/telenotes/filesystem/documentMediaFS";
import { getTelenotesItemValue } from "hooks/pages/telenotes/search";
import { alertCircleOutline, checkmarkCircle, cloudUploadOutline, documentOutline, linkOutline, trashOutline } from "ionicons/icons";
import { CachedNoteDocumentContext } from "pages/Notes/ViewNotes";
import { useContext, useRef } from "react";

interface ViewNoteDocumentCheckerProps {
    manifest: TelenotesManifest;
}

const ViewNoteDocumentChecker: React.FC<ViewNoteDocumentCheckerProps> = ({ manifest }) => {
    const [document, setDocument] = [
        useContext(CachedNoteDocumentContext)?.noteDocument,
        useContext(CachedNoteDocumentContext)?.setNoteDocument
    ] as [CachedTelenotesDocument, React.Dispatch<React.SetStateAction<CachedTelenotesDocument>>];

    const UnavailableDataSolutionItem: React.FC<{ children: React.ReactNode, data?: any  }> = ({ children, data }) => {
        return (data !== undefined) ? (<></>) : (<>{children}</>)
    }
    const DataAvailabilityItem: React.FC<{ label: string, data?: any }> = ({ label, data }) => {
        return (
            <IonItem>
                {(data !== undefined) ?
                    (<IonIcon color="success" slot="start" icon={checkmarkCircle} size="large"></IonIcon>) :
                    (<IonIcon color="danger" slot="start" icon={alertCircleOutline} size="large"></IonIcon>)
                }
                <IonLabel>{label}</IonLabel>
                <IonNote slot="end" color={
                    (data !== undefined) ? ("success") : ("danger")
                }>{
                    (data !== undefined) ? ("OK") : ("Unavailable")
                }</IonNote>
            </IonItem>
        )
    }

    const blankData = {
        summary: {
            description: "A blank description",
            lists: ["A blank list item 1", "A blank list item 2"],
            keywords: ["Keyword 1", "Keyword 2"]
        },
        transcript: [
            {
                content: "A blank transcript item 1",
            },
            {
                content: "A blank transcript item 2"
            }
        ]
    }
    const solutionActions = {
        undefined: {
            createBlankDocument: () => {
                setDocument({
                    id: manifest.id,
                    manifestInfo: {
                        ...manifest.info
                    },
                    summary: blankData.summary,
                    transcript: blankData.transcript
                });
            }
        },
        incomplete: {
            requestNewSummaryAndTranscript: async () => {
                if (document === undefined || document.media === undefined) return;

                async function request(file: File) {
                    if (document === undefined) return;
                    const response = await requestTelenotesDocumentGeneration(
                        document.id,
                        file,
                    );
                    const generatedDocument = response.document;
                    setDocument({
                        ...document,
                        summary: generatedDocument.summary,
                        transcript: generatedDocument.transcript
                    });
                }
                const fileName = getFilenameFromTelenotesDocumentMedia(document.media);
                if (fileName) {
                    const audioFile = await readTelenotesDocumentMedia(fileName);
                    if (audioFile) {
                        request(audioFile);
                    };
                }
            },
            createBlankSummary: () => {
                if (document === undefined) return;
                setDocument({
                    ...document,
                    summary: blankData.summary
                });
            },
            createBlankTranscript: () => {
                if (document === undefined) return;
                setDocument({
                    ...document,
                    transcript: blankData.transcript
                });
            },
            relinkMedia: () => {
                if (document === undefined) return;
                importFileInputRef.current?.click();
            }
        },
        complete: {
            unlinkMedia: async () => {
                if (document === undefined || document.media === undefined) return;
                const fileName = getFilenameFromTelenotesDocumentMedia(document.media);
                if (fileName === undefined) return;

                await deleteTelenotesDocumentMedia(fileName);
                setDocument({
                    ...document,
                    media: undefined
                });
            }
        }
    }

    const importFileInputRef = useRef<HTMLInputElement>(null);
    const handleImportFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        async function onEventComplete() {
            const newDocumentData = await readTelenotesDocument(manifest.id);
            if (newDocumentData) {
                setDocument(newDocumentData);
            }
        }
        if (event.target.files) {
            const file = event.target.files[0];
            if (file === undefined) return;
            uploadRecordingToDocument(file, manifest.id, onEventComplete);
        }
    }

    if (document === undefined) {
        return (<>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle style={{ fontSize: 24 }}>
                        Document not found!
                    </IonCardTitle>
                    <IonCardSubtitle>{
                        (manifest.info.title) ? (manifest.info.title) : (
                            <>A document created at {getTelenotesItemValue.dateString(manifest)}</>
                        )
                    }</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonText>
                        No document associated with the corresponding TeleNote ID was found.<br/>
                        <small>(ID: {manifest.id})</small>
                    </IonText>
                </IonCardContent>
            </IonCard>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>
                        Available Solutions
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <section>
                        <IonText>You can consider the following solutions to fix the document issue.</IonText>
                        <IonList inset={true} style={{ margin: "16px 0" }}>
                            <UnavailableDataSolutionItem>
                                <IonItem button={true} onClick={solutionActions.undefined.createBlankDocument}>
                                    <IonIcon color="primary" slot="start" icon={documentOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>Create blank document</strong>
                                        <IonNote className="ion-text-wrap">
                                            Create a blank document to input the content manually. (Requires manually link with a media file after creation)
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                            <UnavailableDataSolutionItem>
                                <IonItem>
                                    <IonIcon color="primary" slot="start" icon={trashOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>Delete the document</strong>
                                        <IonNote className="ion-text-wrap">
                                            Delete the document and start with a new one.
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                        </IonList>
                    </section>
                </IonCardContent>
            </IonCard>
        </>)
    }
    else if (document !== undefined && !isCachedDocumentComplete(document)) {
        return (<>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle style={{ fontSize: 24 }}>
                        Some document data is unavailable!
                    </IonCardTitle>
                    <IonCardSubtitle>{
                        (manifest.info.title) ? (manifest.info.title) : (
                            <>A document created at {getTelenotesItemValue.dateString(manifest)}</>
                        )
                    }</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonText>The document has the following missing data.</IonText>
                    <IonList inset={true} style={{ margin: "16px 0" }}>
                        <DataAvailabilityItem label="Summary" data={document.summary} />
                        <DataAvailabilityItem label="Transcript" data={document.transcript && document.transcript[0]} />
                        <DataAvailabilityItem label="Phone Recording (optional)" data={document.media} />
                    </IonList>
                    <IonText>You may either consider the following solutions to resolve the issue or start with a new document.</IonText>
                </IonCardContent>
            </IonCard>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>
                        Available Solutions
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <section>
                        <IonText>You can consider the following solutions to fix the document issue.</IonText>
                        <IonList inset={true} style={{ margin: "16px 0" }}>
                            <UnavailableDataSolutionItem data={document.summary && document.transcript}>
                                <IonItem button={true} onClick={solutionActions.incomplete.requestNewSummaryAndTranscript}>
                                    <IonIcon color="primary" slot="start" icon={cloudUploadOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>
                                            Request new summary and/or transcript
                                        </strong>
                                        <IonNote className="ion-text-wrap">
                                            Re-upload the audio recording to request a new summary and/or transcript generation to the server.
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                            <UnavailableDataSolutionItem data={document.summary}>
                                <IonItem button={true} onClick={solutionActions.incomplete.createBlankSummary}>
                                    <IonIcon color="primary" slot="start" icon={documentOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>Manually input the summary</strong>
                                        <IonNote className="ion-text-wrap">
                                            Create a blank summary to input the content manually.
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                            <UnavailableDataSolutionItem data={document.transcript && document.transcript[0]}>
                                <IonItem button={true} onClick={solutionActions.incomplete.createBlankTranscript}>
                                    <IonIcon color="primary" slot="start" icon={documentOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>Manually input the transcript</strong>
                                        <IonNote className="ion-text-wrap">
                                            Create a blank transcript to input the content manually.
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                            <UnavailableDataSolutionItem data={document.media}>
                                <IonItem button={true} onClick={solutionActions.incomplete.relinkMedia}>
                                    <IonIcon color="primary" slot="start" icon={linkOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>Relink the media</strong>
                                        <IonNote className="ion-text-wrap">
                                            Re-upload the audio recording to fix the media issue.
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                            <UnavailableDataSolutionItem>
                                <IonItem>
                                    <IonIcon color="primary" slot="start" icon={trashOutline} size="large"></IonIcon>
                                    <IonLabel>
                                        <strong>Delete the document</strong>
                                        <IonNote className="ion-text-wrap">
                                            Delete the document and start with a new one.
                                        </IonNote>
                                    </IonLabel>
                                </IonItem>
                            </UnavailableDataSolutionItem>
                        </IonList>
                    </section>
                </IonCardContent>
            </IonCard>
            <input type="file" onChange={handleImportFileInputChange} multiple={false} ref={importFileInputRef} hidden />
        </>);
    }
    else {
        return (<>
            <CommonContainer>
                <section>
                    <IonIcon icon={checkmarkCircle} color="success" style={{ fontSize: "6em" }} />
                    <h1>No issues found!</h1>
                    <p>All data are available and complete.</p>
                </section>
            </CommonContainer>
            <div style={stickyFooterStyle}>
                <IonList inset={true}>
                    <IonItem onClick={solutionActions.complete.unlinkMedia} button={true}>
                        <IonIcon color="primary" slot="start" icon={trashOutline} size="large"></IonIcon>
                        <IonLabel>
                            <strong>Unlink the media</strong>
                            <IonNote className="ion-text-wrap">
                                Unlink the existing recording audio from the document.
                            </IonNote>
                        </IonLabel>
                    </IonItem>
                </IonList>
            </div>
        </>);
    }
}

export default ViewNoteDocumentChecker;