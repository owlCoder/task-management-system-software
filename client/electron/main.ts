import { app, BrowserWindow, Menu, ipcMain, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;
ipcMain.handle("open-external", async (_event, url: string) => {
  if (!/^https?:\/\//i.test(url)) return;
  await shell.openExternal(url);
});

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    titleBarStyle: "default",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// -----------------------------------
// PDF EXPORT HANDLER (dodaj na kraj main.ts)
// -----------------------------------
ipcMain.handle("export-pdf", async (_event, payload: {
  html: string;      // HTML string koji frontend šalje za PDF
  filename: string;  // željeno ime fajla
}) => {
  try {
    if (!payload.html || !payload.filename) {
      throw new Error("Missing HTML or filename for PDF export");
    }

    // Kreiraj privremeni hidden prozor
    const pdfWin = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true,
      },
    });

    // Napuni prozor sa prosleđenim HTML-om
    await pdfWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(payload.html)}`);

    // Malo čekanje da se React/render mountuje
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generiši PDF
    const pdfBuffer = await pdfWin.webContents.printToPDF({
      landscape: false,
      printBackground: true,
      pageSize: "A4",
      // @ts-ignore
      marginType: 1,
    });



    // Sačuvaj u Downloads
    const pdfPath = path.join(app.getPath("downloads"), payload.filename);
    fs.writeFileSync(pdfPath, pdfBuffer);

    pdfWin.destroy();

    return { success: true, path: pdfPath };
  } catch (err: any) {
    console.error("PDF export failed:", err);
    return { success: false, error: err.message };
  }
});
