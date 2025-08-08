import { app, BrowserWindow, ipcMain } from "electron";``
import path from "path";
import  { isDev,debug }  from "./utils.js";
import { getPreloadPath } from "./pathResolver.js";    
import { createProject, pollRecentProjects } from "./testService.js";
import { AppDataService } from "./services/app-data-service.js";
app.on('ready', () => {
    debug({
        'Is Development': isDev(),
        'App Path': app.getAppPath(),
        'Preload Path': getPreloadPath()
    });

    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        }
    }); 

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173"); // Adjust the URL as needed for your development server
    }  else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html')); // Adjust the path as needed
    }

    const appDataService = new AppDataService();
    appDataService.initializeAppData().then(() => {
        debug('App data initialized');
    }).catch((error) => {
        debug('Failed to initialize app data:', error);
    });

    ipcMain.handle('projects:create', async (_, params:CreateProjectParams) => {
        debug(_, params);
        const projInfo = await createProject(params);
        return projInfo;
    });

    pollRecentProjects(mainWindow);
});