import { app, BrowserWindow } from "electron";``
import path from "path";
import  { isDev }  from "./utils.js";    

app.on('ready', () => {
    const mainWindow = new BrowserWindow({}); 

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173"); // Adjust the URL as needed for your development server
    }  else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html')); // Adjust the path as needed
    }
    console.log("Development mode:", isDev());

});