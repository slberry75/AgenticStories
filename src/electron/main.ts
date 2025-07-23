import { app, BrowserWindow } from "electron";``
import path from "path";
import  { isDev }  from "./utils.js";
import { getPreloadPath } from "./pathResolver.js";    

app.on('ready', () => {
    console.log({
        'Is Development': isDev(),
        'App Path': app.getAppPath(),
        'Preload Path': getPreloadPath()
    });
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath() //}
        }
    }); 

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173"); // Adjust the URL as needed for your development server
    }  else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html')); // Adjust the path as needed
    }

});