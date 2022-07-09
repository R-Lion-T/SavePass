import { app, BrowserWindow, dialog, ipcMain, screen } from "electron";
import fs from "fs";
import path from "path";
import CryptoJS from "crypto-js";
import isDev from "electron-is-dev";

export default class MainApp {
    constructor() {
        this.win = null;
        this.path = null;
        this.password = null;
        this.file = null;
        this.subscribeForAppEvents();
    }

    createWindow() {
        const { width, height } = screen.getPrimaryDisplay().size;
        let maxWidth = 0,
            maxHeight = 0;

        screen.getAllDisplays().forEach(({ size }) => {
            if (size.width > width) maxWidth = size.width;
            if (size.height > height) maxHeight = size.height;
        });

        this.win = new BrowserWindow({
            title: CONFIG.title,
            maxHeight,
            maxWidth,
            width: 340,
            height: 670,
            minWidth: 340,
            minHeight: 670,
            icon: "resources/icon.ico",
            titleBarStyle: "hidden",
            show: false,
            center: true,
            resizable: false,
            webPreferences: {
                devTools: CONFIG.devTools,
                worldSafeExecuteJavaScript: true,
                preload: path.join(app.getAppPath(), "preload", "index.js"),
            },
        });

        this.win.loadFile("renderer/index.html");

        this.win.webContents.openDevTools({
            mode: "detach",
        });

        this.win.on("closed", () => {
            this.win = null;
        });

        this.win.webContents.on("did-finish-load", () => {
            const file = process.argv[1];
            if (file && isDev == false) {
                this.file = file;
                this.win.webContents.send("OPEN_PAGE_CHECKED_PASSWORD");
            }
            this.win.show();
        });

        ipcMain.on("APP_HIDE", () => this.win.minimize());

        ipcMain.on("APP_EXIT", () => app.exit());

        ipcMain.on("APP_RESIZE_WINDOW", () => {
            if (this.win.isMaximized()) this.win.unmaximize();
            else this.win.maximize();
        });

        ipcMain.handle("GET_STATUS_WINDOW", () => {
            return {
                resize: this.win.isMaximized(),
            };
        });

        this.win.on("resize", () => {
            this.win.webContents.send("APP_RESIZE_WINDOW_ACCESS", {
                resize: this.win.isMaximized(),
            });
        });
        ipcMain.handle("GET_VERSION_APP", () => {
            return app.getVersion();
        });

        ipcMain.handle("SHOW_ERROR_WINDOW", (_, args) => {
            return this.showErrorMessage(args);
        });
        ipcMain.handle("SHOW_MESSAGE_WINDOW", (_, args) => {
            return this.showMessageWindow(args);
        });
        ipcMain.handle("CREATE_PATH_FILE", () => {
            return this.createPathFile();
        });
        ipcMain.handle("CREATE_FILE", (_, args) => {
            return this.createFile(args);
        });
        ipcMain.handle("UPDATE_FILE", (_, array) => {
            return this.updateFile(array);
        });
        ipcMain.handle("ADD_DATA_FILE", (_, item) => {
            return this.addDataFile(item);
        });
        ipcMain.handle("UPDATE_DATA_FILE", (_, item) => {
            return this.updateDataFile(item);
        });
        ipcMain.handle("DELETE_DATA_FILE", (_, obj) => {
            return this.deleteDataFile(obj);
        });
        ipcMain.handle("OPEN_DATA_FILE", (_, lastPathFile) => {
            return this.openDataFile(lastPathFile);
        });
        ipcMain.handle("CHECKED_PASSWORD_FILE", (_, password) => {
            return this.checkedPasswordFile(password);
        });
        ipcMain.handle("LOGOUT", (_, password) => {
            return this.closeFile();
        });
    }

