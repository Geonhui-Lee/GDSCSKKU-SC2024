import { Directory, Encoding, FileInfo, Filesystem, ReadFileResult, ReaddirResult } from "@capacitor/filesystem";
import { demoTelenotes, demoTelenotesDocument } from "data/demo/demoDocument";
import { TelenotesDocument, TelenotesManifest, TelenotesManifests } from "data/standard/document/telenotes";
import { rootFilesystemConfig, telenotesFilesystemConfig } from "data/standard/filesystemStandard";
import { checkFolder } from "hooks/filesystem";
import { deleteTelenotesDocument, getTelenotesDocumentPath, writeDefaultTelenotesDocuments } from "hooks/pages/telenotes/filesystem/documentFS";

export const defaultTelenotesManifests = demoTelenotes;

export async function initiateFSTelenotesManifest() {
    const isTelenotesManifestExists: boolean = await Filesystem.readFile({
        path: rootFilesystemConfig.telenotesManifestFile.path,
        directory: rootFilesystemConfig.telenotesManifestFile.directory,
    }).then(() => {
        return true;
    }).catch(() => {
        return false;
    });

    if (!isTelenotesManifestExists) {
        await Filesystem.writeFile({
            path: rootFilesystemConfig.telenotesManifestFile.path,
            directory: rootFilesystemConfig.telenotesManifestFile.directory,
            data: JSON.stringify(defaultTelenotesManifests),
            encoding: Encoding.UTF8
        });
    }
}

export async function readTelenotesManifest(): Promise<TelenotesManifests> {
    await initiateFSTelenotesManifest();

    return await Filesystem.readFile({
        path: rootFilesystemConfig.telenotesManifestFile.path,
        directory: rootFilesystemConfig.telenotesManifestFile.directory,
        encoding: Encoding.UTF8
    }).then((result: ReadFileResult) => {
        const manifestData: TelenotesManifest[] = JSON.parse(result.data as string);
        for (const manifest of manifestData) {
            manifest.time.created = new Date(manifest.time.created);
            if (manifest.time.modified) {
                manifest.time.modified = new Date(manifest.time.modified);
            }
        }
        return manifestData;
    }); 
}

export async function writeTelenotesManifest(data: TelenotesManifests): Promise<void> {
    await initiateFSTelenotesManifest();

    const dataAsString: string = JSON.stringify(data);

    await Filesystem.writeFile({
        path: rootFilesystemConfig.telenotesManifestFile.path,
        directory: rootFilesystemConfig.telenotesManifestFile.directory,
        data: dataAsString,
        encoding: Encoding.UTF8
    });
}

export async function readTelenotesDocumentFolder(): Promise<ReaddirResult> {
    const isTelenotesFolderExists: boolean = await checkFolder(
        telenotesFilesystemConfig.document.path,
        telenotesFilesystemConfig.document.directory,
    );

    if (!isTelenotesFolderExists) {
        await Filesystem.mkdir({
            path: telenotesFilesystemConfig.document.path,
            directory: telenotesFilesystemConfig.document.directory,
            recursive: true
        });
        await Filesystem.mkdir({
            path: telenotesFilesystemConfig.media.path,
            directory: telenotesFilesystemConfig.media.directory,
            recursive: true
        });
        writeDefaultTelenotesDocuments();
    }

    return await Filesystem.readdir({
        path: telenotesFilesystemConfig.document.path,
        directory: telenotesFilesystemConfig.document.directory
    }).then((result: ReaddirResult) => {
        return result;
    });
}

export async function deleteTelenotesManifestItem(id: string, onEventComplete?: () => void): Promise<void> {
    async function deleteTelenotesManifestItemFromFS(id: string) {
        const telenotesManifest = await readTelenotesManifest();
        const newManifests = telenotesManifest.filter((manifest) => manifest.id !== id);
        await writeTelenotesManifest(newManifests);
    }
    await deleteTelenotesDocument(id).then(() => {
        onEventComplete?.();
    }).catch((error) => {
        onEventComplete?.();
    });
    await deleteTelenotesManifestItemFromFS(id);
};

export async function syncManifestWithDocuments() {
    //const savedManifestData: TelenotesManifests = await readTelenotesManifest();
    const newManifestData: TelenotesManifests = []; //[...savedManifestData];
    
    const documentFolder: ReaddirResult = await readTelenotesDocumentFolder();
    console.log(documentFolder);
    documentFolder.files.forEach(async (file: FileInfo) => {
        await Filesystem.readFile({
            path: getTelenotesDocumentPath(file.name, true),
            directory: telenotesFilesystemConfig.document.directory,
            encoding: Encoding.UTF8
        }).then((result: ReadFileResult) => {
            const documentData: TelenotesDocument = JSON.parse(result.data as string);
            const id = documentData.id;

            const isDocumentExists = newManifestData.find(manifest => manifest.id === id);
            if (isDocumentExists) {
                const index = newManifestData.indexOf(isDocumentExists);
                newManifestData[index].time.modified = new Date();
                newManifestData[index].info = documentData.manifestInfo;
            }
            else {
                newManifestData.push({
                    id: id,
                    time: {
                        created: new Date()
                    },
                    info: {
                        contact: documentData.manifestInfo.contact,
                        title: documentData.manifestInfo.title
                    },
                });
            }
        });
    });

    await writeTelenotesManifest(newManifestData);
}