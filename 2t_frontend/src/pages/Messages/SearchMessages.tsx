import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemDivider, IonItemGroup, IonItemSliding, IonLabel, IonList, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar, useIonActionSheet } from "@ionic/react";
import { mediaDestinations } from "data/destination";
import { ContactManifest } from "data/standard/document";
import { messagesContext } from "hooks/context";
import { ellipsisVertical } from "ionicons/icons";
import { useContext, useState } from "react";
import { MessagesPageContext } from ".";
import { MessagesDocument, MessagesDocuments } from "data/standard/document/messages";
import { GrouppedMessagesDocuments, getMessagesDocumentItemValue } from "hooks/pages/messages/search";
import CommonContainer from "components/Guest/CommonContainer";

const SearchMessagesPage: React.FC = () => {
    function getContext() {
        return useContext(MessagesPageContext) as ReturnType<typeof messagesContext.useContext>;
    }

    const [currentMessagesDocument, setCurrentMessagesDocument] = [getContext().currentMessagesDocument, getContext().setCurrentMessagesDocument];
    const messagesDocuments = getContext().messagesDocuments;

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

    function getFilteredMessagesDocuments(): GrouppedMessagesDocuments {
        if (messagesDocuments === undefined) {
            return {
                "SMS": []
            }
        }
        return {
            "SMS": messagesDocuments
        };
    }

    function getMappedMessagesDocumentsGroup(grouppedItems: GrouppedMessagesDocuments) {
        return Object.entries(grouppedItems).map(([key, items], index) => ({
            key,
            items,
            index
        }));
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Messages</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Messages</IonTitle>
                        <IonButtons slot="primary">
                            <IonButton onClick={showActionSheet}>
                                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar placeholder={"Search your messages..."} value={searchText} debounce={1000} onIonInput={(ev) => handleInput(ev)}></IonSearchbar>
                    </IonToolbar>
                </IonHeader>
                <IonContent style={{ height: "75vh" }}>
                    {(messagesDocuments && messagesDocuments.length > 0) ? (<>
                        <IonList inset={true}>{
                            getMappedMessagesDocumentsGroup(getFilteredMessagesDocuments()).map((group, index) => (
                                <IonItemGroup key={index}>
                                    <IonItemDivider>
                                        <IonLabel>{group.key}</IonLabel>
                                    </IonItemDivider>
                                    {
                                        group.items.map((item: MessagesDocument, index) => (
                                            <IonItemSliding key={index}>
                                                <IonItem button={true} detail={false} onClick={() => {
                                                    setCurrentMessagesDocument(item);
                                                }}>
                                                    <IonAvatar slot="start">
                                                        <img src={getMessagesDocumentItemValue.avatar(item)} alt={"John"} />
                                                    </IonAvatar>
                                                    <IonLabel>
                                                        <IonText>{getMessagesDocumentItemValue.personName(item)}</IonText>
                                                        <br/>
                                                        <IonNote color="medium" className="ion-text-wrap">{getMessagesDocumentItemValue.message(item)}</IonNote>
                                                    </IonLabel>
                                                    <div className="metadata-end-wrapper" slot="end">
                                                        <IonNote color="medium" style={{ fontSize: 14, marginRight: 4 }}>
                                                            {getMessagesDocumentItemValue.dateString(item)}
                                                        </IonNote>
                                                    </div>
                                                </IonItem>
                                            </IonItemSliding>
                                        ))
                                    }
                                </IonItemGroup>
                            ))
                        }</IonList>
                        <section style={{ textAlign: "center" }}>
                            <p style={{ color: "var(--ion-color-medium)" }}>End of the list</p>
                        </section>
                        <IonInfiniteScroll
                            onIonInfinite={(ev) => {

                                setTimeout(() => ev.target.complete(), 500);
                            }}
                        >
                            <IonInfiniteScrollContent></IonInfiniteScrollContent>
                        </IonInfiniteScroll>
                    </>) : (<>
                        <CommonContainer style={{ padding: 32 }}>
                            <h2>No messages found!</h2>
                            <p>Teletect will automatically import messages from your phone.</p>
                        </CommonContainer>
                    </>)}
                </IonContent>
            </IonContent>
        </IonPage>
    );
}

export default SearchMessagesPage;