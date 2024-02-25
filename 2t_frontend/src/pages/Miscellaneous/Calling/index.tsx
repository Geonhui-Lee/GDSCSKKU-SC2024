import React, { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFooter,IonText,IonAlert} from '@ionic/react';
import { call,keypad, videocam, micOff, ellipsisHorizontal } from 'ionicons/icons';
import { pageDestinations } from "data/destination";
import './CallScreen.css';
import { useHistory } from 'react-router-dom';

const CallScreen: React.FC = () => {

  const history = useHistory(); // Initialize the useHistory hook

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push(pageDestinations.user.specific.warning); // Replace with your destination path
    }, 5000); // Set timeout for 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [history]); // The effect depends on the useHistory hook
  
  return (
    <IonPage className='fs'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calling</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="call-screen-content">
        <div>
          <IonText>
            <h1>You are safe.</h1>
          </IonText>
          <IonText>
            <h2>032-585-3636</h2>
          </IonText>
        </div>
      </IonContent>
      
        <IonToolbar className="footer-toolbar">
          <IonButtons className="footer-buttons">
            <IonButton>
              <IonIcon icon={keypad} />
            </IonButton>
            <IonButton>
              <IonIcon icon={videocam} />
            </IonButton>
            <IonButton>
              <IonIcon icon={micOff} />
            </IonButton>
            <IonButton>
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      <IonFooter className="footer">
        <div className="call-end-button-container">
          <IonButton routerLink={pageDestinations.user.call} className="call-end-button">
            <IonIcon icon={call} />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default CallScreen;
