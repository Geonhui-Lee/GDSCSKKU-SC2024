import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonPage, useIonRouter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonIcon, useIonActionSheet, IonAlert, AlertInput, IonModal, IonItem, IonInput, IonItemGroup, IonItemDivider, IonLabel, IonTextarea, IonToast, IonText, IonList, IonNote } from "@ionic/react"
import CommonContainer from "components/Guest/CommonContainer";
import { ellipsisVertical } from "ionicons/icons";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { pageDestinations } from "data/destination";
import { TelenotesDocument, TelenotesDocumentSingleTranscript, TelenotesManifest } from "data/standard/document/telenotes";
import { telenotesContext } from "hooks/context";
import { getTelenotesItemValue } from "hooks/pages/telenotes/search";
import { readTelenotesDocument, writeTelenotesDocument } from "hooks/pages/telenotes/filesystem/documentFS";
import { CachedTelenotesDocument, CachedTelenotesDocumentContext, isCachedDocumentComplete } from "hooks/pages/telenotes/data";
import ViewNoteDocumentHeader from "components/Notes/ViewNotes/Header";
import ViewNoteDocumentBody from "components/Notes/ViewNotes/Body";
import ViewNoteDocumentChecker from "components/Notes/ViewNotes/DocumentChecker";
import { TelenotesPageContext } from "pages/Notes";

export const CachedNoteDocumentContext = createContext<CachedTelenotesDocumentContext | null>(null);

