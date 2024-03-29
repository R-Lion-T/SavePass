import { contextBridge, ipcRenderer } from "electron";
import zxcvbn from "zxcvbn";

const pass = [
    "123456",
    "123456789",
    "12345",
    "qwer",
    "qwerty",
    "Пароль",
    "12345678",
    "111111",
    "123123",
    "1234567890",
    "1234567",
    "qwerty123",
    "000000",
    "1q2w3e",
    "aa12345678",
    "abc123",
    "пароль 1",
    "1234",
    "qwertyuiop",
    "123321",
    "пароль 123",
    "1q2w3e4r5t",
    "иловейю",
    "654321",
    "666666",
    "987654321",
    "123",
    "123456a",
    "qwe123",
    "1q2w3e4r",
    "7777777",
    "1qaz2wsx",
    "123qwe",
    "zxcvbnm",
    "121212",
    "asdasd",
    "a123456",
    "555555",
    "dragon",
    "112233",
    "123123123",
    "monkey",
    "11111111",
    "qazwsx",
    "159753",
    "asdfghjkl",
    "222222",
    "1234qwer",
    "qwerty1",
    "123654",
    "123abc",
    "asdfgh",
    "777777",
    "aaaaaa",
    "myspace1",
    "88888888",
    "fuckyou",
    "123456789a",
    "999999",
    "888888",
    "football",
    "princess",
    "789456123",
    "147258369",
    "1111111",
    "sunshine",
    "michael",
    "computer",
    "qwer1234",
    "daniel",
    "789456",
    "11111",
    "abcd1234",
    "q1w2e3r4",
    "shadow",
    "159357",
    "123456q",
    "1111",
    "samsung",
    "killer",
    "asd123",
    "superman",
    "master",
    "12345a",
    "azerty",
    "zxcvbn",
    "qazwsxedc",
    "131313",
    "ashley",
    "target123",
    "987654",
    "baseball",
    "qwert",
    "asdasd123",
    "qwerty",
    "soccer",
    "charlie",
    "qweasdzxc",
    "tinkle",
    "jessica",
    "q1w2e3r4t5",
    "asdf",
    "test1",
    "1g2w3e4r",
    "gwerty123",
    "zag12wsx",
    "gwerty",
    "147258",
    "12341234",
    "qweqwe",
    "jordan",
    "pokemon",
    "q1w2e3r4t5y6",
    "12345678910",
    "1111111111",
    "12344321",
    "thomas",
    "love",
    "12qwaszx",
    "102030",
    "welcome",
    "liverpool",
    "iloveyou1",
    "michelle",
    "101010",
    "1234561",
    "hello",
    "andrew",
    "a123456789",
    "a12345",
    "Status",
    "fuckyou1",
    "1qaz2wsx3edc",
    "hunter",
    "princess1",
    "naruto",
    "justin",
    "jennifer",
    "qwerty12",
    "qweasd",
    "anthony",
    "andrea",
    "joshua",
    "asdf1234",
    "12345qwert",
    "1qazxsw2",
    "marina",
    "love123",
    "111222",
    "robert",
    "10203",
    "nicole",
    "letmein",
    "football1",
    "secret",
    "1234554321",
    "freedom",
    "michael1",
    "11223344",
    "qqqqqq",
    "123654789",
    "chocolate",
    "12345q",
    "internet",
    "q1w2e3",
    "google",
    "starwars",
    "mynoob",
    "qwertyui",
    "55555",
    "qwertyu",
    "lol123",
    "lovely",
    "monkey1",
    "nikita",
    "pakistan",
    "7758521",
    "87654321",
    "147852",
    "jordan23",
    "212121",
    "123789",
    "147852369",
    "123456789q",
    "qwe",
    "forever",
    "741852963",
    "123qweasd",
    "123456abc",
    "1q2w3e4r5t6y",
    "qazxsw",
    "456789",
    "232323",
    "999999999",
    "qwerty12345",
    "qwaszx",
    "1234567891",
    "456123",
    "444444",
    "qq123456",
    "xxx",
];
class PasswordRandom {
    constructor({ length, lower, upper, number, symbol }) {
        this.length = Number(length) || 10;
        this.lower = lower || false;
        this.upper = upper || false;
        this.number = number || false;
        this.symbol = symbol || false;
        this.randomFun = {
            upper: this.getRandomUpper,
            lower: this.getRandomLower,
            number: this.getRandomNumber,
            symbol: this.getRandomSymbol,
        };
    }
    getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    getRandomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }
    getRandomSymbol() {
        const symbol = "!@#$%&*/";
        return symbol[Math.floor(Math.random() * symbol.length)];
    }
    getPassword() {
        let value = "";
        const typesCount = this.upper + this.lower + this.number + this.symbol;
        const typesArr = [
            { upper: this.upper },
            { lower: this.lower },
            { number: this.number },
            { symbol: this.symbol },
        ].filter((item) => Object.values(item)[0]);
        if (!typesCount) {
            return false;
        }
        for (let i = 0; i < this.length; i += typesCount) {
            typesArr.forEach((type) => {
                const funName = Object.keys(type)[0];
                value += this.randomFun[funName]();
            });
        }
        if (pass.findIndex((item) => item === value) === -1) {
            value = value.slice(0, this.length);
            value = value.match(/.{1,3}/g);
            return value.join("-");
        } else {
            return this.getPassword();
        }
    }
}



