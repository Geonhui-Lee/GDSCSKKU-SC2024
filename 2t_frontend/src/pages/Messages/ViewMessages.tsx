import { useContext } from "react";
import { MessagesPageContext } from ".";
import { messagesContext } from "hooks/context";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel } from "@ionic/react";
import CommonContainer from "components/Guest/CommonContainer";
import { pageDestinations } from "data/destination";
import { getMessagesDocumentItemValue } from "hooks/pages/messages/search";

const ViewMessagesPage: React.FC = () => {
    function getContext() {
        return useContext(MessagesPageContext) as ReturnType<typeof messagesContext.useContext>;
    }

    const [currentMessagesDocument, setCurrentMessagesDocument] = [getContext().currentMessagesDocument, getContext().setCurrentMessagesDocument];

    return (currentMessagesDocument !== undefined) ? (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={pageDestinations.user.messages}></IonBackButton>
                    </IonButtons>
                    <IonTitle>{getMessagesDocumentItemValue.personName(currentMessagesDocument)}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {currentMessagesDocument.chat.map((chat, index) => (
                        <IonItem key={index}>
                            <IonLabel>
                                <h2>{chat.sender}</h2>
                                <p>{chat.message}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    ) : (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={pageDestinations.user.messages}></IonBackButton>
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

export default ViewMessagesPage;