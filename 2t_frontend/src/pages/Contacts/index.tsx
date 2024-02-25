import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar, useIonActionSheet } from '@ionic/react';
import { call, ellipsisVertical } from 'ionicons/icons';
import { useState } from 'react';
import CommonContainer from 'components/Guest/CommonContainer';
import { filterContactManifestGroup, getContactItemValue, getFilteredTelenotesItemsGroup, getMappedContactManifestGroup } from 'hooks/pages/contact/search';
import { ContactManifest } from 'data/standard/document';
import { doPhoneCall } from 'pages/Call';
import { fetchContactManifests } from 'hooks/pages/contact/data';

const ContactPage: React.FC = () => {
    const [contacts, setContacts] = useState<ContactManifest[]>([]);

    const [searchText, setSearchText] = useState<string>("");
    const handleInput = (ev: Event) => {
        setSearchText((ev.target as HTMLInputElement).value);
    };

    const [presentActionSheet] = useIonActionSheet();
    function showActionSheet() {
        presentActionSheet({
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ],
        });
    }
    
    function getFilteredContacts() {
        return getFilteredTelenotesItemsGroup(filterContactManifestGroup.byAlphabetically, contacts, searchText);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Contacts</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Contacts</IonTitle>
                        <IonButtons slot="primary">
                            <IonButton onClick={showActionSheet}>
                                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar placeholder={"Search your contacts..."} value={searchText} debounce={1000} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent style={{ height: "75vh" }}>{
                    (contacts.length > 0) ? (<>
                        <IonList inset={true}>
                            {
                                getMappedContactManifestGroup(getFilteredContacts()).map((group, index) => (
                                    <IonItemGroup key={index}>
                                        <IonItemDivider>
                                            <IonLabel>{group.key}</IonLabel>
                                        </IonItemDivider>
                                        {
                                            group.items.map((item: ContactManifest, index) => (
                                                <IonItemSliding key={index}>
                                                    <IonItem button={true} detail={false} onClick={() => {
                                                        doPhoneCall(item.phoneNumber);
                                                    }}>
                                                        <IonAvatar slot="start">
                                                            <img src={getContactItemValue.avatar(item)} alt={getContactItemValue.title(item)} />
                                                        </IonAvatar>
                                                        <IonLabel>
                                                            <IonText>{getContactItemValue.title(item)}</IonText>
                                                        </IonLabel>
                                                        {/* <div className="metadata-end-wrapper" slot="end">
                                                            <IonNote color="medium" style={{ marginRight: 4 }}>
                                                                {getTelenotesItemValue.timeString(item)}
                                                            </IonNote>
                                                            <IonIcon color="medium" icon={chevronForward}></IonIcon>
                                                        </div> */}
                                                    </IonItem>
                                                    <IonItemOptions slot="end">
                                                        <IonItemOption color="success" expandable={true} onClick={() => {
                                                            doPhoneCall(item.phoneNumber);
                                                        }}>
                                                            <IonIcon slot="icon-only" icon={call}></IonIcon>
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
                                fetchContactManifests([contacts, setContacts]);
                                setTimeout(() => ev.target.complete(), 500);
                            }}
                        >
                            <IonInfiniteScrollContent></IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </>) : (<>
                        <CommonContainer style={{ padding: 32 }}>
                            <h2>No contacts found!</h2>
                            <p>Teletect is unable to find any contacts in your device.</p>
                        </CommonContainer>
                    </>)
                }</IonContent>
            </IonContent>
        </IonPage>
    );
};

export default ContactPage;