import { IonList, IonItem, IonInput, IonButton, useIonRouter } from "@ionic/react";
import { pageDestinations } from "data/destination";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginContainerProps {
    doLogin: (email: string, password: string) => void;
}

interface RegisterContainerProps {
    doRegister: (email: string, password: string, passwordConfirmation: string) => void;
}

export const Login: React.FC<LoginContainerProps> = ({doLogin}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useIonRouter();
    
    function onKeyDownHandler(ev: React.KeyboardEvent<HTMLIonInputElement>) {
        if (ev.key == "Enter") {
            doLogin(email, password);
        }
    }

    return (<>
        <h1>Welcome back!</h1>
        <IonList style={{margin: "24px 4px"}}>
            <IonItem>
                <IonInput label="E-mail" labelPlacement="floating" type="email" onIonInput={(ev: Event) => { setEmail( (ev.target as HTMLIonInputElement).value as string ); }} onKeyDown={onKeyDownHandler}></IonInput>
            </IonItem>
            <IonItem>
                <IonInput label="Password" labelPlacement="floating" type="password" onIonInput={(ev: Event) => { setPassword( (ev.target as HTMLIonInputElement).value as string ); }} onKeyDown={onKeyDownHandler}></IonInput>
            </IonItem>
        </IonList>
        <IonButton expand="block" onClick={() => {doLogin(email, password)}}>Log In</IonButton>
        <p>Need to create an account? <Link to={pageDestinations.guest.register}>Register Now</Link></p>
    </>)
};

export const Register: React.FC<RegisterContainerProps> = ({doRegister}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const router = useIonRouter();

    function onKeyDownHandler(ev: React.KeyboardEvent<HTMLIonInputElement>) {
        if (ev.key == "Enter") {
            doRegister(email, password, passwordConfirmation);
        }
    }

    return (<>
        <h1>Create your account</h1>
        <IonList style={{margin: "24px 4px"}}>
            <IonItem>
                <IonInput label="E-mail" labelPlacement="floating" type="email" onIonInput={(ev: Event) => { setEmail( (ev.target as HTMLIonInputElement).value as string ); }} onKeyDown={onKeyDownHandler}></IonInput>
            </IonItem>
            <IonItem>
                <IonInput label="Password" labelPlacement="floating" type="password" onIonInput={(ev: Event) => { setPassword( (ev.target as HTMLIonInputElement).value as string ); }} onKeyDown={onKeyDownHandler}></IonInput>
            </IonItem>
            <IonItem>
                <IonInput label="Password Confirmation" labelPlacement="floating" type="password" onIonInput={(ev: Event) => { setPasswordConfirmation( (ev.target as HTMLIonInputElement).value as string ); }} onKeyDown={onKeyDownHandler}></IonInput>
            </IonItem>
        </IonList>
        <IonButton expand="block" onClick={() => {doRegister(email, password, passwordConfirmation)}}>Register</IonButton>
        <p>Already have an account? <Link to={pageDestinations.guest.login}>Login</Link></p>
    </>)
};