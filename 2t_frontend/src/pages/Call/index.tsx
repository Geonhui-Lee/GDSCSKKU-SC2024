import { IonContent,IonButton, IonIcon, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Keypad from 'components/Call/Keypad';
import { CallController, ResponseController } from 'hooks/nativeController/plugin';

export async function doPhoneCall(calleePhoneNumber: string) {
  if(calleePhoneNumber == "888"){
    await ResponseController.response({ phoneNumber: calleePhoneNumber });
  }else{
    await CallController.call({ phoneNumber: calleePhoneNumber });
  }
}

const CallPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Keypad doPhoneCall={doPhoneCall} />
      </IonContent>
    </IonPage>
  );
};

export default CallPage;