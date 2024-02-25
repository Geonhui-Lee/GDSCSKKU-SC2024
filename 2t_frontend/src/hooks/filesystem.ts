import { Directory, FileInfo, Filesystem } from "@capacitor/filesystem";
import { firebaseAuth } from "./firebase/core";

export function getUsernameBasedFilename(filename: string) {
    const prefix = (firebaseAuth.currentUser) ?
        btoa(firebaseAuth.currentUser.email as string) : "guest"
    return `${prefix}_${filename}`;
}

export async function checkFolder(folder: string, directory: Directory, rootPath?: string) {
    const fsResult = await Filesystem.readdir({
        path: (rootPath) ? rootPath : "",
        directory: directory,
    });

    for (const content of fsResult.files) {
        if (content.type === "directory") {
            if (content.name === folder) {
                return true;
            }
        }
    }

    return false; 
}

export function getFilenameFromURI(uri: FileInfo["uri"]): string | undefined {
    const uriParts = uri.split("/");
    const filename = uriParts.pop();
    if (filename) {
        return filename.split(".")[0];
    }
    else {
        return undefined;
    }
}