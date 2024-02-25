import React from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from '@ionic/react';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { arrowBack } from 'ionicons/icons';
import { Login, Register } from 'components/Guest/AuthForm';
import { pageDestinations } from 'data/destination';

import { firebaseAuth } from 'hooks/firebase/core';

import './Auth.css';

interface ContainerProps {
    section: 'login' | 'register';
}

const AuthPage: React.FC<ContainerProps> = ({ section }) => {
    
    const router = useIonRouter();
    function onSuccessfulAuth() {
        router.push(pageDestinations.user.call);
    }

    const [authStateAlert] = useIonAlert();

    function login(email: string, password: string) {
        signInWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                onSuccessfulAuth();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                showFirebaseAuthError(errorCode, errorMessage);
            });
    }

    function register(email: string, password: string, passwordConfirmation: string) {
        if (password == passwordConfirmation) {
            createUserWithEmailAndPassword(firebaseAuth, email, password)
                .then((userCredential) => {
                    onSuccessfulAuth();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    showFirebaseAuthError(errorCode, errorMessage);
                });
        }
        else {
            showError("Passwords do not match!");
        }
    }
    
    function showError(errorMessage: string, errorTitle?: string) {
        authStateAlert({
            header: 'Error',
            subHeader: errorTitle,
            message: errorMessage,
            buttons: ['OK'],
        })
    }

    function showFirebaseAuthError(errorCode: string, errorMessage: string) {
        showError( errorMessage.replace("Firebase: ", "") );
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => {router.push(pageDestinations.guest.home)}}>
                            <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{
                        (section == 'register') ? ("Create an Account") :
                        (section == 'login') ? ("Sign In") : (<></>)
                    }</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="authentication">
                    {/* <img style={{width: "256px", height: "auto"}} src={mediaDestinations.auth.common} /> */}
                    {
                        (section == 'register') ? (<Register doRegister={register} />) :
                        (section == 'login') ? (<Login doLogin={login} />) : (<></>)
                    }
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AuthPage;