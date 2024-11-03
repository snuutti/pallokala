import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "@/constants/resources";

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: "en_US",
        compatibilityJSON: "v3",
        resources,
        ns: ["common", "env", "errors", "files", "hotkeys", "nodes", "oauth", "operators", "scopes", "servers", "settings", "templates", "users"],
        defaultNS: "common",
        interpolation: {
            escapeValue: false,
            prefix: "{",
            suffix: "}"
        }
    });