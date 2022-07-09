export const ac_load_data = (state) => ({
    type: "LOAD_DATA",
    payload: { state },
});
export const ac_add_data = (item) => ({ type: "ADD_DATA", payload: { item } });
export const ac_update_data = (item) => ({
    type: "UPDATE_DATA",
    payload: { item },
});
export const ac_delete_data = (id) => ({
    type: "DELETE_DATA",
    payload: { id },
});
export const ac_logout = (id) => ({ type: "LOGOUT" });
