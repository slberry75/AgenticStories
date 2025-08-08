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

// type ServiceError = {
//     type: 'filesystem'|'validation'|'input'|'service'|'other';
//     message:string;
//     details?:string;
// }
type ServiceErrorTypes = 'filesystem'|'validation'|'input'|'service'|'other';
interface Window {
    electron: {
        recentProjects: (callback:(projects: ProjectInfo[]) => void) => void;
        createProject: (params:CreateProjectParams) => Promise<ProjectInfo>;
    }   
}