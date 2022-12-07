import { autoUpdater } from "electron-updater";
import {dialog} from "electron";
// логи
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level ="info";

autoUpdater.autoDownload = false; // отключаю автомтическое обновлениe;

export const checkForUpdates = (win)=>{
    // Проверить наличие обновление
    autoUpdater.checkForUpdates();
    // Обнволение нашлось
    autoUpdater.on("update-available",()=>{
        dialog.showMessageBox(win,{
            type:"info",
            title:"SavePass",
            message:"Доступно новое обновление для SavePass. Начать скачивание?",
            buttons:["Да","Нет"],
            noLink:true,
        }).then(({response})=>{
            if(response==0){
                autoUpdater.downloadUpdate()
            }
        })
    });
    // Уставнока обновления
    autoUpdater.on("update-downloaded",()=>{
        dialog.showMessageBox(win,{
            type:"info",
            title:"SavePass",
            message:"Обнволение загруженно, установить сейчас?",
            noLink:true,
            buttons:["Установить","Позже"]
        }).then(({response})=>{
            if(response==0){
                autoUpdater.quitAndInstall()
            }
        })
    });
    // Ошибка во время обновления
    autoUpdater.on("error",()=>{
        dialog.showMessageBox(win,{
            type:"error",
            title:"Ошибка в SavePass",
            message:"Во время обновление произошла ошибка!",
        })
    });
}