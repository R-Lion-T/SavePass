import React from "react";

const RowPassword = React.memo(function RowPassword({ password, setPassword }) {
    React.useEffect(() => {
        function keydown(event) {
            const key = event.keyCode;
            if (
                (key >= 65 && key <= 90) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105) ||
                key === 8
            ) {
                if (key == 8) {
                    setPassword(password.slice(0, -1));
                    this.removeEventListener("keydown", keydown);
                } else if (password.length !== 5) {
                    setPassword([...password, event.key]);
                    this.removeEventListener("keydown", keydown);
                }
            }
        }
        document.addEventListener("keydown", keydown);
        return () => {
            document.removeEventListener("keydown", keydown);
        };
    }, [password]);

    const max = 5;
    const min = max - password.length;
    const array = [];
    for (let i = 0; i < password.length; i++) {
        array.push("*");
    }
    for (let i = 0; i < min; i++) {
        array.push(null);
    }
    return (
        <div className="rowPassord">
            {array.map((item, index) => {
                return (
                    <div
                        className={`rowPassord_item ${
                            password.length === index
                                ? "focus"
                                : item != null
                                ? "active"
                                : ""
                        }`}
                        key={index}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
});

export default RowPassword;
