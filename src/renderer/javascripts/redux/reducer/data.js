const initialState = {
    auth: false,
    list: [],
};
// [
//     {
//         id: 1,
//         title: "Вконтакте",
//         href: "",
//         login: "Ivanow@mail.ru",
//         password: "2867849",
//     },
//     {
//         id: 2,
//         title: "Вконтакте",
//         href: "http://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 3,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 4,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 5,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 6,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 7,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 8,
//         title: "Вконтакте2",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 9,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
//     {
//         id: 10,
//         title: "Вконтакте",
//         href: "https://vk.com/",
//         login: "Ivanow@mail.ru",
//         password: "123456789",
//     },
// ]
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
        default: {
            return state;
        }
    }
};
