import { combineReducers } from "redux";
import { dis_data } from "./data";
import { dis_alert } from "./alert";

const rootReducer = combineReducers({
    data: dis_data,
    alert: dis_alert,
});

export default rootReducer;
