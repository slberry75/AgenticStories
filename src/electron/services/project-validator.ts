import { ServiceError, ServiceResult } from "../../shared/lib/service-objects.js";
import fs from 'fs';
import path from "path";
import { ZipUtils }  from "../../shared/utils/zip-utils.js";
import { PROJECT_FILES, PROJECT_EXTENSIONS } from "../../shared/lib/project-constants.js";    
import JSZip from "jszip";
export class ProjectValidator {
    static async validateArchiveExists(filePath: string) : Promise<ServiceResult<void>> {
        const projectAccess = await this.haveFileAccess(filePath);
        if (!filePath.toLowerCase().endsWith(PROJECT_EXTENSIONS.ARCHIVE)) {
            return ServiceResult.fail(
                new ServiceError('input', 'Invalid file type.  Expected .ags archive file.')
            )
        }
        if (!projectAccess.success) {
            return projectAccess;
        }
        const fileStats = await fs.promises.stat(filePath);
        if (fileStats.size <= 0) {
            return ServiceResult.fail(
                new ServiceError('validation', 'Project archive file is empty', filePath)
            )
        }
        if (fileStats.isDirectory()) {
            return ServiceResult.fail(
                new ServiceError('validation', 'Selected project is a directory', filePath)
            )
        }
        return ServiceResult.success();
    }

    static async validateArchiveStructure(filePath:string) : Promise<ServiceResult<void>> {
        const archiveExists = await this.validateArchiveExists(filePath);
        if (!archiveExists.success) {
            return archiveExists;
        }
        const zipResult = await ZipUtils.loadZipFile(filePath);
        
        if (!zipResult.success ) {
            return ServiceResult.fail(
                zipResult.error 
                ?? new ServiceError('validation', 'Failed to load project archive', filePath)
            );
        }
        const zip = zipResult.data as JSZip;
        const projectFile = ZipUtils.getZipFile(zip, PROJECT_FILES.METADATA);
        if (projectFile === null) {
            return ServiceResult.fail(
                new ServiceError('validation', 'project metadata is missing')
            )
        }

        const workflowFile = ZipUtils.getZipFile(zipResult.data as JSZip, PROJECT_FILES.WORKFLOW_CONFIGURATION);
        if (workflowFile === null) {
            return ServiceResult.fail(
                new ServiceError('validation', 'workflow configuration is missing')
            )
        }
        return ServiceResult.success();
    }

    private static async haveFileAccess(filePath:string, permissions = fs.constants.R_OK): Promise<ServiceResult<void>> {
        try {
            await fs.promises.access(filePath, permissions);
            return ServiceResult.success();
        }
        catch {
            return ServiceResult.fail(
                new ServiceError('filesystem', 'No read/write access', filePath)
            );
        }
    }
};