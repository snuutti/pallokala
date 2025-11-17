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

function patchClientJs() {
    const clientPath = path.resolve(__dirname, "../node_modules/pufferpanel/src/client.js");

    const lines = fs.readFileSync(clientPath, "utf8").split("\n");
    if (lines[0] === "//patched") {
        console.log("patchPackages.cjs - client.js already patched.");
        return;
    }

    const headersIndex = lines.findIndex(line => line.startsWith("    return headers"));
    if (headersIndex !== -1) {
        lines[headersIndex] = "    if ('getAuthCookie' in this.auth._sessionStore) {\n" +
            "      const sessionCookie = this.auth._sessionStore.getSessionCookie()\n" +
            "      const authCookie = this.auth._sessionStore.getAuthCookie()\n" +
            "      return {\n" +
            "        ...headers,\n" +
            "        Cookie: `session=${sessionCookie || ''}; puffer_auth=${authCookie || ''}`\n" +
            "      }\n" +
            "    }\n" +
            "    return headers";
    }

    lines.unshift("//patched");
    fs.writeFileSync(clientPath, lines.join("\n"), "utf8");

    console.log("patchPackages.cjs - client.js patched!");
}

function patchAuthJs() {
    const authPath = path.resolve(__dirname, "../node_modules/pufferpanel/src/auth.js");

    const lines = fs.readFileSync(authPath, "utf8").split("\n");
    if (lines[0] === "//patched") {
        console.log("patchPackages.cjs - auth.js already patched.");
        return;
    }

    const loginIndex = lines.findIndex(line => line.startsWith("    const res = await this._api.post('/auth/login', { email, password })"));
    if (loginIndex !== -1) {
        lines[loginIndex] = "    const res = await this._api.post('/auth/login', { email, password })\n" +
            "    const cookies = res.headers['set-cookie'][0]\n" +
            "    if (res.data.needsSecondFactor || res.data.otpNeeded) {\n" +
            "      const session = cookies.split('session=')[1].split(';')[0]\n" +
            "      this._sessionStore.setSessionCookie(session)\n" +
            "      if (res.data.otpNeeded) {\n" +
            "        return { needsSecondFactor: true, otpEnabled: true }\n" +
            "      }\n" +
            "    } else {\n" +
            "      const pufferAuth = cookies.split('puffer_auth=')[1].split(';')[0]\n" +
            "      this._sessionStore.setAuthCookie(pufferAuth)\n" +
            "    }";
    }

    const loginOtpIndex = lines.findIndex(line => line.startsWith("    const res = await this._api.post('/auth/otp', { token })"));
    if (loginOtpIndex !== -1) {
        lines[loginOtpIndex] = "    const res = await this._api.post('/auth/otp', { token })\n" +
            "    const cookies = res.headers['set-cookie'][0]\n" +
            "    const pufferAuth = cookies.split('puffer_auth=')[1].split(';')[0]\n" +
            "    this._sessionStore.setAuthCookie(pufferAuth)";
    }

    const reauthIndex = lines.findIndex(line => line.startsWith("    if (is2xx(res.status)) {"));
    if (reauthIndex !== -1) {
        lines[reauthIndex] = "    if (is2xx(res.status)) {\n" +
            "      const cookies = res.headers['set-cookie'][0]\n" +
            "      const pufferAuth = cookies.split('puffer_auth=')[1].split(';')[0]\n" +
            "      this._sessionStore.setAuthCookie(pufferAuth)";
    }

    lines.unshift("//patched");
    fs.writeFileSync(authPath, lines.join("\n"), "utf8");

    console.log("patchPackages.cjs - auth.js patched!");
}

function patchServersJs() {
    const serversPath = path.resolve(__dirname, "../node_modules/pufferpanel/src/servers.js");

    const lines = fs.readFileSync(serversPath, "utf8").split("\n");
    if (lines[0] === "//patched") {
        console.log("patchPackages.cjs - servers.js already patched.");
        return;
    }

    const expoCryptoIndex = lines.findIndex(line => line.startsWith("import * as Crypto from 'expo-crypto'"));
    if (expoCryptoIndex === -1) {
        lines.unshift("import * as Crypto from 'expo-crypto'");
    }

    const cryptoIndex = lines.findIndex(line => line.startsWith("    const c = (crypto || {}).getRandomValues ? crypto : ((crypto || {}).webcrypto || {}).getRandomValues ? crypto.webcrypto.getRandomValues : undefined"));
    if (cryptoIndex !== -1) {
        lines[cryptoIndex] = "    const c = Crypto";
    }

    const socketIndex = lines.findIndex(line => line.startsWith("    this._socket = new WebSocket"));
    if (socketIndex !== -1) {
        lines[socketIndex] = "    this._socket = new WebSocket(`${protocol}://${host}/api/servers/${this.id}/socket`, null, { headers: this._api._enhanceHeaders({}) })";
    }

    const dataIndex = lines.findIndex(line => line.startsWith("    const data = new FormData()"));
    if (dataIndex !== -1) {
        lines[dataIndex] = "    const data = new RNBlob([blob])";
    }

    const dataAppendIndex = lines.findIndex(line => line.startsWith("    data.append('file', blob)"));
    if (dataAppendIndex !== -1) {
        lines.splice(dataAppendIndex, 1);
    }

    lines.push("class RNBlob extends Blob {\n" +
        "  get [Symbol.toStringTag]() {\n" +
        "    return 'Blob'\n" +
        "  }\n" +
        "}");

    lines.unshift("//patched");
    fs.writeFileSync(serversPath, lines.join("\n"), "utf8");

    console.log("patchPackages.cjs - servers.js patched!");
}

patchPackageJson();
patchSessionStoreJs();
patchClientJs();
patchAuthJs();
patchServersJs();