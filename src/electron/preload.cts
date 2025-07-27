const electron = require("electron");
 
electron.contextBridge.exposeInMainWorld("electron", {
    recentProjects: (callback) => {
        electron.ipcRenderer.on('recentProjects', (_: any, projects: ProjectInfo[]) => {
            callback(projects);
        });
    },
    createProject:(project:CreateProjectParams) => {
        return electron.ipcRenderer.invoke('projects:create', project);
    },
} satisfies Window['electron']); //satisfies Window['electron'];    
    