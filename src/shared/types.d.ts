type ProjectInfo = {
    name: string;
    description?: string;
    createdAt: Date;
    lastModifiedAt?: Date;
    lastOpenedAt: Date;
    projectPath: string;
}


type CreateProjectParams ={
    name: string;
    description?: string;
    projectPath: string;
}

type ServiceError = {
    type: 'filesystem'|'validation'|'input'|'service'|'other';
    message:string;
    details?:string;
}

type ServiceResult<T> = {
    data?: T;
    error?: ServiceError;
    success: boolean;
}

interface Window {
    electron: {
        recentProjects: (callback:(projects: ProjectInfo[]) => void) => void;
        createProject: (params:CreateProjectParams) => Promise<ProjectInfo>;
        // 'createProject': (params: CreateProjectParams) => Promise<ProjectInfo>;
        // subscribeDebug: (callback: string) => void;
        // test: () => Promise<string>;
        // 'projects:create': (params: CreateProjectParams) => Promise<ProjectInfo>;
        // 'projects:load': (filePath:string) => Promise<ProjectInfo>;
        // 'projects:save': (project:ProjectInfo) => Promise<void>;
        // 'projects:recent': () => Promise<ProjectInfo[]>;
        // 'projects:delete':(projectPath:string) => Promise<boolean>;
        // 'projects:rename':(project:ProjectInfo, newName: string) => Promise<ProjectInfo>;
        // 'dialog:select-folder':() => Promise<string | undefined>
    }   
}
// type IPCContract = {
//     'projects:create': (params: CreateProjectParams) => Promise<ProjectInfo>;
//     // assume each story project will contain a "project file" in the project directory
//     'projects:load': (filePath:string) => Promise<ProjectInfo>;
//     'projects:save': (project:ProjectInfo) => Promise<void>;
//     'projects:recent': () => Promise<ProjectInfo[]>;
//     'projects:delete':(projectPath:string) => Promise<boolean>;
//     'projects:rename':(project:ProjectInfo, newName: string) => Promise<ProjectInfo>;
//     'dialog:select-folder':() => Promise<string | undefined>
// }