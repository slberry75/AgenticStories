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

type ServiceErrorTypes = 'filesystem'|'validation'|'input'|'service'|'other';
interface Window {
    electron: {
        recentProjects: (callback:(projects: ProjectInfo[]) => void) => void;
        createProject: (params:CreateProjectParams) => Promise<ProjectInfo>;
    }   
}

type TemplateInfo = {
  name: string;
  description?: string;
  author?: string;
  version?: string;
  filePath: string;        // Full path to .agtpl file
  isBuiltIn: boolean;      // True for assets/templates, false for userData
}

type TemplateMetadata = {
  name: string;
  description?: string;
  author?: string;
  version?: string;
}