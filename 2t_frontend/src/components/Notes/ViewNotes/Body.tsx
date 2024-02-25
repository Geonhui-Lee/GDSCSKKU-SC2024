import { IonList, IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonAlert, AlertInput, IonButton } from "@ionic/react";
import { mediaDestinations } from "data/destination";
import { TelenotesManifest, TelenotesDocument } from "data/standard/document/telenotes";
import { stickyFooterStyle } from "data/style";
import { CachedTelenotesDocument } from "hooks/pages/telenotes/data";
import { getFilenameFromTelenotesDocumentMedia, getTelenotesDocumentMediaUrl, readTelenotesDocumentMedia } from "hooks/pages/telenotes/filesystem/documentMediaFS";
import { add, create, trash } from "ionicons/icons";
import { CachedNoteDocumentContext } from "pages/Notes/ViewNotes";
import { useContext, useEffect, useRef, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface ViewNoteDocumentHeaderProps {
    manifest?: TelenotesManifest;
}

const ViewNoteDocumentBody: React.FC<ViewNoteDocumentHeaderProps> = ({ manifest }) => {
    
    const [document, setDocument] = [
        useContext(CachedNoteDocumentContext)?.noteDocument,
        useContext(CachedNoteDocumentContext)?.setNoteDocument
    ] as [CachedTelenotesDocument, React.Dispatch<React.SetStateAction<CachedTelenotesDocument>>];
    const addTranscriptItem = useContext(CachedNoteDocumentContext)?.addTranscriptItem;
    const editTranscriptItem = useContext(CachedNoteDocumentContext)?.editTranscriptItem;
    const deleteTranscriptItem = useContext(CachedNoteDocumentContext)?.deleteTranscriptItem;

    const addTranscriptItemAlertRef = useRef<HTMLIonAlertElement>(null);
    function openAddTranscriptItemAlert(index: number) {
        setAddTranscriptItemTargetIndex(index);
        addTranscriptItemAlertRef.current?.present();
    }
    const [addTranscriptItemTargetIndex, setAddTranscriptItemTargetIndex] = useState<number | undefined>();

    const editTranscriptItemAlertRef = useRef<HTMLIonAlertElement>(null);
    function openEditTranscriptItemAlert(index: number) {
        setEditTranscriptItemTargetIndex(index);
        editTranscriptItemAlertRef.current?.present();
    }
    const [editTranscriptItemTargetIndex, setEditTranscriptItemTargetIndex] = useState<number | undefined>();
    
    const [playerAudioFile, setPlayerAudioFile] = useState<File | undefined>(undefined);
    const [playerSourceUrl, setPlayerSourceUrl] = useState<string | undefined>(undefined);

    async function initiateMediaPlayer() {
        if (document === undefined) return;
        if (document.media === undefined) return;
        const fileName = getFilenameFromTelenotesDocumentMedia(document.media);
        if (fileName) {
            const audioFile = await readTelenotesDocumentMedia(fileName);
            if (audioFile) {
                setPlayerAudioFile(audioFile);
            };
        }
    }
    useEffect(() => {
        if (playerAudioFile === undefined) return;
        const url = URL.createObjectURL(playerAudioFile);
        setPlayerSourceUrl(url);
    }, [playerAudioFile]);

    if (document === undefined) {
        return <>Undefined document data.</>;
    }
    else {
        return (
            <>
                <IonList inset={true}>
                    {
                        ( document.transcript !== undefined ) ? (
                            document.transcript.map((item, index) => (
                                <IonItemSliding key={index}>
                                    <IonItem button onClick={() => {openEditTranscriptItemAlert(index)}}>
                                        <IonAvatar aria-hidden="true" slot="start">
                                            <img src={mediaDestinations.user.telenotes.avatar.default} />
                                        </IonAvatar>
                                        <IonLabel>{item.content}</IonLabel>
                                    </IonItem>
                                    <IonItemOptions slot="end">
                                        <IonItemOption color="primary" onClick={() => {openAddTranscriptItemAlert(index+1)}}>
                                            <IonIcon slot="icon-only" icon={add}></IonIcon>
                                        </IonItemOption>
                                        <IonItemOption color="warning" onClick={() => {openEditTranscriptItemAlert(index)}}>
                                            <IonIcon slot="icon-only" icon={create}></IonIcon>
                                        </IonItemOption>
                                        <IonItemOption color="danger" expandable={true} onClick={() => {
                                            if (deleteTranscriptItem !== undefined) {
                                                deleteTranscriptItem(index);
                                            }
                                        }}>
                                            <IonIcon slot="icon-only" icon={trash}></IonIcon>
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            ))
                        ) : (<>Undefined transcript data.</>)
                    }
                </IonList>

                
                <IonAlert
                    ref={addTranscriptItemAlertRef}
                    header="Add Transcript"
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        },
                        {
                            text: 'Add as an opponent',
                            handler: (input: AlertInput) => {
                                if (addTranscriptItem === undefined || document.transcript === undefined || addTranscriptItemTargetIndex === undefined) return;
                                const alertInput: {0: string} = input as {0: string};
                                alertInput[0] = alertInput[0].trim();
                                const newTranscript = alertInput[0];
                                addTranscriptItem(addTranscriptItemTargetIndex, newTranscript, "opponent");
                            }
                        },
                        {
                            text: 'Add as a user',
                            handler: (input: AlertInput) => {
                                if (addTranscriptItem === undefined || document.transcript === undefined || addTranscriptItemTargetIndex === undefined) return;
                                const alertInput: {0: string} = input as {0: string};
                                alertInput[0] = alertInput[0].trim();
                                const newTranscript = alertInput[0];
                                addTranscriptItem(addTranscriptItemTargetIndex, newTranscript, "user");
                            }
                        }
                    ]}
                    inputs={[
                        {
                            type: 'textarea',
                            placeholder: 'Input the modified transcript...',
                            value: (
                                (document.transcript !== undefined && editTranscriptItemTargetIndex !== undefined) ? (document.transcript[editTranscriptItemTargetIndex]?.content) : ("")
                            ),
                        },
                    ]}
                ></IonAlert>
                <IonAlert
                    ref={editTranscriptItemAlertRef}
                    header="Edit Transcript"
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        },
                        {
                            text: 'Save',
                            handler: (input: AlertInput) => {
                                if (editTranscriptItem === undefined || editTranscriptItemTargetIndex === undefined) return;
                                const alertInput: {0: string} = input as {0: string};
                                alertInput[0] = alertInput[0].trim();
                                const editedContent = alertInput[0];
                                editTranscriptItem(editTranscriptItemTargetIndex, editedContent);
                            }
                        }
                    ]}
                    inputs={[
                        {
                            type: 'textarea',
                            placeholder: 'Input the modified transcript...',
                            value: (
                                (document.transcript !== undefined && editTranscriptItemTargetIndex !== undefined) ? (document.transcript[editTranscriptItemTargetIndex]?.content) : ("")
                            ),
                        },
                    ]}
                ></IonAlert>
                
                {
                    (document.media !== undefined) ? (
                        <IonList inset={true}>{
                            (playerAudioFile !== undefined && playerSourceUrl !== undefined) ? (
                                <AudioPlayer
                                    src={playerSourceUrl}
                                    style={{ width: "100%" }}
                                    layout="stacked"
                                />
                            ) : (<>
                                <IonButton onClick={initiateMediaPlayer} expand="block">Load Audio</IonButton>
                            </>)
                        }</IonList>
                    ) : (<></>)
                }
            </>
        );
    }
};

export default ViewNoteDocumentBody;