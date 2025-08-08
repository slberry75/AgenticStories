type ProjectInfo = {
    name: string;
    description?: string;
    createdAt: Date;
    lastModifiedAt?: Date;
    projectPath: string;
}

type CreateProjectParams ={
    name: string;
    description?: string;
    projectPath: string;
}

interface Window {
    electron: {
        testPreload: () => void;
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