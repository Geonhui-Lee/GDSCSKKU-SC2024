import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar, useIonActionSheet } from '@ionic/react';
import { chevronForward, cloudUpload, create, ellipsisVertical, trash } from 'ionicons/icons';
import { useContext, useRef, useState } from 'react';
import { TelenotesManifest } from 'data/standard/document/telenotes';
import { telenotesContext } from 'hooks/context';
import { createNewDemoDocument } from 'hooks/pages/telenotes/filesystem/documentFS';
import { syncManifestWithDocuments } from 'hooks/pages/telenotes/filesystem/manifestFS';
import { importAllSavedRecordingsToTelenotes } from 'hooks/pages/telenotes/filesystem/documentSavedRecordingFS';
import { getFilteredTelenotesItemsGroup, sortTelenotesManifestGroup, getMappedTelenotesManifestGroup, getTelenotesItemValue } from 'hooks/pages/telenotes/search';
import CommonContainer from 'components/Guest/CommonContainer';
import ImportRecording from 'components/Notes/SearchNotes/ImportRecording';
import './SearchNotes.css';
import { TelenotesPageContext } from '.';

const SearchNotesPage: React.FC = () => {
    function getContext() {
        return useContext(TelenotesPageContext) as ReturnType<typeof telenotesContext.useContext>;
    }

    const [noteManifests, setNoteManifests] = [getContext().noteManifests, getContext().setNoteManifests];
    const [noteId, setNoteId] = [getContext().noteId, getContext().setNoteId];
    const deleteNoteManifest = getContext().deleteNoteManifest;
    const syncManifestFromFilesystem = getContext().syncManifestFromFilesystem;

    const [searchText, setSearchText] = useState<string>("");
    const handleInput = (ev: Event) => {
        setSearchText((ev.target as HTMLInputElement).value);
    };

    const importAlertRef = useRef<HTMLIonAlertElement>(null);
    function openImportAlert() {
        importAlertRef.current?.present();
    }

    const [presentActionSheet] = useIonActionSheet();
    function showActionSheet() {
        presentActionSheet({
            buttons: [
                {
                    text: 'Import Recording',
                    handler: () => {
                        openImportAlert();
                    }
                },
                {
                    text: 'Sync with local documents',
                    handler: () => {
                        syncManifestWithDocuments().then(() => {
                            syncManifestFromFilesystem();
                        });
                    }
                },
                {
                    text: 'Import from saved recordings',
                    handler: () => {
                        importAllSavedRecordingsToTelenotes().then(() => {
                            syncManifestFromFilesystem();
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ],
        });
    }
    
    function getFilteredTelenotes() {
        return getFilteredTelenotesItemsGroup(sortTelenotesManifestGroup.byReversedDate, noteManifests, searchText);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>TeleNotes</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">TeleNotes</IonTitle>
                        <IonButtons slot="primary">
                            <IonButton onClick={openImportAlert}>
                                <IonIcon slot="icon-only" icon={cloudUpload}></IonIcon>
                            </IonButton>
                            <IonButton onClick={showActionSheet}>
                                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar placeholder={"Search your notes..."} value={searchText} debounce={1000} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent style={{ height: "75vh" }}>{
                    (noteManifests.length > 0) ? (<>
                        <IonList inset={true}>
                            {
                                getMappedTelenotesManifestGroup(getFilteredTelenotes()).map((group, index) => (
                                    <IonItemGroup key={index}>
                                        <IonItemDivider>
                                            <IonLabel>{group.key}</IonLabel>
                                        </IonItemDivider>
                                        {
                                            group.items.map((item: TelenotesManifest, index) => (
                                                <IonItemSliding key={index}>
                                                    <IonItem button={true} detail={false} onClick={() => {
                                                        setNoteId(item.id);
                                                    }}>
                                                        <IonAvatar slot="start">
                                                            <img src={getTelenotesItemValue.avatar(item)} alt={getTelenotesItemValue.title(item)} />
                                                        </IonAvatar>
                                                        <IonLabel>
                                                            <IonText>{getTelenotesItemValue.title(item)}</IonText>
                                                            <br/>
                                                            <IonNote color="medium" className="ion-text-wrap">{getTelenotesItemValue.info(item)}</IonNote>
                                                        </IonLabel>
                                                        <div className="metadata-end-wrapper" slot="end">
                                                            <IonNote color="medium" style={{ marginRight: 4 }}>
                                                                {getTelenotesItemValue.timeString(item)}
                                                            </IonNote>
                                                            <IonIcon color="medium" icon={chevronForward}></IonIcon>
                                                        </div>
                                                    </IonItem>
                                                    <IonItemOptions slot="end">
                                                        <IonItemOption color="danger" expandable={true} onClick={() => {
                                                            deleteNoteManifest(item.id);
                                                        }}>
                                                            <IonIcon slot="icon-only" icon={trash}></IonIcon>
                                                        </IonItemOption>
                                                    </IonItemOptions>
                                                </IonItemSliding>
                                            ))
                                        }
                                    </IonItemGroup>
                                ))
                            }
                        </IonList>
                        <section style={{ textAlign: "center" }}>
                            <p style={{ color: "var(--ion-color-medium)" }}>End of the list</p>
                        </section>
                        <IonInfiniteScroll
                            onIonInfinite={(ev) => {
                                syncManifestWithDocuments().then(() => {
                                    ev.target.complete();
                                });
                            }}
                        >
                            <IonInfiniteScrollContent></IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </>) : (<>
                        <CommonContainer style={{ padding: 32 }}>
                            <h2>No notes found!</h2>
                            <p>Teletect will automatically generate notes for you when you make calls.</p>
                            <p>Alternatively, you can import notes from your existing recordings.</p>
                        </CommonContainer>
                    </>)}
                </IonContent>
                <ImportRecording importAlertRef={importAlertRef} />
            </IonContent>
        </IonPage>
    );
};

export default SearchNotesPage;