const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
    testPreload: () => console.log("Test Successful!")
    /**************************his examples ***************************************
     * subscribeStatistics: (callback: (statistics: any) => void) => callback({}),
     * getStaticData: () => console.log('static");
    /**************************end examples *************************************** */
    // 'projects:create': (params: CreateProjectParams) => Promise<ProjectInfo>;
    // // assume each story project will contain a "project file" in the project directory
    // 'projects:load': (filePath:string) => Promise<ProjectInfo>;
    // 'projects:save': (project:ProjectInfo) => Promise<void>;
    // 'projects:recent': () => Promise<ProjectInfo[]>;
    // 'projects:delete':(projectPath:string) => Promise<boolean>;
    // 'projects:rename':(project:ProjectInfo, newName: string) => Promise<ProjectInfo>;
    // 'dialog:select-folder':() => Promise<string | undefined>
});