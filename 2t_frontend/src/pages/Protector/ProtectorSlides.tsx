import { IonButton, IonContent, IonText, IonPage, useIonRouter, IonIcon } from "@ionic/react";
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

import { stickyFooterStyle, stickyHeaderStyle } from "data/style";
import { ProtectorSlideContainer } from "components/Protector/ProtectorSlides";
import { useContext, useEffect, useState } from "react";
import { requestProtectorFeed } from "hooks/apiRequest";
import { ProtectorFeed } from "data/standard/protectorStandard";
import { ProtectorPageContext } from "pages/Protector";
import { protectorContext } from "hooks/context";

import './ProtectorSlides.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@ionic/react/css/ionic-swiper.css';
import { warning } from "ionicons/icons";

const ProtectorSlidesPage: React.FC = ({}) => {
    function getContext() {
        return useContext(ProtectorPageContext) as ReturnType<typeof protectorContext.useContext>;
    }
    const protectorReport = getContext().report;
    
    const [feeds, setFeeds] = useState<ProtectorFeed[]>([]);
    useEffect(() => {
        requestProtectorFeed().then((result: ProtectorFeed[]) => {
            setFeeds(result);
        });
    }, []);

    SwiperCore.use([Pagination, Autoplay]);

    return (<IonPage>
        <IonContent>
            <ProtectorSlideContainer protectorReport={protectorReport}>{
                feeds.map((feed, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <section>
                                {(feed.media !== undefined) ? <img src={feed.media[0].url} style={{ width: "100%" }} /> : <></>}
                                <h2 style={{ lineHeight: 1.4 }}>
                                    {feed.title}
                                </h2>
                                <IonText color="medium">
                                    {feed.created_at.toLocaleString()} &middot; {feed.source.content}
                                </IonText>
                            </section>
                            <div style={stickyHeaderStyle}>
                                <IonText color="medium"><small>Content Provided by {feed.source.feed}</small></IonText>
                            </div>
                            <div style={stickyFooterStyle}>
                                <IonButton
                                    expand="block" size="large" color="primary"
                                    onClick={() => {
                                        window.open(feed.url, "_blank");
                                    }
                                }>View More</IonButton>
                            </div>
                        </SwiperSlide>
                    )
                })
            }</ProtectorSlideContainer>
        </IonContent>
    </IonPage>)
};

export default ProtectorSlidesPage;