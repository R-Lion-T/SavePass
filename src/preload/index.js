import { clipboard, contextBridge, ipcRenderer, shell } from "electron";

contextBridge.exposeInMainWorld("app", {
    getVersionApp: () => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("GET_VERSION_APP").then((props) => {
                resolve(props);
            });
        });
    },
    onCopy: clipboard.writeText,
    openHref: shell.openExternal,
    hide: () => ipcRenderer.send("APP_HIDE"),
    exit: () => ipcRenderer.send("APP_EXIT"),
    resize: () => ipcRenderer.send("APP_RESIZE_WINDOW"),
    logout: () => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("LOGOUT").then((props) => {
                resolve(props);
            });
        });
    },
    getStatusWindow: () => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("GET_STATUS_WINDOW").then((props) => {
                resolve(props);
            });
        });
    },

    showMessageWindow: (message) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("SHOW_ERROR_WINDOW", message).then((props) => {
                resolve(props);
            });
        });
    },
    createPathFile: () => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("CREATE_PATH_FILE").then((props) => {
                resolve(props);
            });
        });
    },
    createFile: (password) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("CREATE_FILE", password).then((props) => {
                resolve(props);
            });
        });
    },
    updateDataFile: (item) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("UPDATE_DATA_FILE", item).then((props) => {
                resolve(props);
            });
        });
    },
    addDataFile: (item) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("ADD_DATA_FILE", item).then((props) => {
                resolve(props);
            });
        });
    },
    deleteDataFile: (obj) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("DELETE_DATA_FILE", obj).then((props) => {
                resolve(props);
            });
        });
    },
    openDataFile: (lastPathFile) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("OPEN_DATA_FILE", lastPathFile).then((props) => {
                resolve(props);
            });
        });
    },
    checketPassword: (password) => {
        return new Promise((resolve) => {
            ipcRenderer
                .invoke("CHECKED_PASSWORD_FILE", password)
                .then((props) => {
                    resolve(props);
                });
        });
    },
});
ipcRenderer.on("GO_OVER_PAGE", (_, data) => {
    window.dispatchEvent(
        new CustomEvent("goOverPage", {
            detail: data,
        })
    );
});
ipcRenderer.on("OPEN_PAGE_CHECKED_PASSWORD", (_, data) => {
    window.dispatchEvent(new CustomEvent("openPageCheckedPassword",
    {
        detail: data,
    }));
});

ipcRenderer.on("APP_RESIZE_WINDOW_ACCESS", () => {
    window.dispatchEvent(
        new CustomEvent("MAIN_RESIZE")
    );
});

ipcRenderer.on("console.log", (_, data) => {
    window.dispatchEvent(
        new CustomEvent("console.log", {
            detail: data,
        })
    );
});