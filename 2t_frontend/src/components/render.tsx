import { getAuth } from "firebase/auth";
import React, { ReactElement, ReactNode, createContext, useEffect, useRef, useState } from "react";
import NotLoggedIn from "pages/Guest/NotLoggedIn";
import AlreadyLoggedInPage from "pages/Guest/AlreadyLoggedIn";
import { pageDestinations } from "data/destination";
import { Redirect } from "react-router";
import { IonToast, useIonRouter } from "@ionic/react";
import { checkAppPermissionsInBackground } from "hooks/nativeController/permission";
import { UserSectionContext, userSectionContext } from "hooks/context";

export function renderArea(area: ReactElement<any, any> | React.FC) {
    return (typeof area === "function") ? area({}) : area;
}

export function renderGuestPage(isLoggedIn: boolean, component: ReactElement<any, any> | React.FC) {
    return isLoggedIn ? <Redirect to={pageDestinations.user.call} /> : renderArea(component);
}

export const GuestSection: React.FC<{children: ReactNode, isLoggedIn: boolean}> = ({ children, isLoggedIn }) => {
    return isLoggedIn ? <Redirect to={pageDestinations.user.call} /> : <>{children}</>;
}

export const UserSectionAppContext = userSectionContext.createContext();

export const UserSection: React.FC<{
    children: ReactNode,
    isLoggedIn: boolean,
    currentPageDestination?: string
}> = ({ children, isLoggedIn, currentPageDestination }) => {
    const router = useIonRouter();
    const [permissionToastOpen, setPermissionToastOpen] = useState(false);

    const [userSectionState, setUserSectionState] = useState<UserSectionContext["state"]>({
        protector: {
            swiperRef: useRef(null)
        }
    });
    function setUserSectionPartialState(state: Partial<UserSectionContext["state"]>) {
        setUserSectionState({
            ...userSectionState,
            ...state
        });
    }

    useEffect(() => {
        if (router.routeInfo.pathname !== pageDestinations.common.permission) {
            checkAppPermissionsInBackground(() => {
                setPermissionToastOpen(true);
            });
        }
    });

    useEffect(() => {
        userSectionState.protector.swiperRef.current?.swiper.slideTo(0);
    }, [currentPageDestination]);

    return isLoggedIn ? <>
        <UserSectionAppContext.Provider value={{
            state: userSectionState,
            setState: setUserSectionState,
            setPartialState: setUserSectionPartialState
        } as UserSectionContext}>
            {children}
        </UserSectionAppContext.Provider>
        <IonToast
            isOpen={permissionToastOpen}
            onDidDismiss={() => setPermissionToastOpen(false)}
            message="Some permissions are required to use this app. Please grant the permissions to use Teletect without issues."
            buttons={[
                {
                    text: 'Open',
                    role: 'info',
                    handler: () => {
                        router.push(pageDestinations.common.permission);
                    }
                }
            ]}
        ></IonToast>
    </> : <NotLoggedIn />;
};