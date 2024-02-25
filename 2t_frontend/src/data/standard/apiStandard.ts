import { TelenotesDocument, TelenotesId } from "data/standard/document/telenotes";
import { ProtectorRecord } from "./document/protector";

export interface OnCallDetectRequest {
    text: string;
};

export interface OnCallDetectResponse {
    score: string;
};

export interface TelenotesUploadAudioRequest {
    id: TelenotesId;
    file: File;
}

export interface TelenotesUploadAudioResponse {
    id: TelenotesId;
    gcs_uri: string;
}

export interface TelenotesGenerateDocumentRequest {
    id: TelenotesId;
    gcs_uri: string;
};

export interface TelenotesGenerateDocumentResponse {
    id?: TelenotesId;
    document: {
        transcript: TelenotesDocument["transcript"];
        summary: TelenotesDocument["summary"];
    };
};

export interface ProtectorFeedRequest {};
export interface ProtectorFeedResponse {
    feed: {
        title: string;
        link: string;
        description: string;
    },
    entries: Array<{
        title: string;
        link: string;
        date: string;
        source: string;
        media?: Array<{
            type: "image";
            url: string;
        }>
    }>
};

export interface ProtectorInvestigationGenerateExplainationRequest {
    records: ProtectorRecord[];
};

export interface ProtectorInvestigationGenerateExplainationResponse {
    explanation: string;
};

export interface ProtectorInvestigationHumanResponseConfirmationRequest {
    message: string;
}

export interface ProtectorInvestigationHumanResponseConfirmationResponse {
    isVoicePhishing: boolean;
}


export const backendDirectory = {
    onCall: {
        detect: "/oncall/detect_voice_phishing"
    },
    telenotes: {
        uploadAudio: "/telenotes/upload_audio",
        generateDocument: "/telenotes/generate_document"
    },
    protector: {
        feed: "/protector/feed",
        investigation: {
            generateExplaination: '/protector/investigation/generate_explaination',
            humanResponseConfirmation: '/protector/investigation/human_response_confirmation'
        }
    }
};