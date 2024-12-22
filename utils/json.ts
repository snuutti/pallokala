export const getPrivateInfoReplacer = () => {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if (key === "password") {
            return "[password]";
        }

        if (key === "clientSecret") {
            return "[clientSecret]";
        }

        if (key === "otpSecret") {
            return "[otpSecret]";
        }

        if (typeof value === "string") {
            try {
                const json = JSON.parse(value);
                if (typeof json === "object" && json !== null) {
                    const keys = Object.keys(json);
                    if (keys.indexOf("password") !== -1) {
                        json.password = "[password]";
                    }

                    if (keys.indexOf("clientSecret") !== -1) {
                        json.clientSecret = "[clientSecret]";
                    }

                    if (keys.indexOf("otpSecret") !== -1) {
                        json.otpSecret = "[otpSecret]";
                    }

                    return JSON.stringify(json);
                } else {
                    return value;
                }
            } catch {
                return value;
            }
        }

        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }

            seen.add(value);
        }

        return value;
    };
};