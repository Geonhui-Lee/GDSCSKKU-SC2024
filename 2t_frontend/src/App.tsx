import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { call, chatbox, keypad, people, recording, recordingSharp, settings, shield, time } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { GuestSection, UserSection } from 'components/render';
import { firebaseAuth } from 'hooks/firebase/core';

import { pageDestinations } from 'data/destination';

import WelcomePage from 'pages/Guest/Welcome';
import AuthPage from 'pages/Guest/Auth';

import CallPage from 'pages/Call';
import MessagePage from 'pages/Messages';
import NotesPage from 'pages/Notes';
import ProtectorPage from 'pages/Protector';
import ProtectorHQPage from 'pages/Protector/ProtectorHQ';
import SettingsPage from 'pages/Settings';
import SignOutPage from 'pages/Settings/SignOut';
// import CallingPage from 'pages/Miscellaneous/Calling/index';
// import WarningPage from 'pages/Miscellaneous/Calling/warning';

import DelayedRenderingPage from 'pages/Miscellaneous/DelayedRender';
import PermissionPage from 'pages/Miscellaneous/Permission';

import './theme/tabBarVisibility.css';

setupIonicReact({
  rippleEffect: false,
  mode: 'ios',
});

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const tabBarRef = useRef<HTMLIonTabBarElement>(null);

  function getWindowPathname() {
    return window.location.pathname;
  }

  const [currentPageDestination, setCurrentPageDestination] = useState<string>(getWindowPathname());
  function onNavbarClick() {
    console.log(tabBarRef);
    setCurrentPageDestination(getWindowPathname());
  }

  return (<IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path={pageDestinations.guest.home}>
            <GuestSection isLoggedIn={loggedIn}><WelcomePage /></GuestSection>
          </Route>
          <Route path={pageDestinations.guest.login}>
            <GuestSection isLoggedIn={loggedIn}><AuthPage section="login" /></GuestSection>
          </Route>
          <Route path={pageDestinations.guest.register}>
            <GuestSection isLoggedIn={loggedIn}><AuthPage section="register" /></GuestSection>
          </Route>

          <Route path={pageDestinations.user.call}>
            <UserSection isLoggedIn={loggedIn}><CallPage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.recents}><Tab2 /></Route>
          <Route path={pageDestinations.user.messages} exact={true}>
            <UserSection isLoggedIn={loggedIn}><MessagePage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.specific.message}>
            <UserSection isLoggedIn={loggedIn}><MessagePage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.protect}>
            <UserSection isLoggedIn={loggedIn} currentPageDestination={currentPageDestination}><ProtectorPage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.protectorHQ}>
            <UserSection isLoggedIn={loggedIn}><ProtectorHQPage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.notes} exact={true}>
            <UserSection isLoggedIn={loggedIn}><NotesPage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.specific.note}>
            <UserSection isLoggedIn={loggedIn}><NotesPage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.settings}>
            <UserSection isLoggedIn={loggedIn}><SettingsPage /></UserSection>
          </Route>
          <Route path={pageDestinations.user.logout}><SignOutPage /></Route>
          <Route exact path="/">
            {
              loggedIn ?
                <Redirect to={pageDestinations.user.call} /> :
                <DelayedRenderingPage content={<WelcomePage />} time={2000} />
            }
          </Route>

          <Route path={pageDestinations.common.permission}><PermissionPage /></Route>
        </IonRouterOutlet>

        <IonTabBar
          ref={tabBarRef}
          slot="bottom"
          style={{ padding: "4px 0" }}
          onClick={() => {onNavbarClick}}
        >
          <IonTabButton tab="notes" href={pageDestinations.user.notes}>
            <IonIcon aria-hidden="true" icon={recordingSharp} />
            <IonLabel>TeleNotes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="protect" href={pageDestinations.user.protect}>
            <IonIcon aria-hidden="true" icon={shield} />
            <IonLabel>Protector</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="call" href={pageDestinations.user.call}>
              <IonIcon aria-hidden="true" icon={keypad} />
              <IonLabel>Keypad</IonLabel>
          </IonTabButton>

          {/* {(currentPageDestination === pageDestinations.user.call) ? (
            <IonTabButton tab="recents" href={pageDestinations.user.recents}>
              <IonIcon aria-hidden="true" icon={time} />
              <IonLabel>Recents</IonLabel>
            </IonTabButton>
          ) : (
            <IonTabButton tab="call" href={pageDestinations.user.call}>
              <IonLabel>
                <IonButton shape="round" color="success" style={{margin: 0}}>
                  <IonIcon slot="icon-only" icon={call}></IonIcon>
                </IonButton>
              </IonLabel>
            </IonTabButton>
          )} */}

          <IonTabButton tab="messages" href={pageDestinations.user.messages}>
            <IonIcon aria-hidden="true" icon={chatbox} />
            <IonLabel>Messages</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href={pageDestinations.user.settings}>
            <IonIcon aria-hidden="true" icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>);
};

export default App;
