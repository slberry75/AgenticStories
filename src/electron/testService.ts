import { BrowserWindow } from "electron";

const POLLING_INTERVAL = 1000;

const recentProjects:ProjectInfo[] = [
    {
        name: "Project 1",
        description: "This is the first project",
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        lastOpenedAt: new Date(),
        projectPath: "/path/to/project1"
    },
    {
        name: "Project 2",
        description: "This is the second project",
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        lastOpenedAt: new Date(),
        projectPath: "/path/to/project2"
    },
    {
        name: "Project 3",
        description: "This is the third project",
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        lastOpenedAt: new Date(),
        projectPath: "/path/to/project3"
    }       
]

async function getRecentProjects():Promise<ProjectInfo[]> {
    return Promise.resolve(recentProjects);
}

export function pollRecentProjects(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const recentProjects = await getRecentProjects();
        mainWindow.webContents.send('recentProjects', recentProjects);
    }, POLLING_INTERVAL);
}

export async function createProject(project: CreateProjectParams): Promise<ProjectInfo> {
    return Promise.resolve({
        name: project.name,
        description: project.description,
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        lastOpenedAt: new Date(),
        projectPath: project.projectPath
    });
}