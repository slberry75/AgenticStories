import { ServiceError, ServiceResult } from "../../shared/lib.js";
import fs from 'fs';
import path from "path";

export class ProjectValidator {
    static async validateProjectExists(projectPath: string) : Promise<ServiceResult<void>> {
        const projectAccess = await this.haveFileAccess(projectPath);
        if (!projectAccess.success) {
            return projectAccess;
        }
        return ServiceResult.success();
    }

    static async validateProjectStructure(projectPath:string) : Promise<ServiceResult<void>> {
        const projectExists = await this.validateProjectExists(projectPath); 
        if (!projectExists.success) {
            return projectExists;
        }
        const projectFilePath = path.join(projectPath, "project.json");
        const workflowDir = path.join(projectPath, "workflow");
        const workflowFilePath = path.join(workflowDir, "workflow.yaml");

        const projFileExists = await this.haveFileAccess(projectFilePath);
        if (!projFileExists.success){
            return projFileExists;
        }
        const workflowDirExists = await this.haveFileAccess(workflowDir);
        if (!workflowDirExists.success) {
            return workflowDirExists;
        }

        var workflowFileExists = await this.haveFileAccess(workflowFilePath);
        if (!workflowFileExists.success) {
            return workflowFileExists;
        }
        
        return ServiceResult.success();
    }

    private static async haveFileAccess(filePath:string): Promise<ServiceResult<void>> {
        try {
            await fs.promises.access(filePath, fs.constants.R_OK | fs.constants.W_OK);
            return ServiceResult.success();
        }
        catch {
            return ServiceResult.fail(
                new ServiceError('filesystem', 'No read/write access', filePath)
            );
        }
    }
};