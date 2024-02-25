export interface PermissionHandleResult {
    status: "granted" | "denied";
    deniedPermissions?: string[];
}