const ViewNotesPage: React.FC = () => {
    function getContext() {
        return useContext(TelenotesPageContext) as ReturnType<typeof telenotesContext.useContext>;
    }

    const router = useIonRouter();

    const [noteManifests, setNoteManifests] = [getContext().noteManifests, getContext().setNoteManifests];
    const [noteId, setNoteId] = [getContext().noteId, getContext().setNoteId];

    const currentNoteManifest: TelenotesManifest | undefined = useMemo(() => {
        return noteManifests.find(note => note.id === noteId);
    }, [noteId, noteManifests]);

    const [noteDocument, setNoteDocument] = useState<CachedTelenotesDocument>(undefined);
    useEffect(() => {
        readTelenotesDocument(noteId).then((result: CachedTelenotesDocument) => {
            if (result !== undefined) {
                setNoteDocument(result);
            }
            else {
                console.log("no document found.");
            }
        });
    }, [currentNoteManifest]);
    useEffect(() => {
        if (noteDocument !== undefined) {
            writeTelenotesDocument(noteId, noteDocument).then(() => {});
        }
    }, [noteDocument]);

    function addTranscriptItem(targetIndex: number, newContent: string, speakerTag?: TelenotesDocumentSingleTranscript["speakerTag"]) {
        if (noteDocument === undefined) return;
        if (noteDocument.transcript === undefined) return;
        const newTranscript = noteDocument.transcript.slice();
        newTranscript.splice(targetIndex, 0, {
            content: newContent,
            speakerTag: speakerTag,
        });
        setNoteDocument({ ...noteDocument, transcript: newTranscript });
    }
    function editTranscriptItem(targetIndex: number, editedContent: string, speakerTag?: TelenotesDocumentSingleTranscript["speakerTag"]) {
        if (noteDocument === undefined || noteDocument.transcript === undefined) return;
        const newTranscriptItem: TelenotesDocumentSingleTranscript = {
            ...noteDocument.transcript[targetIndex],
            content: editedContent,
            speakerTag: speakerTag ? speakerTag : noteDocument.transcript[targetIndex].speakerTag,
        }
        const newTranscript = noteDocument.transcript.map((item, index) => (index === targetIndex) ? newTranscriptItem : item);
        setNoteDocument({
            ...noteDocument,
            transcript: newTranscript
        });
    }

    function deleteTranscriptItem(targetIndex: number) {
        if (noteDocument !== undefined && noteDocument.transcript !== undefined) {
            const newTranscript = noteDocument.transcript.filter((item, i) => i !== targetIndex);
            setNoteDocument({
                ...noteDocument,
                transcript: newTranscript
            });
        }
    }

    const editDocumentModalRef = useRef<HTMLIonModalElement>(null);
    const editDocumentElementRef = {
        title: useRef<HTMLIonInputElement>(null),
        summaryDescription: useRef<HTMLIonInputElement>(null),
        summaryList: useRef<HTMLIonTextareaElement>(null),
        summaryKeywords: useRef<HTMLIonTextareaElement>(null),
        contactName: useRef<HTMLIonInputElement>(null),
        contactPhoneNumber: useRef<HTMLIonInputElement>(null),
    };
    const editDocumentElementStyles = {
        ionItem: {
            padding: "4px 0",
        } as React.CSSProperties,
        ionItemGroup: {
            marginBottom: 16,
        } as React.CSSProperties,
    };
    const editDocumentSeparator = {
        summaryList: "\n",
        summaryKeywords: ",",
    }
    const editDocumentToastRef = useRef<HTMLIonToastElement>(null);
    const [isEditDocumentToastOpen, setIsEditDocumentToastOpen] = useState(false);
    const [editDocumentToastMessage, setEditDocumentToastMessage] = useState("");
    function showEditDocumentToast(message: string) {
        setEditDocumentToastMessage(message);
        setIsEditDocumentToastOpen(true);
    }
    function editDocumentModalConfirm() {
        function getInputValueAsString(ref: React.RefObject<HTMLIonInputElement>): string | undefined {
            if (ref.current !== null && ref.current !== undefined) {
                const value = ref.current.value;
                return typeof value === 'string' ? value : undefined;
            }
        }
        function getTextAreaValueAsString(ref: React.RefObject<HTMLIonTextareaElement>): string | undefined {
            if (ref.current !== null && ref.current !== undefined) {
                const value = ref.current.value;
                return typeof value === 'string' ? value : undefined;
            }
        }

        if (currentNoteManifest === undefined || noteDocument === undefined) {
            showEditDocumentToast("Failed to update the document.");
            return;
        }

        const newCurrentNoteManifest: TelenotesManifest = {
            ...currentNoteManifest,
            time: {
                ...currentNoteManifest.time,
                modified: new Date(),
            },
            info: {
                ...currentNoteManifest.info,
                title: getInputValueAsString(editDocumentElementRef.title),
                contact: {
                    ...currentNoteManifest.info.contact,
                    name: getInputValueAsString(editDocumentElementRef.contactName),
                    phoneNumber: getInputValueAsString(editDocumentElementRef.contactPhoneNumber) ?? "",
                }
            }
        }
        const newNoteManifests = noteManifests.map(note => (note.id === noteId) ? newCurrentNoteManifest : note);
        setNoteManifests(newNoteManifests);

        const newDocument: TelenotesDocument = {
            ...noteDocument,
            id: noteDocument.id ?? "",
            manifestInfo: {
                ...noteDocument.manifestInfo,
                title: getInputValueAsString(editDocumentElementRef.title),
                contact: {
                    ...noteDocument.manifestInfo?.contact,
                    name: getInputValueAsString(editDocumentElementRef.contactName),
                    phoneNumber: getInputValueAsString(editDocumentElementRef.contactPhoneNumber) ?? "",
                }
            },
            summary: {
                description: getInputValueAsString(editDocumentElementRef.summaryDescription) ?? "",
                lists: getTextAreaValueAsString(editDocumentElementRef.summaryList)?.split(editDocumentSeparator.summaryList) ?? [],
                keywords: getTextAreaValueAsString(editDocumentElementRef.summaryKeywords)?.split(editDocumentSeparator.summaryKeywords) ?? [],
            },
        };
        console.log(newDocument);
        setNoteDocument(newDocument);
        
        editDocumentModalRef.current?.dismiss();
        showEditDocumentToast("Document updated successfully.");
    }

    const documentCheckerModalRef = useRef<HTMLIonModalElement>(null);

    const [presentActionSheet] = useIonActionSheet();
    function showActionSheet() {
        presentActionSheet({
            header: 'Document ID',
            subHeader: noteId,
            buttons: [
                {
                    text: 'Edit Document',
                    handler: () => {
                        editDocumentModalRef.current?.present();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ],
        });
    }

    return (currentNoteManifest !== undefined) ? (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={pageDestinations.user.notes}></IonBackButton>
                    </IonButtons>
                    <IonTitle>{getTelenotesItemValue.title(currentNoteManifest)}</IonTitle>
                    <IonButtons slot="primary">
                        <IonButton onClick={showActionSheet}>
                                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <CachedNoteDocumentContext.Provider value={{
                    noteDocument: noteDocument,
                    setNoteDocument: setNoteDocument,
                    addTranscriptItem: addTranscriptItem,
                    editTranscriptItem: editTranscriptItem,
                    deleteTranscriptItem: deleteTranscriptItem,
                }}>
                    {
                        isCachedDocumentComplete(noteDocument, true) ? (<>
                            <ViewNoteDocumentHeader manifest={currentNoteManifest} documentCheckerModalRef={documentCheckerModalRef} />
                            <ViewNoteDocumentBody manifest={currentNoteManifest} />
                            <IonModal ref={documentCheckerModalRef}>
                                <IonHeader>
                                    <IonToolbar>
                                        <IonTitle>Document Checker</IonTitle>
                                        <IonButtons slot="end">
                                            <IonButton onClick={() => documentCheckerModalRef.current?.dismiss()}>Close</IonButton>
                                        </IonButtons>
                                    </IonToolbar>
                                </IonHeader>
                                <IonContent>
                                    <ViewNoteDocumentChecker manifest={currentNoteManifest} />
                                </IonContent>
                            </IonModal>
                        </>) : (
                            <ViewNoteDocumentChecker manifest={currentNoteManifest} />
                        )
                    }
                </CachedNoteDocumentContext.Provider>
            </IonContent>

            <IonModal ref={editDocumentModalRef}>
                <IonHeader>
                    <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => editDocumentModalRef.current?.dismiss()}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => editDocumentModalConfirm()}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonItemGroup style={editDocumentElementStyles.ionItemGroup}>
                        <IonItemDivider>
                            <IonLabel>Content</IonLabel>
                        </IonItemDivider>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonInput
                                label="Title"
                                labelPlacement="stacked"
                                ref={editDocumentElementRef.title}
                                type="text"
                                value={noteDocument?.manifestInfo?.title}
                                placeholder="Enter title..."
                            />
                        </IonItem>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonInput
                                label="Summary Description"
                                labelPlacement="stacked"
                                ref={editDocumentElementRef.summaryDescription}
                                type="text"
                                value={noteDocument?.summary?.description}
                                placeholder="Enter summary description..."
                            />
                        </IonItem>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonTextarea
                                label="Summary List"
                                labelPlacement="stacked"
                                ref={editDocumentElementRef.summaryList}
                                value={noteDocument?.summary?.lists.join( editDocumentSeparator.summaryList )}
                                placeholder="Enter summary lists..."
                                helperText="Each line will be a list item."
                            ></IonTextarea>
                        </IonItem>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonTextarea
                                label="Summary Keywords"
                                labelPlacement="stacked"
                                ref={editDocumentElementRef.summaryKeywords}
                                value={noteDocument?.summary?.keywords.join( editDocumentSeparator.summaryKeywords )}
                                placeholder="Enter summary keywords..."
                                helperText="Comma-separated"
                            ></IonTextarea>
                        </IonItem>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonInput
                                label="Document ID"
                                labelPlacement="stacked"
                                type="text"
                                value={noteId}
                                readonly={true}
                            />
                        </IonItem>
                    </IonItemGroup>
                    <IonItemGroup style={editDocumentElementStyles.ionItemGroup}>
                        <IonItemDivider>
                            <IonLabel>Contact</IonLabel>
                        </IonItemDivider>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonInput
                                label="Name"
                                labelPlacement="stacked"
                                ref={editDocumentElementRef.contactName}
                                type="text"
                                value={noteDocument?.manifestInfo?.contact.name}
                                placeholder="Enter contact name..."
                            />
                        </IonItem>
                        <IonItem style={editDocumentElementStyles.ionItem}>
                            <IonInput
                                label="Phone Number"
                                labelPlacement="stacked"
                                ref={editDocumentElementRef.contactPhoneNumber}
                                type="text"
                                value={noteDocument?.manifestInfo?.contact.phoneNumber}
                                placeholder="Enter phone number..."
                            />
                        </IonItem>
                    </IonItemGroup>
                    <IonItemGroup>
                        <IonItemDivider>
                            <IonLabel>Miscellaneous</IonLabel>
                        </IonItemDivider>
                        <IonList inset={true} style={{margin: "4px 0"}}>
                            <IonItem button={true} detail={true} onClick={() => documentCheckerModalRef.current?.present()}>
                                <IonLabel>
                                    <strong>Document Checker</strong>
                                    <IonNote className="ion-text-wrap">
                                        Check the document for any missing or incomplete data.
                                    </IonNote>
                                </IonLabel>
                            </IonItem>
                        </IonList>
                    </IonItemGroup>
                </IonContent>
            </IonModal>
            <IonToast
                isOpen={isEditDocumentToastOpen}
                message={editDocumentToastMessage}
                onDidDismiss={() => setIsEditDocumentToastOpen(false)}
                duration={5000}
            ></IonToast>
        </IonPage>
    ) : (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={pageDestinations.user.notes}></IonBackButton>
                    </IonButtons>
                    <IonTitle>Error</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <CommonContainer>
                    <p>Sorry, the note you are looking for does not exist.</p>
                </CommonContainer>
            </IonContent>
        </IonPage>
    );
};

export default ViewNotesPage;