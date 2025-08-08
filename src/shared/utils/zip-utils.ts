import  JSZip, { type JSZipObject }  from "jszip";
import fs from 'fs';
import { ServiceError, ServiceResult } from "../lib/service-objects.js";

export class ZipUtils {
    /**
     * 
     * @param filePath the path on where the zip file lives
     * @returns JSZip object
     */
    static async loadZipFile(filePath: string) : Promise<ServiceResult<JSZip>> {
        try {
            const archiveContents = await fs.promises.readFile(filePath);
            try {
                const zip = await JSZip.loadAsync(archiveContents);
                return ServiceResult.ok(zip);
            }  catch {
                return ServiceResult.fail(
                    new ServiceError('input', 'Unable to expand project archive', filePath)
                );
            }
        }  catch(error) {
            const detail = error instanceof Error ? error : undefined;
            return ServiceResult.fail(
                new ServiceError('filesystem', `Invalid or corrupted archive file: ${detail ? detail.message : ''},`, detail ? detail.stack : undefined)
            )
        }
    }
    /**
     * 
     * @param zip the JSZip archive
     * @param filePath the path to the file in the archive 
     * @returns the JSZipObject requested or null if it doesn't exist
     */
    static getZipFile(zip: JSZip, filePath: string): JSZipObject | null {

        const folderZip = this.getZipEntryParentFolder(zip, filePath);
        if (folderZip === null) {
            return null;
        }
        return folderZip.file(filePath);
    }  
    
    /**
     * 
     * @param zip the parent folder zip or the archive root where the folder should appear
     * @param folderPath the name of the folder
     * @returns JSZip representing the folder or null if the folder does not exist
     */
    static getZipFolder(zip: JSZip, folderPath: string): JSZip | null {
        const parentFolderZip = this.getZipEntryParentFolder(zip, folderPath);
        if (parentFolderZip == null) {
            return parentFolderZip;
        }
        return parentFolderZip.folder(folderPath + '/');
    }

    /**
     * 
     * @param zipFile JSZipObject
     * @returns Promise<ServiceResultMstring>>
     */
    static async extractTextFromZip(zipFile: JSZipObject ) : Promise<ServiceResult<string>> {
        try {
            const fileContents = await zipFile.async('string');
            return ServiceResult.ok(fileContents);
        }  catch {
            return ServiceResult.fail(
                new ServiceError('input', 'Error reading file content', zipFile.name)
            );
        }
    }

    /**
     * 
     * @param zip 
     * @param entryPath the path to the containing folder or file in the zip folder
     * @returns JSZip instance of parent folder of path to entry or null if it isn't in the zip 
     */
    private static getZipEntryParentFolder(zip: JSZip, entryPath: string): JSZip | null {

        const pathParts = entryPath.split('/').filter(x => x !== '');

        let folderZip:JSZip | null = zip; 
        for (let i = 0; i < pathParts.length-1; i++) {
            if (folderZip === null) {
                return null;
            }
            folderZip = this.getZipFolder(folderZip, pathParts[i] + '/');
        }
        return folderZip;
    }
}