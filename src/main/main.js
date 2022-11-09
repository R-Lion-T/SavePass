import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    screen,
    Tray,
    Menu,
} from "electron";
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
        this.tray = null;
        this.isGenerate = false;
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
            backgroundColor: "#232931",
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
        this.win.on("close", (event) => {
            const count = BrowserWindow.getAllWindows().length - 1;
            if (count) {
                event.preventDefault();
                this.win.hide();
            }
        });
        this.win.on("closed", () => {
            this.win = null;
        });

        this.win.webContents.on("did-finish-load", () => {
            const file = process.argv[1];
            if (file && this.checkFileExistsSync(file) && isDev == false) {
                this.file = file;
                this.win.webContents.send("GO_OVER_PAGE",{
                    page:"/checkedPassword"
                });
            }
            this.win.show();
        });

        this.win.webContents.on("context-menu", (e, params) => {
            this.createContextMenu(params);
        });

        ipcMain.on("APP_HIDE", () => this.win.minimize());

        ipcMain.on("APP_EXIT", () => this.win.close());

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
        ipcMain.handle("LOGOUT", () => this.closeFile());
        // generate
        ipcMain.on("CLOSE_GENERATE", () => {
            if (this.isGenerate) {
                this.isGenerate.close();
                this.isGenerate = false;
            }
        });
        ipcMain.on("OPEN_GENERATE", (event, props) => {
            if (this.isGenerate) {
                this.isGenerate.focus();
            } else {
                this.openModalGenerate(event, props);
            }
        });
    }

    // create tray
    createTray() {
        const menu = [
            {
                label: "Генератор",
                type: "normal",
                click: () => {
                    if (!this.isGenerate) {
                        this.openModalGenerate();
                    }
                },
            },
            { type: "separator" },
            {
                label: "Закрыть",
                type: "normal",
                click: () => {
                    app.exit();
                },
            },
        ];
        this.tray = new Tray("resources/icon.ico");
        this.tray.setToolTip(CONFIG.title);
        this.tray.on("click", () => {
            if (!this.win.isVisible()) {
                this.win.show();
            } else if (this.win.isMinimized()) {
                this.win.show();
            } else if (this.win.isVisible()) {
                this.win.minimize();
            }
        });
        this.tray.setContextMenu(Menu.buildFromTemplate(menu));
    }
    // create context menu
    createContextMenu({ x, y }) {
        const template = [
            {
                label: "Скопировать",
                role: "copy",
            },
            {
                label: "Вырезать",
                role: "cut",
            },
            {
                label: "Вставить",
                role: "paste",
            },
            {
                type:"separator"
            },
            {
                label: "Выход",
                role: "close"
            },
        ];
        const menu = new Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        menu.popup(this.win, x, y);
    }

    subscribeForAppEvents() {
        app.whenReady().then(() => {
            this.createWindow();
            this.createTray();
        });

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
            if (!this.checkFileExistsSync(path.join(url[0], "database.svps"))) {
                console.log("Файла нет");
                this.path = url[0];
                return true;
            } else {
                this.showErrorMessage(
                    `Файл уже существует в этой директории ${url[0]}`
                );
            }
        }
        this.path = null;
        return false;
    }
    //
    checkFileExistsSync(filepath) {
        if (!filepath) return null;
        let flag = true;
        try {
            fs.accessSync(filepath, fs.constants.F_OK);
        } catch (e) {
            flag = false;
        }
        return flag;
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
    // добавить данные в файл
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
    // обновить данные в файле
    updateDataFile(update) {
        try {
            const obj = this.getFileData();
            const newDataArray = obj.result.map((item) => {
                if (Number(item.id) === Number(update.id)) {
                    return {
                        ...item,
                        ...update
                    };
                }
                return item;
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
                const fileData = this.getFileData();
                const newDataArray = fileData.result.filter((data) => {
                    if (Number(data.id) === Number(obj.id)) {
                        return false;
                    }
                    return true;
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

    openModalGenerate(event, props) {
        this.isGenerate = new WinGenerate(this.win, event, props);
    }
}

class WinGenerate {
    constructor(main, event, props) {
        this.win = null;
        this.main = main;
        this.event = event;
        this.props = props;
        this.subscribeForAppEvents();
    }
    createWindow() {
        this.win = new BrowserWindow({
            width: 400,
            height: 436,
            titleBarStyle: "hidden",
            show: false,
            center: true,
            parent: this.props?.isInput ? this.main : null,
            modal: this.props?.isInput ? true : false,
            resizable: false,
            webPreferences: {
                devTools: CONFIG.devTools,
                worldSafeExecuteJavaScript: true,
                preload: path.join(app.getAppPath(), "preload", "index.js"),
            },
        });

        // context menu
        const template = [
            {
                label: "Скопировать",
                role: "copy",
            },
            {
                type:"separator"
            },
            {
                label: "Выход",
                role: "close"
            },
        ];
        const menu = new Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        this.win.webContents.on("context-menu",(event,params)=>{
            menu.popup(this.win, params.x, params.y);
        });

        // remove menu window
        this.win.removeMenu();

        this.win.loadFile("renderer/generate.html");

        this.win.webContents.openDevTools({
            mode: "detach",
        });

        this.win.webContents.on("did-finish-load", () => {
            if (this.props) {
                this.win.webContents.send("GENERATE_SET_SETTINGS", this.props);
            }
            this.win.show();
        });

        ipcMain.handle("ACCEPT_THE_PASSWORD", (_, obj) => {
            if (this.event) {
                this.event.sender.send("SET_PASSOWORD_INPUT", obj);
                return true;
            }
            return false;
        });

        this.win.on("closed", () => {
            this.win = null;
            ipcMain.removeHandler("ACCEPT_THE_PASSWORD");
        });
    }

    subscribeForAppEvents() {
        this.createWindow();
    }
    close() {
        this.win.close();
    }
    focus() {
        if (!this.win.isFocused()) {
            this.win.focus();
        }
    }
}
