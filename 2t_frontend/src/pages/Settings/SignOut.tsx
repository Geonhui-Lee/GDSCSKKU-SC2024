import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import CommonContainer from 'components/Guest/CommonContainer';
import { pageDestinations } from 'data/destination';
import { stickyFooterStyle } from 'data/style';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from 'hooks/firebase/core';

const SignOutPage: React.FC = () => {

    const router = useIonRouter();

    const [showPage, setShowPage] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("Loading...");

    setTimeout(() => {
        setLoadingMessage("Signing out...");
        signOut(firebaseAuth).then(() => {
            setShowPage(true);
        }).catch((error) => {
            console.error(error);
        });
    }, 0);

    function goToLoginPage() {
        window.location.href = pageDestinations.root;
    }

    return (
        (showPage) ? (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                    <IonTitle>Thank you!</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Thank you!</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <CommonContainer>
                        <h2>We will be waiting for you!</h2>
                        <p>Your account has been signed out.</p>
                        <p>Feel free to come back anytime!</p>
                    </CommonContainer>
                    
                    <div style={stickyFooterStyle}>
                        <IonButton expand="block" size="large" onClick={goToLoginPage}>Return to Log In</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        ) : (
            <IonPage>
                <IonContent fullscreen>
                    <CommonContainer>
                        <IonSpinner name="dots" style={{ width: "64px", height: "64px" }}></IonSpinner>
                        <p style={{ marginTop: 16 }}>{loadingMessage}</p>
                    </CommonContainer>
                </IonContent>
            </IonPage>
        )
    );
};

export default SignOutPage;