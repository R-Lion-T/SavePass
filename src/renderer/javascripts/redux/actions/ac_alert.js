export const ac_add_alert = (alert) => ({
    type: "PUSH_ALERT",
    payload: { alert },
});
export const ac_hide_alert = (alert) => ({
    type: "HIDE_ALERT",
    payload: { alert },
});
