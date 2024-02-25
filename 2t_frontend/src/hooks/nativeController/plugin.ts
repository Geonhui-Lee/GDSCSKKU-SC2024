import { registerPlugin } from '@capacitor/core';
import { ResponsePlugin, CallPlugin, ContactsPlugin, PermissionHandlePlugin, pluginNames, SmsInboxReaderPlugin } from 'data/standard/nativeController/pluginStandard';

export const CallController = registerPlugin<CallPlugin>(pluginNames.CallController);
export const SmsInboxReaderController = registerPlugin<SmsInboxReaderPlugin>(pluginNames.SmsInboxReaderController);
export const ResponseController = registerPlugin<ResponsePlugin>(pluginNames.ResponseController);
export const ContactsController = registerPlugin<ContactsPlugin>(pluginNames.ContactsController);
export const PermissionHandleController = registerPlugin<PermissionHandlePlugin>(pluginNames.PermissionHandleController);

export interface EchoPlugin {
    echo(options: { value: string }): Promise<{ value: string }>;
}

const Echo = registerPlugin<EchoPlugin>('Echo');

export default Echo;