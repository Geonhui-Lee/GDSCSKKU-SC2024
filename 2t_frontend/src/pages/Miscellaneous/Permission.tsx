import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToast, IonToolbar, useIonRouter } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { pageDestinations } from 'data/destination';
import { stickyFooterStyle } from 'data/style';
import { PermissionHandleResult } from 'data/standard/nativeController/permissionStandard';
import { firebaseAuth } from 'hooks/firebase/core';
import CommonContainer from 'components/Guest/CommonContainer';
import { checkAppPermissions, isAppPermissionsGranted, requestAppPermissions } from 'hooks/nativeController/permission';

const PermissionPage: React.FC = () => {

    const router = useIonRouter();

    const [showPage, setShowPage] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("Requesting permission...");
    const [deniedPermissions, setDeniedPermissions] = useState<string[]>([]);

    const [errorToastMessage, setErrorToastMessage] = useState<string>("");
    const errorToastRef = useRef<HTMLIonToastElement>(null);
    const showErrorToast = (message: string) => {
        errorToastRef.current?.present();
        setErrorToastMessage(message);
    };

    function requestPermissions() {
        isAppPermissionsGranted().then((isPermissionsGranted: boolean) => {
            if (isPermissionsGranted) {
                onPermissionsGranted();
            }
            else {
                requestAppPermissions().then((result: PermissionHandleResult) => {
                    if (result.status === "granted") {
                        onPermissionsGranted();
                    }
                    else {
                        onPermissionsNotGranted();
                    }
                });
            }
        })
    }

    function onPermissionsGranted() {
        if (router.canGoBack()) {
            router.goBack();
        }
        else {
            router.push( firebaseAuth.currentUser ? pageDestinations.user.call : pageDestinations.guest.login )
        }
    }

    function onPermissionsNotGranted() {
        setShowPage(true);
        checkAppPermissions().then((result: PermissionHandleResult) => {
            if (result.status === "denied") {
                if (result.deniedPermissions) setDeniedPermissions(result.deniedPermissions);
            }
        });
    }

    useEffect(() => {
        isAppPermissionsGranted().then((isPermissionsGranted: boolean) => {
            if (isPermissionsGranted) {
                onPermissionsGranted();
            }
            else {
                onPermissionsNotGranted();
            }
        }).catch((error: any) => {
            showErrorToast("Error occurred while checking permissions");
            onPermissionsNotGranted();
        });
    }, []);

    return (
        (showPage) ? (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                    <IonTitle>Permission Required</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Permission</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <CommonContainer style={{ padding: 24 }}>
                        <h2 style={{ marginBottom: 16 }}>Teletect requires several permissions to function properly.</h2>
                        {deniedPermissions.map((permission, index) => (
                            <p key={index}>{permission}</p>
                        ))}
                    </CommonContainer>
                    
                    <div style={stickyFooterStyle}>
                        <IonButton expand="block" color="success" size="large" onClick={requestPermissions}>Continue</IonButton>
                    </div>
                </IonContent>
                <IonToast ref={errorToastRef} message={errorToastMessage} duration={5000}></IonToast>
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

export default PermissionPage;