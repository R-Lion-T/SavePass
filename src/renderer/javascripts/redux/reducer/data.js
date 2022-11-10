const initialState = {
    auth: false,
    is_load:false,
    list: [],
};
const developerState = {
    auth: true,
    is_load:false,
    list: [
        {
            "id": 1667871174503,
            "title": "Mail",
            "login": "test@mail.ru",
            "href": "https://mail.ru/",
            "password": "Lm4-$Fb-3!E-b",
            "comment": "",
            "created": 1667871174503,
            "lastChange": 1667871174503
        },
        {
            "id": 1667871245212,
            "title": "Avito",
            "login": "avito@mail.ru",
            "href": "https://www.avito.ru/",
            "password": "Sz1-*Eb-6&V-g",
            "comment": "",
            "created": 1667871245212,
            "lastChange": 1667871245212
        },
        {
            "id": "1667955892035",
            "title": "Udemy",
            "login": "udemy@gmail.com",
            "href": "https://www.udemy.com/",
            "password": "Dl1-*Qs-6#I",
            "comment": "Школа програмирование",
            "lastChange": 1667955928348
        },
        {
            "id": "1667956128158",
            "title": "Из рук в руки",
            "login": "irr@list.ru",
            "href": "https://irr.ru",
            "password": "Ek0-*Vn-6%U-u",
            "comment": "Площядка для продаж",
            "lastChange": 1667961618448
        },
        {
            "id": 1668030394840,
            "title": "Вконтакте",
            "login": "vk@list.ru",
            "password": "Hg6-@Di-1$C-u",
            "href": "https://vk.com/",
            "comment": "Моя соновая страница",
            "created": 1668030394840,
            "lastChange": 1668030394840
        },
        {
            "id": 1668030591940,
            "title": "YouTube",
            "login": "youtube@gmail.com",
            "password": "Ve1-%Be-8@U-j",
            "href": "https://www.youtube.com/",
            "comment": "Моя учетная запись на YouTybe канал",
            "created": 1668030591940,
            "lastChange": 1668030591940
        }
    ],
}
export const dis_data = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_DATA": {
            return {
                ...state,
                auth: true,
                list: [...action.payload.state],
            };
        }
        case "ADD_DATA": {
            return {
                ...state,
                list: [...state.list, action.payload.item],
            };
        }
        case "UPDATE_DATA": {
            return {
                ...state,
                list: state.list.map((item) => {
                    if (Number(item.id) === Number(action.payload.item.id)) {
                        return action.payload.item;
                    }
                    return item;
                }),
            };
        }
        case "DELETE_DATA": {
            return {
                ...state,
                list: state.list.filter(
                    (item) => Number(item.id) !== Number(action.payload.id)
                ),
            };
        }
        case "LOGOUT": {
            return {
                ...state,
                auth: false,
                list: [],
            };
        }
        case "SHOW_LOAD": {
            return {
                ...state,
                is_load:true
            };
        }
        case "HIDE_LOAD": {
            return {
                ...state,
                is_load:false
            };
        }
        default: {
            return state;
        }
    }
};
