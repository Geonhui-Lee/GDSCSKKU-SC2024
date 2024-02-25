import { Context, createContext, useContext } from "react";
import { TelenotesManifest, TelenotesId } from "data/standard/document/telenotes";
import { ProtectorInvestigation, ProtectorRecord, ProtectorReport } from "data/standard/document/protector";
import { TelenotesPageContext } from "pages/Notes";
import { ProtectorPageContext } from "pages/Protector";
import { SwiperRef } from "swiper/react";
import { UserSectionAppContext } from "components/render";
import { MessagesDocument, MessagesDocuments } from "data/standard/document/messages";
import { ContactManifest } from "data/standard/document";

export interface UserSectionContext {
    state: {
        protector: {
            swiperRef: React.MutableRefObject<SwiperRef | null>;
        }
    },
    setState: React.Dispatch<React.SetStateAction<UserSectionContext["state"]>>;
    setPartialState?: (state: Partial<UserSectionContext["state"]>) => void;
}

export const userSectionContext = {
    createContext: () => createContext<UserSectionContext | null>(null),
    useContext: (context: Context<UserSectionContext>) => useContext(context) as UserSectionContext,
}

export interface ViewTelenotesContext {
    noteManifests: TelenotesManifest[];
    setNoteManifests: React.Dispatch<React.SetStateAction<TelenotesManifest[]>>;
    noteId: string;
    setNoteId: (id: string) => void;
    deleteNoteManifest: (id: TelenotesId) => void;
    syncManifestFromFilesystem: () => void;
};

export const telenotesContext = {
    createContext: () => createContext<ViewTelenotesContext | null>(null),
    useContext: (context: Context<ViewTelenotesContext>) => useContext(context) as ViewTelenotesContext,
};

export interface ProtectorReportContext {
    report: ProtectorReport | undefined;
    setReport: React.Dispatch<React.SetStateAction<ProtectorReportContext["report"]>>;
};

export const protectorContext = {
    createContext: () => createContext<ProtectorReportContext | null>(null),
    useContext: (context: Context<ProtectorReportContext>) => useContext(context) as ProtectorReportContext,
};

export interface ViewMessagesContext {
    messagesDocuments: MessagesDocument[] | undefined;
    setMessagesDocuments: React.Dispatch<React.SetStateAction<ViewMessagesContext["messagesDocuments"]>>;
    currentMessagesDocument: MessagesDocument | undefined;
    setCurrentMessagesDocument: (messagesDocument: MessagesDocument) => void;
}

export const messagesContext = {
    createContext: () => createContext<ViewMessagesContext | null>(null),
    useContext: (context: Context<ViewMessagesContext>) => useContext(context) as ViewMessagesContext,
};

export interface ProtectorHQContext {
    syncDataFromFilesystem: () => void;
    openSuspectedCase: (contact: ContactManifest) => void;
    protectorRecords: ProtectorRecord[] | undefined;
    setProtectorRecords: React.Dispatch<React.SetStateAction<ProtectorRecord[] | undefined>>;
    protectorInvestigations: ProtectorInvestigation[] | undefined;
    setProtectorInvestigations: React.Dispatch<React.SetStateAction<ProtectorInvestigation[] | undefined>>;
}

export const protectorHQContext = {
    createContext: () => createContext<ProtectorHQContext | null>(null),
    useContext: (context: Context<ProtectorHQContext>) => useContext(context) as ProtectorHQContext,
};