import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { PermissionHandleController } from "hooks/nativeController/plugin";
import { PermissionHandleResult } from "data/standard/nativeController/permissionStandard";
import { UseIonRouterResult } from '@ionic/react';
import { pageDestinations } from 'data/destination';

export function checkAppPermissionsInBackground(onPermissionsNotGranted: () => void) {
    isAppPermissionsGranted().then((isPermissionsGranted: boolean) => {
        if (!isPermissionsGranted) {
            onPermissionsNotGranted();
        }
    }).catch((error: any) => {
        console.error(error);
        //onPermissionsNotGranted();
    });
}

export async function checkAppPermissions(): Promise<PermissionHandleResult> {
    const deniedPermissions: string[] = [];

    const fileSystemPermission = await Filesystem.checkPermissions();
    if (fileSystemPermission.publicStorage !== "granted") {
        deniedPermissions.push("Filesystem");
    }
    
    try {
        const permissionHandlerResult = await PermissionHandleController.checkRequiredPermissions();
        if (permissionHandlerResult.status === "granted") {
            if (deniedPermissions.length === 0) {
                return {
                    status: "granted"
                };
            }
            else {
                return {
                    status: "denied",
                    deniedPermissions: deniedPermissions
                };
            }
        }
        else {
            return {
                status: permissionHandlerResult.status,
                deniedPermissions: permissionHandlerResult.deniedPermissions
            };
        }
    }
    catch (error) {
        console.error(error);
        if (deniedPermissions.length === 0) {
            return {
                status: "granted"
            };
        }
        else {
            return {
                status: "denied",
                deniedPermissions: deniedPermissions
            };
        }
    }
}

export async function requestAppPermissions(): Promise<PermissionHandleResult> {
    await Filesystem.requestPermissions();
    await PermissionHandleController.requestRequiredPermissions();
    return await checkAppPermissions();
}

export async function isAppPermissionsGranted(): Promise<boolean> {
    return (await checkAppPermissions()).status === "granted";
}