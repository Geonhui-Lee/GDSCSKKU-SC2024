export const protectorRecordStandard = {
    standardValue: {
        warning: 80,
        danger: 95,
    }
};

export interface ProtectorFeed {
    created_at: Date;
    title: string;
    url: string;
    source: {
        content: string;
        feed: string;
    };
    media?: Array<{
        type: "image";
        url: string;
    }>
}