const initialState = {
    auth: false,
    is_load:false,
    list: [],
};
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
