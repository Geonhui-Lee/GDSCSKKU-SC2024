import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { ReactElement, useState } from 'react';
import CommonContainer from 'components/Guest/CommonContainer';
import { pageDestinations } from 'data/destination';
import { stickyFooterStyle } from 'data/style';
import { renderArea } from 'components/render';

interface PageProps {
    time?: number;
    content: ReactElement<any, any> | React.FC;
    loadingMessage?: string;
}

const DelayedRenderingComponent: React.FC<PageProps> = ({ content, time, loadingMessage }) => {

    const [showPage, setShowPage] = useState(false);
    setTimeout(() => {
        setShowPage(true);
    }, (time) ? time : 1000);

    return (
        (showPage) ? (
            renderArea(content)
        ) : (
            <CommonContainer>
                <IonSpinner name="dots" style={{ width: "64px", height: "64px" }}></IonSpinner>
                <p style={{ marginTop: 16 }}>{(loadingMessage) ? loadingMessage : "Loading..."}</p>
            </CommonContainer>
        )
    );
};

export default DelayedRenderingComponent;