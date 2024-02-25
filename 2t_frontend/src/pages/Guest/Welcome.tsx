import { IonButton, IonContent, IonText, IonPage, useIonRouter } from "@ionic/react";
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@ionic/react/css/ionic-swiper.css';
import { mediaDestinations, pageDestinations } from "data/destination";
import { stickyFooterStyle } from "data/style";
import './Welcome.css';
import { Link } from "react-router-dom";

const SlideImage: React.FC<{src: string}> = ({src}) => {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img style={{ width: "auto", height: "192px" }} src={src} />
        </div>
    );
}

const WelcomePage: React.FC = ({}) => {
    const router = useIonRouter();
    SwiperCore.use([Pagination, Autoplay]);

    return (<IonPage>
        <IonContent fullscreen>
            <Swiper
                modules={[Pagination, Scrollbar, A11y, Autoplay]}
                navigation={false}
                direction={'vertical'}
                pagination={{
                    clickable: true,
                }}
                scrollbar={{ draggable: true }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false
                }}
            >
                <SwiperSlide>
                    <section>
                        <SlideImage src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK55Rxdrg6kRg7vAonFRCZtg7iSs78AYgYPdk9K6JgmQ&s"} />
                        <h1>Teletect welcomes you!</h1>
                        <IonText color="medium">Your AI-powered phone call manager and telecommunication fraud protector is here.</IonText>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    <section>
                        <SlideImage src={mediaDestinations.guest.home.slide.telenote} />
                        <h1>Organize all the discussions you had during your calls.</h1>
                        <IonText color="medium">Teletect automatically organizes all the discussions you had during your calls, and provides you with the summary of the discussions.</IonText>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    <section>
                        <SlideImage src={mediaDestinations.guest.home.slide.protect} />
                        <h1>Real-time Voice Phishing Detector</h1>
                        <IonText color="medium">Teletect comes with the real-time voice phishing detector that AUTOMATICALLY blocks the call and reports to the authorities — powered by the latest AI & LLM technologies.</IonText>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    <section>
                        <SlideImage src={"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png"} />
                        <h1>Powered by Google technologies</h1>
                        <IonText color="medium">Teletect is built based on the Google's latest technologies, including Google Cloud, Google AI, Gemini, Google Firebase, and other robust technologies.</IonText>
                    </section>
                </SwiperSlide>
            </Swiper>
            <div style={stickyFooterStyle}>
                <IonButton expand="block" size="large" target={pageDestinations.guest.register}>Get Started</IonButton>
                <p style={{margin: "8px"}}><small>Already have an account? <Link to={pageDestinations.guest.login}>Login</Link></small></p>
            </div>
        </IonContent>
    </IonPage>)
};

export default WelcomePage;