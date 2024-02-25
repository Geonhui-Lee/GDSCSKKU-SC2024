import { IonButton, IonIcon, IonText, useIonRouter } from "@ionic/react";
import { mediaDestinations, pageDestinations } from "data/destination";
import { shieldCheckmarkOutline, shieldHalfOutline, warningOutline } from "ionicons/icons";
import { Swiper, SwiperRef, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { stickyFooterStyle } from "data/style";
import { getRelativeTimeString } from "hooks/pages/protector/data";
import { ProtectorReport } from "data/standard/document/protector";
import { useContext, useEffect, useRef } from "react";
import { UserSectionAppContext } from "components/render";
import { userSectionContext } from "hooks/context";

const SlideImage: React.FC<{src: string}> = ({src}) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img style={{ width: "auto", height: "192px" }} src={src} />
        </div>
    );
}

const StatusIcon: React.FC<{ icon: string, color: string }> = ({icon, color}) => {
    return <IonIcon icon={icon} color={color} style={{ fontSize: "6em" }} />;
}

export const ProtectorSlideContainer: React.FC<{ children: React.ReactNode, protectorReport: ProtectorReport | undefined }> = ({ children, protectorReport }) => {
    function getUserSectionContext() {
        return useContext(UserSectionAppContext) as ReturnType<typeof userSectionContext.useContext>;
    }
    const [userSectionState, setUserSectionState, setUserSectionPartialState] = [getUserSectionContext().state, getUserSectionContext().setState, getUserSectionContext().setPartialState];
    
    const router = useIonRouter();

    const protectorSwiper = useRef<SwiperRef>(null);
    
    useEffect(() => {
        if (setUserSectionPartialState === undefined) return;
        setUserSectionPartialState({
            protector: {
                ...userSectionState.protector,
                swiperRef: protectorSwiper
            }
        });
    }, [protectorSwiper]);
    
    return (
        <Swiper
            ref={protectorSwiper}
            modules={[Pagination, Scrollbar, A11y, Autoplay]}
            navigation={false}
            direction={'vertical'}
            pagination={{
                clickable: true,
            }}
            scrollbar={{ draggable: true }}
            // autoplay={{
            //     delay: 4000,
            //     disableOnInteraction: false
            // }}
        >
            {
                (protectorReport === undefined || protectorReport.status === undefined) ? renderUnreportedSlides(router) : 
                (protectorReport.status === "safe") ? renderSafeSlides(protectorReport, router) :
                (protectorReport.status === "warning") ? renderWarningSlides(protectorReport, router) :
                (protectorReport.status === "danger") ? renderDangerSlides(protectorReport, router) :
                renderUnreportedSlides(router)
            }
            {children}
            <SwiperSlide>
                <section>
                    <SlideImage src={mediaDestinations.user.protector.slide.end} />
                    <h1>Come back tomorrow to keep you and your phone calls safe!</h1>
                    <IonText color="medium">
                        Stick with the daily updated news about phone call frauds and scams while Teletect protects your back!
                    </IonText>
                </section>
                <div style={stickyFooterStyle}>
                    <IonButton
                        expand="block" size="large" color="success"
                        onClick={() => {
                            router.push(pageDestinations.user.protectorHQ)
                        }
                    }>Launch Protector HQ</IonButton>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export function renderUnreportedSlides(router: ReturnType<typeof useIonRouter>) {
    return (<>
        <SwiperSlide>
            <section>
                <h1>Teletect is protecting your phone calls.</h1>
                <p style={{ marginBottom: 8 }}>Keep your phone calls safe from frauds and scams.</p>
                <IonText color="medium"><small>No report available yet</small></IonText>
            </section>
            <div style={stickyFooterStyle}>
                <IonButton
                    expand="block" size="large" color="success"
                    onClick={() => {
                        router.push(pageDestinations.user.protectorHQ)
                    }
                }>Launch Protector HQ</IonButton>
            </div>
        </SwiperSlide>
    </>);
}

export function renderSafeSlides(protectorReport: ProtectorReport, router: ReturnType<typeof useIonRouter>) {
    return (<>
        <SwiperSlide>
            <section>
                <StatusIcon icon={shieldCheckmarkOutline} color="success" />
                <h1>You are safe!</h1>
                <p style={{ marginBottom: 8 }}>Keep your phone calls safe from frauds and scams.</p>
                <IonText color="medium"><small>Reported {getRelativeTimeString(protectorReport.time.modified)}</small></IonText>
            </section>
            <div style={stickyFooterStyle}>
                <IonButton
                    expand="block" size="large" color="success" fill="outline"
                    onClick={() => {
                        router.push(pageDestinations.user.protectorHQ)
                    }
                }>Launch Protector HQ</IonButton>
            </div>
        </SwiperSlide>
    </>);
};

export function renderWarningSlides(protectorReport: ProtectorReport, router: ReturnType<typeof useIonRouter>) {
    return (<>
        <SwiperSlide>
            <section>
                <StatusIcon icon={shieldHalfOutline} color="warning" />
                <h1>Warning!</h1>
                <p style={{ marginBottom: 8 }}>A potential fraud or scam call is detected.</p>
                <IonText color="medium"><small>Reported {getRelativeTimeString(protectorReport.time.modified)}</small></IonText>
            </section>
            <div style={stickyFooterStyle}>
                <IonButton
                    expand="block" size="large" color="warning" fill="outline"
                    onClick={() => {
                        router.push(pageDestinations.user.protectorHQ)
                    }
                }>Launch Protector HQ</IonButton>
            </div>
        </SwiperSlide>
    </>);
};

export function renderDangerSlides(protectorReport: ProtectorReport, router: ReturnType<typeof useIonRouter>) {
    return (<>
        <SwiperSlide>
            <section>
                <StatusIcon icon={warningOutline} color="danger" />
                <h1>Danger!</h1>
                <p style={{ marginBottom: 8 }}>A high-risk fraud or scam call is detected.</p>
                <IonText color="medium"><small>Reported {getRelativeTimeString(protectorReport.time.modified)}</small></IonText>
            </section>
            <div style={stickyFooterStyle}>
                <IonButton
                    expand="block" size="large" color="danger" fill="outline"
                    onClick={() => {
                        router.push(pageDestinations.user.protectorHQ)
                    }
                }>Launch Protector HQ</IonButton>
                <IonText color="medium"><small>You may be <IonText color="danger">in danger.</IonText> Please be cautious.</small></IonText>
            </div>
        </SwiperSlide>
    </>);
}