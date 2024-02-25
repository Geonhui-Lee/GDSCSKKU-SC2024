import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonFooter,IonText,IonAlert} from '@ionic/react';
import { call,keypad, videocam, micOff, ellipsisHorizontal } from 'ionicons/icons';
import { pageDestinations } from "data/destination";
import './WarningScreen.css';

const CallScreen: React.FC = () => {
  const [showAlert, setShowAlert] = React.useState(true);

  return (
    <IonPage className='fs'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calling</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="call-screen-content">
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='voice-phishing-alert'
          header={'Voice phishing detected.'}
          message={'Please be cautious. The number 032-585-3636 has been detected as a potential fraud.'}
          buttons={['OK']}
        />
        <div className="call-info">
          <IonText color="danger">
            <h1>Voice phishing detected.</h1>
          </IonText>
          <IonText>
            <h2>032-585-3636</h2>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
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
          <IonButton routerLink={pageDestinations.user.call} color="danger" className="call-end-button">
            <IonIcon icon={call} />
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default CallScreen;
