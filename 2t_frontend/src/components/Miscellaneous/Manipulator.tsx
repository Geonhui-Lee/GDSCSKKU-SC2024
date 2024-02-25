import { IonList, IonItem, IonSelect, IonSelectOption, IonItemGroup, IonItemDivider, IonLabel, IonInput } from "@ionic/react";
import { demoProtectorReport } from "data/demo/demoDocument";
import { ProtectorReport } from "data/standard/document/protector";
import { readProtectorReport, updateProtectorReport } from "hooks/pages/protector/filesystem/reportFS";
import { useEffect, useState } from "react";

const Manipulator: React.FC = () => {

    const [defaultProtectorReport, setDefaultProtectorReport] = useState<ProtectorReport | undefined>();

    const [protectorStatus, setProtectorStatus] = useState<"safe" | "warning" | "danger" | undefined>();
    const [protectorStatusDelay, setProtectorStatusDelay] = useState<number>(1000);
    useEffect(() => {
        setTimeout(() => {
            updateProtectorReport({ status: protectorStatus });
        }, protectorStatusDelay);
    }, [protectorStatus]);

    useEffect(() => {
        readProtectorReport().then((report) => {
            setDefaultProtectorReport(report);
        });
    }, []);

    return (<>
        <IonList inset={true}>
            <IonItemGroup>
                <IonItemDivider>
                    Manipulator
                </IonItemDivider>
                <IonItem>
                    <IonSelect
                        label="Protector Report Status"
                        placeholder="Status..."
                        onIonChange={(e) => {
                            const value = e.detail.value;
                            setProtectorStatus(value);
                        }}
                        defaultValue={
                            (defaultProtectorReport) ? (defaultProtectorReport.status) : (undefined)
                        }
                    >
                        <IonSelectOption value="safe">Safe</IonSelectOption>
                        <IonSelectOption value="warning">Warning</IonSelectOption>
                        <IonSelectOption value="danger">Danger</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonInput
                        type="number"
                        value={protectorStatusDelay}
                        placeholder="Protector Report Status Delay (ms)"
                        onIonChange={(e) => {
                            const value = e.detail.value;
                            setProtectorStatusDelay(parseInt(value!) || 1000);
                        }}
                        labelPlacement="floating"
                    ></IonInput>
                </IonItem>

                <IonItemDivider>
                    Fullscreen ON/OFF
                </IonItemDivider>
                <IonItem button={true} onClick={() => { document.documentElement.requestFullscreen(); }}>
                    <IonLabel>
                        Fullscreen ON
                    </IonLabel>
                </IonItem>
                <IonItem button={true} onClick={() => { document.exitFullscreen(); }}>
                    <IonLabel>
                        Fullscreen OFF
                    </IonLabel>
                </IonItem>
            </IonItemGroup>
        </IonList>
    </>);
};

export default Manipulator;