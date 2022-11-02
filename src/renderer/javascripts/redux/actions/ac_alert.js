export const ac_add_alert = (alert) => ({
    type: "PUSH_ALERT",
    payload: { alert },
});
export const ac_hide_alert = (alert) => ({
    type: "HIDE_ALERT",
    payload: { alert },
});

export const ac_show_load = () => ({
    type: "SHOW_LOAD",
});
export const ac_hide_load = () => ({
    type: "HIDE_LOAD",
});
