import { ac_add_alert, ac_hide_alert } from "./../actions/ac_alert";
const initialState = [];
export const dis_alert = (state = initialState, action) => {
    switch (action.type) {
        case "PUSH_ALERT": {
            return [...state, action.payload.alert];
        }
        case "HIDE_ALERT": {
            return state.filter((item) => item.id !== action.payload.alert.id);
        }
        default: {
            return state;
        }
    }
};
export const dis_add_alert = (props) => (dispatch) => {
    dispatch(ac_add_alert(props));
    setTimeout(() => {
        dispatch(ac_hide_alert(props));
    }, 2000);
};
