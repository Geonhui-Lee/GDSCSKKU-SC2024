import { useIonRouter } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { messagesContext } from 'hooks/context';
import SearchMessagesPage from './SearchMessages';
import { MessagesDocument } from 'data/standard/document/messages';
import { demoMessages } from 'data/demo/demoDocument';
import ViewMessagesPage from './ViewMessages';
import { useParams } from 'react-router';
import { pageDestinations } from 'data/destination';
import { getDeviceSMSMessages, getIdFromMessagesDocument, getMessagesDocumentFromId } from 'hooks/pages/messages/data';
import { SmsInboxReaderController } from 'hooks/nativeController/plugin';
import { useTimeout } from 'usehooks-ts';

export const MessagesPageContext = messagesContext.createContext();

const MessagesPage: React.FC = () => {

    const router = useIonRouter();

    const currentMessagesDocumentId: string = useParams<{ id: string }>().id;
    function setCurrentMessagesDocumentId(messagesDocumentId: string) {
        router.push(
            pageDestinations.user.specific.message.replace(":id", messagesDocumentId)
        );
    }

    const [messagesDocuments, setMessagesDocuments] = useState<MessagesDocument[] | undefined>(demoMessages);
    const currentMessagesDocument = useMemo<MessagesDocument | undefined>(() => {
        if (messagesDocuments !== undefined) {
            return getMessagesDocumentFromId(messagesDocuments, currentMessagesDocumentId);
        }
        else {
            return undefined;
        }
    }, [currentMessagesDocumentId]);
    function setCurrentMessagesDocument(messagesDocument: MessagesDocument) {
        setCurrentMessagesDocumentId(getIdFromMessagesDocument(messagesDocument));
    }

    const [deviceSMSMessagesCount, setDeviceSMSMessagesCount] = useState<number | undefined>(undefined);

    async function watchDeviceSMSMessages(){
        const messagesCount = await SmsInboxReaderController.getCount();
        if (messagesCount.count !== deviceSMSMessagesCount) {
            setDeviceSMSMessagesCount(messagesCount.count);

            const messages = await getDeviceSMSMessages();
            const newMessagesDocuments: MessagesDocument[] = [];
            messages.forEach((message) => {
                newMessagesDocuments.push({
                    type: "sms",
                    contact: {
                        phoneNumber: message.from
                    },
                    chat: [
                        {
                            sender: "opponent",
                            message: message.message,
                            time: new Date()
                        }
                    ]
                });
            });
            setMessagesDocuments(newMessagesDocuments);
        }
    }

    useTimeout(watchDeviceSMSMessages, 5000);
    //const [currentMessagesDocument, setCurrentMessagesDocument] = useState<MessagesDocument | undefined>(undefined);

    return (
        <MessagesPageContext.Provider value={{
            messagesDocuments: messagesDocuments,
            setMessagesDocuments: setMessagesDocuments,
            currentMessagesDocument: currentMessagesDocument,
            setCurrentMessagesDocument: setCurrentMessagesDocument
        }}>
            {
                (currentMessagesDocumentId !== undefined) ? <ViewMessagesPage /> : <SearchMessagesPage />
            }
        </MessagesPageContext.Provider>
    );
};

export default MessagesPage;