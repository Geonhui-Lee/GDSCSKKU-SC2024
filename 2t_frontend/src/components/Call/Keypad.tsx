import { IonButton, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonList, IonRow } from '@ionic/react';
import './Keypad.css';
import { backspace, call } from 'ionicons/icons';
import { useState } from 'react';
import { useLongPress } from 'hooks/pages/call';

interface KeypadProps {
    doPhoneCall: (calleePhoneNumber: string) => void;
}

const Keypad: React.FC<KeypadProps> = ({ doPhoneCall }) => {
    
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    function initiatePhoneCall() {
        doPhoneCall(phoneNumber);
        setPhoneNumber("")
    }

    function renderPhoneNumber() {
        const length = String(Number(phoneNumber)).length;

        if (length >= 4 && length <= 11) {
            if (length >= 7) {
                return phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3, 7) + "-" + phoneNumber.slice(7);
            }
            else {
                return phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3);
            }
        }
        return phoneNumber;
    }

    function handleKeypadButtonClick(value: string) {
        setPhoneNumber(phoneNumber + value);
    }

    function handleEraseButtonClick() {
        setPhoneNumber(phoneNumber.slice(0, -1));
    }

    function renderKeypadButtonGroup(values: string[]) {
        return (
            <IonRow class="ion-justify-content-center">
                {
                    values.map((value) => {
                        function getAlphabetsFromValue(value: string) {
                            switch (value) {
                                case "1": return "";
                                case "2": return "ABC";
                                case "3": return "DEF";
                                case "4": return "GHI";
                                case "5": return "JKL";
                                case "6": return "MNO";
                                case "7": return "PQRS";
                                case "8": return "TUV";
                                case "9": return "WXYZ";
                                case "0": return "+";
                                default: return "";
                            }
                        }
                    
                        const onClick = () => {
                            handleKeypadButtonClick(value);
                        }
                        
                        const onLongPress = () => {
                            if (value === "0") {
                                handleKeypadButtonClick("+");
                            }
                        };
                    
                        const defaultOptions = {
                            shouldPreventDefault: true,
                            delay: 500,
                        };

                        const longPressEvent = useLongPress(onLongPress, 500);

                        return (
                            <IonCol size="3" key={value}>
                                <IonButton color="light" expand="block" style={{ backgroundColor: "transparent", margin: "0 2px" }} onClick={() => {handleKeypadButtonClick(value)}} {...longPressEvent}
                                >
                                    <section style={{ marginTop: 0, marginBottom: -6 }}>{
                                        (getAlphabetsFromValue(value).length > 0) ?  (<>
                                            <span style={{ fontSize: 32 }}>{value}</span>
                                            <p style={{ fontSize: 12, fontWeight: "normal" }}>{getAlphabetsFromValue(value)}</p>
                                        </>) : (<>
                                            <span style={{ fontSize: 32 }}>{value}</span>
                                            <p style={{ fontSize: 12, fontWeight: "normal" }}><span style={{ opacity: 0 }}>-</span></p>
                                        </>)
                                    }</section>
                                </IonButton>
                            </IonCol>
                        )
                    })
                }
            </IonRow>
        )
    }

    return (
        <div className="container">
            <IonList>
                <IonItem style={{ padding: "0 10%" }}>
                    <IonInput value={renderPhoneNumber()} pattern="tel" style={{ textAlign: "center", fontSize: 32 }} size={10} readonly></IonInput>
                </IonItem>
            </IonList>
            <IonGrid style={{ marginTop: 16, padding: 0 }}>
                {renderKeypadButtonGroup(["1", "2", "3"])}
                {renderKeypadButtonGroup(["4", "5", "6"])}
                {renderKeypadButtonGroup(["7", "8", "9"])}
                {renderKeypadButtonGroup(["*", "0", "#"])}
            </IonGrid>
            <IonGrid style={{ marginTop: 4, padding: 0 }}>
                <IonRow class="ion-justify-content-center ion-align-items-center">
                    <IonCol size="3" offset="3">
                        <IonButton shape="round" color="success" onClick={initiatePhoneCall}>
                            <IonIcon slot="icon-only" icon={call} style={{ padding: "10px 0" }}></IonIcon>
                        </IonButton>
                    </IonCol>
                    <IonCol size="3">
                        <IonButton size="small" shape="round" color="light" onClick={() => {handleEraseButtonClick()}} {...useLongPress(() => {handleEraseButtonClick()}, 150)}>
                            <IonIcon icon={backspace}></IonIcon>
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default Keypad;