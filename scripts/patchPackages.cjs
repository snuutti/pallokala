const path = require("path");
const fs = require("fs");

function patchPackageJson() {
    const packageJsonPath = path.resolve(__dirname, "../node_modules/pufferpanel/package.json");

    const data = fs.readFileSync(packageJsonPath, "utf8");
    const json = JSON.parse(data);

    if (json.patched) {
        console.log("patchPackages.cjs - package.json already patched.");
        return;
    }

    json.main = "src/index.js";

    json.files = [
        "src/**/*"
    ];

    json.patched = true;

    fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2), "utf8");

    console.log("patchPackages.cjs - package.json patched!");
}

function patchSessionStoreJs() {
    const sessionStorePath = path.resolve(__dirname, "../node_modules/pufferpanel/src/sessionStore.js");

    const lines = fs.readFileSync(sessionStorePath, "utf8").split("\n");
    if (lines[0] === "//patched") {
        console.log("patchPackages.cjs - sessionStore.js already patched.");
        return;
    }

    const secureIndex = lines.findIndex(line => line.startsWith("  secure: typeof window"));
    if (secureIndex !== -1) {
        lines[secureIndex] = "  secure: true,";
    }

    lines.unshift("//patched");
    fs.writeFileSync(sessionStorePath, lines.join("\n"), "utf8");

    console.log("patchPackages.cjs - sessionStore.js patched!");
}

function patchServersJs() {
    const serversPath = path.resolve(__dirname, "../node_modules/pufferpanel/src/servers.js");

    const lines = fs.readFileSync(serversPath, "utf8").split("\n");
    if (lines[0] === "//patched") {
        console.log("patchPackages.cjs - servers.js already patched.");
        return;
    }

    const socketIndex = lines.findIndex(line => line.startsWith("    this._socket = new WebSocket"));
    if (socketIndex !== -1) {
        lines[socketIndex] = "    this._socket = new WebSocket(`${protocol}://${host}/api/servers/${this.id}/socket`, null, { headers: { \"Authorization\": \"Bearer \" + this._api.auth.getToken() } })";
    }

    lines.unshift("//patched");
    fs.writeFileSync(serversPath, lines.join("\n"), "utf8");

    console.log("patchPackages.cjs - servers.js patched!");
}

patchPackageJson();
patchSessionStoreJs();
patchServersJs();