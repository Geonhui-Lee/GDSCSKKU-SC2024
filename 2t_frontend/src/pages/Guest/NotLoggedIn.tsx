import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import CommonContainer from 'components/Guest/CommonContainer';
import { pageDestinations } from 'data/destination';
import { stickyFooterStyle } from 'data/style';
import DelayedRenderingPage from 'pages/Miscellaneous/DelayedRender';

const NotLoggedInPage: React.FC = () => {

    return (
        <DelayedRenderingPage content={
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                    <IonTitle>Sorry!</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Sorry!</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <CommonContainer>
                        <h2>Not logged in!</h2>
                        <p>Your session has been expired.</p>
                        <p>Please log in to continue.</p>
                    </CommonContainer>
                    
                    <div style={stickyFooterStyle}>
                        <IonButton expand="block" size="large" routerLink={pageDestinations.guest.login}>Log In</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        } time={2000} />
    );
};

export default NotLoggedInPage;