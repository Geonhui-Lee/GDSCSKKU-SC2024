import { IonAlert, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { pageDestinations } from 'data/destination';
import { TelenotesManifest, TelenotesId, TelenotesManifests } from 'data/standard/document/telenotes';
import { telenotesContext } from 'hooks/context';
import { deleteTelenotesManifestItem, readTelenotesManifest, writeTelenotesManifest } from 'hooks/pages/telenotes/filesystem/manifestFS';
import SearchNotes from 'pages/Notes/SearchNotes';
import ViewNotes from 'pages/Notes/ViewNotes';

import { doc, setDoc } from "firebase/firestore";
import { firebaseAuth, firestore } from 'hooks/firebase/core';

export const TelenotesPageContext = telenotesContext.createContext();

const NotesPage: React.FC = () => {

    const router = useIonRouter();
    
    const [noteManifests, setNoteManifests] = useState<TelenotesManifest[]>([]);
    function syncManifestFromFilesystem() {
        readTelenotesManifest().then((result: TelenotesManifests) => {
            setNoteManifests(result);
        });
    }
    const noteManifestController = {
        delete: async (id: TelenotesId) => {
            await deleteTelenotesManifestItem(id);
            await syncManifestFromFilesystem();
        }
    }
    useEffect(() => { syncManifestFromFilesystem(); }, []);
    useEffect(() => {
        writeTelenotesManifest(noteManifests).then(() => {});
        setDoc(doc(firestore, "telenotes", firebaseAuth.currentUser?.uid || "anonymous"), {
            jsonData: JSON.stringify(noteManifests)
        });
    }, [noteManifests]);

    const noteId: string = useParams<{ id: string }>().id;
    function setNoteId(noteId: string) {
        router.push(
            pageDestinations.user.specific.note.replace(":id", noteId)
        );
    }

    const [noteControllerTargetId, setNoteControllerTargetId] = useState<TelenotesId | undefined>(undefined);
    const deleteNoteManifestAlertRef = useRef<HTMLIonAlertElement>(null);
    function askDeleteNoteManifest(id: TelenotesId) {
        setNoteControllerTargetId(id);
        deleteNoteManifestAlertRef.current?.present();
    }

    return (
        <TelenotesPageContext.Provider value={{
            noteManifests: noteManifests,
            setNoteManifests: setNoteManifests,
            noteId: noteId,
            setNoteId: setNoteId,
            deleteNoteManifest: askDeleteNoteManifest,
            syncManifestFromFilesystem: syncManifestFromFilesystem
        }}>
            {
                (noteId !== undefined) ? <ViewNotes /> : <SearchNotes />
            }
            <IonAlert
                ref={deleteNoteManifestAlertRef}
                header="Are you sure?"
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                    {
                        text: 'OK',
                        role: 'destructive',
                        handler: () => {
                            if (noteControllerTargetId !== undefined) {
                                noteManifestController.delete(noteControllerTargetId);
                            }
                        },
                    },
                ]}
            ></IonAlert>
        </TelenotesPageContext.Provider>
    );
};

export default NotesPage;