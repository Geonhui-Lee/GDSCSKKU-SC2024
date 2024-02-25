import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { CapacitorHttpPlugin, HttpHeaders, HttpOptions } from "@capacitor/core/types/core-plugins";
import { ProtectorFeedRequest, ProtectorFeedResponse, ProtectorInvestigationGenerateExplainationRequest, ProtectorInvestigationGenerateExplainationResponse, TelenotesGenerateDocumentRequest, TelenotesGenerateDocumentResponse, TelenotesUploadAudioRequest, TelenotesUploadAudioResponse, backendDirectory } from "data/standard/apiStandard";
import { ProtectorRecord } from "data/standard/document/protector";
import { ProtectorFeed } from "data/standard/protectorStandard";

export const backendUrlRoot = import.meta.env.VITE_BACKEND_URL;
export const backendProductionMode = (import.meta.env.VITE_BACKEND_PRODUCTION_FETCH === "true" ? true : false);

export function getBackendUrl(directory: string) {
    return `${backendUrlRoot}${directory}`;
}

export async function sendDemoRequest(backendDirectory: string): Promise<HttpResponse> {
    const fakeBackendDirectory = backendDirectory.replace(/\//g, "_");
    return await CapacitorHttp.get({
        url: '/demo/' + fakeBackendDirectory + '.json',
    });
}

export async function sendGetRequest(backendDirectory: string, parameters?: Record<string, string>, headers?: HttpHeaders): Promise<HttpResponse> {
    if (backendProductionMode) {
        return await CapacitorHttp.get({
            url: getBackendUrl(backendDirectory),
            params: parameters,
            headers: headers
        });
    }
    else {
        return sendDemoRequest(backendDirectory);
    }
}

export function convertObjectToGetRecord(object: {[key: string]: string}): Record<string, string> {
    const record: Record<string, string> = {};
    for (const key in object) {
        record.key = object[key];
    }
    return record;
}

export async function sendPostRequest(backendDirectory: string, options?: Partial<HttpOptions>, headers?: HttpHeaders): Promise<HttpResponse> {
    if (backendProductionMode) {
        return await CapacitorHttp.post({
            ...options,
            url: getBackendUrl(backendDirectory),
            headers: headers
        });
    }
    else {
        return sendDemoRequest(backendDirectory);
    }
}

export async function sendPostRequestAsFormData(backendDirectory: string, options: Partial<HttpOptions>, headers?: HttpHeaders): Promise<HttpResponse> {
    return await sendPostRequest(backendDirectory, options, {
        ...headers,
        "Content-Type": "multipart/form-data"
    });
}

export async function requestTelenotesDocumentGeneration(id: string, file: File): Promise<TelenotesGenerateDocumentResponse> {
    const uploadData: TelenotesUploadAudioRequest = {
        id: id,
        file: file
    };
    const uploadResponse = await sendPostRequestAsFormData(backendDirectory.telenotes.uploadAudio, { data: uploadData });
    const uploadResponseData: TelenotesUploadAudioResponse = uploadResponse.data;

    const generationData: TelenotesGenerateDocumentRequest = {
        id: id,
        gcs_uri: uploadResponseData.gcs_uri
    };
    const generationResponse = await sendGetRequest(backendDirectory.telenotes.generateDocument, {
        id: generationData.id,
        gcs_uri: generationData.gcs_uri
    });
    return generationResponse.data;
}

export async function requestProtectorInvestigationExplaination(records: ProtectorRecord[]): Promise<string> {
    const data: ProtectorInvestigationGenerateExplainationRequest = {
        records: records,
    };
    const response: HttpResponse = await sendPostRequest(backendDirectory.protector.investigation.generateExplaination, { data: data });
    const responseData: ProtectorInvestigationGenerateExplainationResponse = response.data;
    return responseData.explanation;
};

export async function requestProtectorInvestigationHumanResponseConfirmation(message: string): Promise<boolean> {
    const data = {
        message: message
    };
    const response = await sendPostRequest(backendDirectory.protector.investigation.humanResponseConfirmation, { data: data });
    const responseData = response.data;
    return responseData.isVoicePhishing;
}

export async function requestProtectorFeed(): Promise<ProtectorFeed[]> {
    const data: ProtectorFeedRequest = {};
    const response: HttpResponse = await sendGetRequest(backendDirectory.protector.feed);
    const responseData: ProtectorFeedResponse = response.data;

    const feeds: ProtectorFeed[] = [];
    responseData.entries.forEach((feed) => {
        feeds.push({
            title: feed.title,
            url: feed.link,
            created_at: new Date(feed.date),
            source: {
                content: feed.source,
                feed: responseData.feed.description
            },
            media: feed.media
        });
    });
    return feeds;
}

export function isProductionMode() {
    return import.meta.env.MODE === "production";
}