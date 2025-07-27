import { app } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import { writeJsonFileAtomic } from "../utils.js";

export class AppDataService {

    private static readonly MAX_RECENT_PROJECTS = 10;

    private appDataPath: string;
    private recentProjectsPath: string;

    constructor() {
        this.appDataPath = app.getPath('userData');
        this.recentProjectsPath = path.join(this.appDataPath, 'recent-projects.json');
        console.log({
            appDataPath: this.appDataPath, 
            recentProjectsPath: this.recentProjectsPath
        });
    }

    async initializeAppData(): Promise<void> {
        try {
            await fs.promises.access(this.recentProjectsPath);
        }  catch {
            // If the file does not exist, create it
            await fs.promises.writeFile(this.recentProjectsPath, JSON.stringify([]));
        }
        
    }

    async loadRecentProjects(): Promise<ServiceResult<ProjectInfo[]>> {
        let result:ServiceResult<ProjectInfo[]> = {
            success: false,
        };
        try {
            const fileContents = await fs.promises.readFile(this.recentProjectsPath, {encoding: 'utf-8'});
            
            try {
                result.data = JSON.parse(fileContents);
                result.success = true;
            }  catch (ex) {
                    result.error = {
                        type: 'validation',
                        message: 'Failed to parse recent projects file',
                        details: ex instanceof Error ? ex.message + (ex.stack ?? '') : undefined
                    };
            }
        }  catch {
            result.error = {
                type: 'filesystem',
                message: 'Failed to read recent projects file',
                details: this.recentProjectsPath
            };
            this.initializeAppData();
        } finally {
            return result;
        }        
    }

    async saveRecentProjects(projects: ProjectInfo[]): Promise<ServiceResult<void>> { 
        return writeJsonFileAtomic(this.recentProjectsPath, projects);       
    }

    async addRecentProject(project: ProjectInfo): Promise<ServiceResult<void>> {
        let result:ServiceResult<void> = {
            success: false
        };
        const recentProjects = await this.loadRecentProjects();

        if (!recentProjects.success) {
            result.error = recentProjects.error;
        }  else {        
            let projects:ProjectInfo[] = (recentProjects.data ?? [])
                                .filter(p => p.projectPath !== project.projectPath)
                                .slice(0, AppDataService.MAX_RECENT_PROJECTS - 1);

            projects.unshift(project);

            return this.saveRecentProjects(projects);
        }

        return result;
    }
}