contextBridge.exposeInMainWorld("app", {
    getVersionApp: () => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("GET_VERSION_APP").then((props) => {
                resolve(props);
            });
        });
    },
    onCopy: (text)=>{
        return new Promise((res)=>{
            ipcRenderer.invoke("COPY_TEXT",text).then(data=>{
                res(data)
            })
        })
    },
    openHref: (props)=>ipcRenderer.send("OPEN_HREF",props),
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
    createFile: (data) => {
        return new Promise((resolve) => {
            ipcRenderer.invoke("CREATE_FILE", data).then((props) => {
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
    closeGenerate: () => {
        ipcRenderer.send("CLOSE_GENERATE");
    },
    openGenerate: (isInput = false) => {
        ipcRenderer.send("OPEN_GENERATE",{isInput});
    },
});

contextBridge.exposeInMainWorld("password", {
    getRandomPassword: (data) => {
        return new PasswordRandom(data).getPassword();
    },
    passwordCheck: (password) => {
        if (!password.length) return "";
        const result = zxcvbn(password, pass);
        return result.score;
    },
    setItem: (obj) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke("SET_PASSWORD", obj).then((props) => {
                if (props) {
                    resolve(props);
                } else {
                    reject(props);
                }
            });
        });
    },
    updateFile: (obj) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.invoke("DELETE_PASSWORD", obj).then((props) => {
                if (props) {
                    resolve(props);
                } else {
                    reject(props);
                }
            });
        });
    },
    submitPasswordMainProccess: (obj) => {
        return new Promise((resolve,reject) => {
            ipcRenderer
                .invoke("ACCEPT_THE_PASSWORD", obj)
                .then(result=>{
                    if(result){
                        resolve(result)
                    }else{
                        reject(result)
                    }
                });
        });
    },
    isUnique :({password="", list=[], id=null})=>{
        return Boolean(list.filter(item=>{
             return password && Number(item?.id)!==Number(id) && item?.password===password
        }).length)
    }
});

ipcRenderer.on("SET_PASSOWORD_INPUT", (_, data) => {
    window.dispatchEvent(
        new CustomEvent("setpasswordinput", {
            detail: data,
        })
    );
});

ipcRenderer.on("GO_OVER_PAGE", (_, data) => {
    window.dispatchEvent(
        new CustomEvent("goOverPage", {
            detail: data,
        })
    );
});

ipcRenderer.on("APP_RESIZE_WINDOW_ACCESS", (_, data) => {
    window.dispatchEvent(
        new CustomEvent("MAIN_RESIZE", {
            detail: data,
        })
    );
});

ipcRenderer.on("console.log", (_, data) => {
    window.dispatchEvent(
        new CustomEvent("console.log", {
            detail: data,
        })
    );
});

ipcRenderer.on("GENERATE_SET_SETTINGS",(_,props)=>{
    window.dispatchEvent(
        new CustomEvent("generateSetSettings", {
            detail: props,
        })
    );
});

