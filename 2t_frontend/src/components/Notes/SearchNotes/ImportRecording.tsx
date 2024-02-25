import { AlertInput, IonAlert } from "@ionic/react";
import { TelenotesManifests } from "data/standard/document/telenotes";
import { telenotesContext } from "hooks/context";
import { createNewDocumentFromRecording } from "hooks/pages/telenotes/filesystem/documentFS";
import { readTelenotesManifest } from "hooks/pages/telenotes/filesystem/manifestFS";
import { TelenotesPageContext } from "pages/Notes";
import { useRef, useState, ChangeEvent, useContext } from "react";

interface ImportRecordingProps {
    importAlertRef: React.RefObject<HTMLIonAlertElement>;
}

interface ImportStatusAlertProps {
    message: string;
    header?: string;
}

const ImportRecording: React.FC<ImportRecordingProps> = ({importAlertRef}) => {
    function getContext() {
        return useContext(TelenotesPageContext) as ReturnType<typeof telenotesContext.useContext>;
    }

    const [noteManifests, setNoteManifests] = [getContext().noteManifests, getContext().setNoteManifests];

    const [importContactName, setImportContactName] = useState<string | undefined>("");
    const [importContactPhoneNumber, setImportContactPhoneNumber] = useState<string | undefined>("");

    const importStatusAlertRef = useRef<HTMLIonAlertElement>(null);
    const [importStatusAlertState, setImportStatusAlertState] = useState<ImportStatusAlertProps>({message: "Unknown Error!"});
    function openImportStatusAlert(message: string, header: string = "Error") {
        setImportStatusAlertState({header, message});
        importStatusAlertRef.current?.present();
    }

    const importFileInputRef = useRef<HTMLInputElement>(null);
    function handleImportFileInputChange(event: ChangeEvent<HTMLInputElement>) {
        function onFileWrite() {
            readTelenotesManifest().then((result: TelenotesManifests) => {
                setNoteManifests(result);
            });
        } 
        if (event.target.files) {
            const file = event.target.files[0];
            console.log(importContactPhoneNumber, importContactName);

            if (importContactPhoneNumber && importContactPhoneNumber !== "") {
                createNewDocumentFromRecording(file, {
                    phoneNumber: importContactPhoneNumber,
                    name: (importContactName === "") ? undefined : importContactName
                }, onFileWrite).catch(error => {
                    console.error(error);
                });
            }
            else {
                openImportStatusAlert("Phone number is required to import the recording as a note.");
            }
        }
    }

    return (<>
        <IonAlert
            ref={importAlertRef}
            header="Import Recording"
            subHeader="Plase enter the following details to import the recording as a note."
            buttons={[
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Upload',
                    role: 'confirm',
                    handler: (input: AlertInput) => {
                        const inputValues = input as {[key: string]: string};
                        try {
                            const contactName = inputValues[0];
                            const contactPhoneNumber = inputValues[1];
                            setImportContactName(contactName);
                            setImportContactPhoneNumber(contactPhoneNumber);

                            importFileInputRef.current?.click();
                        } catch (error) {
                            openImportStatusAlert("Invalid input! Please try again.");
                        }
                    },
                },
            ]}
            inputs={[
                {
                    placeholder: 'Name',
                },
                {
                    placeholder: 'Phone Number',
                }
            ]}
        ></IonAlert>
        <input type="file" onChange={handleImportFileInputChange} multiple={false} ref={importFileInputRef} hidden />
        
        <IonAlert
            ref={importStatusAlertRef}
            header={importStatusAlertState.header}
            subHeader={importStatusAlertState.message}
            buttons={[
                {
                    text: 'OK',
                    role: 'cancel',
                }
            ]}
        ></IonAlert>
    </>);
};

export default ImportRecording;