    subscribeForAppEvents() {
        app.whenReady().then(() => this.createWindow());

        app.on("window-all-closed", () => {
            if (process.platform !== "darwin") {
                app.quit();
            }
        });

        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }
    // Показать ошибку
    showErrorMessage(message = "Возникла непредвиденная ошибка") {
        return dialog.showMessageBoxSync(this.win, {
            message,
            type: "error",
            title: CONFIG.title,
        });
    }
    // Показать сообщение
    showMessageWindow(message) {
        return dialog.showMessageBoxSync(this.win, {
            title: CONFIG.title,
            type: "question",
            message,
            buttons: ["Отмена", "Удалить"],
            noLink: true,
        });
    }
    // создать путь для сохранения файла
    createPathFile() {
        var url = dialog.showOpenDialogSync(this.win, {
            title: "Выберите место для хранения данных",
            defaultPath: app.getPath("desktop"),
            properties: ["openDirectory"],
            buttonLabel: "Создать",
        });
        if (url) {
            this.path = url[0];
            return true;
        }
        this.path = null;
        return false;
    }
    // создать файл
    createFile(password) {
        try {
            this.password = password;
            const result = this.encrypted([]);
            fs.writeFileSync(path.join(this.path, "database.svps"), result);
            this.file = path.join(this.path, "database.svps");
            return [];
        } catch (e) {
            this.showErrorMessage(
                "Не удалось создать файл повторите еще раз или обратитесь к разработчику"
            );
            this.password = null;
            return false;
        }
    }
    // получить данные из файл
    getFileData() {
        try {
            const data = fs.readFileSync(this.file, "utf-8");
            const result = this.decrypted(data);
            return {
                result: result,
                lastPathFile: this.file,
            };
        } catch (e) {
            this.showErrorMessage("Не удалось прочитать файл");
            this.win.webContents.send("GO_OVER_PAGE", {
                page: "/",
            });
            return false;
        }
    }
    // общее обновление файла
    updateFile(data) {
        try {
            const result = this.encrypted(data);
            fs.writeFileSync(this.file, result);
            return true;
        } catch (e) {
            this.showErrorMessage(
                "Не удалось обновить файл повторите еще раз или обратитесь к разработчику"
            );
            return false;
        }
    }
    // добавить данные файл
    addDataFile(item) {
        try {
            const obj = this.getFileData();
            const dataArray = obj.result;
            dataArray.push(item);
            this.updateFile(dataArray);
            return true;
        } catch (e) {
            this.showErrorMessage(
                " Не удалось обновить файл повторите еще раз или обратитесь к разработчику"
            );
            return false;
        }
    }
    // добавить данные в файл
    updateDataFile(item) {
        try {
            const obj = this.getFileData();
            const newDataArray = obj.result.map((data) => {
                if (Number(data.id) === Number(item.id)) {
                    return item;
                }
                return data;
            });
            this.updateFile(newDataArray);
            return true;
        } catch (e) {
            this.showErrorMessage(
                " Не удалось обновить файл повторите еще раз или обратитесь к разработчику"
            );
            return false;
        }
    }
    // удалить данные в файле
    deleteDataFile(obj) {
        try {
            const result = this.showMessageWindow(
                `Действительно удалить запись ${obj.title} ?`
            );
            if (result) {
                const obj = this.getFileData();
                const newDataArray = obj.result.filter((data) => {
                    if (Number(data.id) === Number(obj.id)) {
                        return true;
                    }
                    return false;
                });
                this.updateFile(newDataArray);
                return true;
            }
            return false;
        } catch (e) {
            this.showErrorMessage(
                " Не удалось обновить файл повторите еще раз или обратитесь к разработчику"
            );
            return false;
        }
    }
    // указать путь к файлу
    openDataFile(defaultPath) {
        var url = dialog.showOpenDialogSync(this.win, {
            title: "Выберите файл",
            defaultPath: defaultPath || app.getPath("desktop"),
            properties: ["openFile"],
            buttonLabel: "Открыть",
            filters: [{ name: "All Files", extensions: ["svps"] }],
        });
        if (url) {
            this.file = url[0];
            return true;
        }
        this.file = null;
        return false;
    }
    // проверка пароля для файла
    checkedPasswordFile(password) {
        this.password = password;
        return this.getFileData();
    }
    // закрыть файл
    closeFile() {
        this.path = null;
        this.password = null;
        this.file = null;
        return true;
    }
    encrypted(data) {
        const body = JSON.stringify(data);
        return CryptoJS.AES.encrypt(body, this.password).toString();
    }
    decrypted(data) {
        try {
            const body = CryptoJS.AES.decrypt(data, this.password).toString(
                CryptoJS.enc.Utf8
            );
            if (body) {
                return JSON.parse(body);
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}
