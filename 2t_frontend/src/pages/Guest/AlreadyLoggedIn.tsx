import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import CommonContainer from 'components/Guest/CommonContainer';
import { pageDestinations } from 'data/destination';
import { stickyFooterStyle } from 'data/style';

const AlreadyLoggedInPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Hi there!</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Hi there!</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <CommonContainer>
                    <h2>Welcome back!</h2>
                    <p>You are already logged in.</p>
                    <p>Please continue to the main page.</p>
                </CommonContainer>
                
                <div style={stickyFooterStyle}>
                    <IonButton expand="block" size="large" routerLink={pageDestinations.user.call}>Log In</IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AlreadyLoggedInPage;