import { PermissionHandleResult } from 'data/standard/nativeController/permissionStandard';

export const pluginNames = {
    CallController: "CallController",
    SmsInboxReaderController: "SmsInboxReaderController",
    ResponseController: "ResponseController",
    ContactsController: "ContactsController",
    PermissionHandleController: "PermissionHandleController"
}
export interface CallPlugin {
    call(options: { phoneNumber: string }): Promise<void>;
};

export interface ResponsePlugin {
    response(options: { phoneNumber: string }): Promise<void>;
};

export interface ContactsPlugin {
    getLists(
        options?: { search?: string }
    ): Promise<{
        contacts: {
            id: string;
            name: string;
            phoneNumber: string;
        }[];
    }>
};

export interface SmsInboxReaderPlugin {
    getCount(): Promise<{ count: number }>;
    getAllMessages(): Promise<{ sms: { from: string, message: string }[], count: number }>;
    getMessagesByPhoneNumber(options: { phoneNumber: string }): Promise<{ sms: { from: string, message: string }[], count: number }>;
};

export interface PermissionHandlePlugin {
    checkRequiredPermissions(): Promise<PermissionHandleResult>;
    requestRequiredPermissions(): Promise<void>;
}