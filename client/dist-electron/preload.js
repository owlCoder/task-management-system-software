"use strict";
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld("electronAPI", {
    exportPdf: (payload) => ipcRenderer.invoke("export-pdf", payload),
    getLogoUrl: () => `${window.location.origin}/logo_print.png`
});
//# sourceMappingURL=preload.js.map