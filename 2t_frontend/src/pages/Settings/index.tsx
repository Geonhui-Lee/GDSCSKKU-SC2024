import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonActionSheet, useIonRouter } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { pageDestinations } from 'data/destination';
import { firebaseAuth } from 'hooks/firebase/core';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import Manipulator from 'components/Miscellaneous/Manipulator';

const profileAvatarSize = 64;
const defaultProfileAvatar = "https://www.gravatar.com/avatar?d=mp";

const SettingsPage: React.FC = () => {
    
    const router = useIonRouter();
    const user = firebaseAuth.currentUser;

    const userName = user?.displayName || "";
    const userEmail = user?.email || "";
    const userPhotoURL = user?.photoURL || defaultProfileAvatar;

    const [presentAccountActionSheet] = useIonActionSheet();
    function showAccountActionSheet() {
        presentAccountActionSheet({
            buttons: [
                {
                    text: "Sign Out",
                    role: "destructive",
                    handler: () => {
                        router.push(pageDestinations.user.logout);
                    }
                },
                {
                    text: "Close",
                    role: "cancel",
                }
            ],
        });
    }

    const [presentActionSheet] = useIonActionSheet();
    function showActionSheet() {
        presentActionSheet({
            buttons: [
                {
                    text: 'Read',
                    handler: () => {
                        Filesystem.readFile({
                            path: 'secrets/text.txt',
                            directory: Directory.Documents,
                            encoding: Encoding.UTF8,
                        }).then((result) => {
                            console.log('Read file:', result);
                        });
                    }
                },
                {
                    text: 'Write',
                    handler: () => {
                        Filesystem.writeFile({
                            path: 'secrets/text.txt',
                            data: 'This is a test',
                            directory: Directory.Documents,
                            encoding: Encoding.UTF8,
                        }).then((result) => {
                            console.log('Read file:', result);
                        });
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                }
            ],
        });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Settings</IonTitle>
                        <IonButtons slot="primary">
                            <IonButton onClick={showActionSheet}>
                                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList inset={true}>
                        <IonItem button onClick={showAccountActionSheet}>
                            <IonLabel>
                                <h1 style={{ marginBottom: 8 }}>{userName}</h1>
                                <p>{userEmail}</p>
                            </IonLabel>
                            <IonAvatar slot="end" style={{ width: profileAvatarSize, height: profileAvatarSize }}>
                                <img src={userPhotoURL} alt="User Avatar" />
                            </IonAvatar>
                        </IonItem>
                    </IonList>
                    <Manipulator />
                </IonContent>
            </IonContent>
        </IonPage>
    );
};

export default SettingsPage;