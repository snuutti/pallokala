import semver from "semver";

export async function getPanelVersion(baseUrl: string): Promise<string | null> {
    const response = await fetch(`${baseUrl}/api/config`);
    return response.headers.get("X-Api-Version");
}

export async function isUnsupportedVersion(baseUrl: string): Promise<boolean> {
    if (baseUrl === "http://pallokala.test") {
        return false;
    }

    const version = await getPanelVersion(baseUrl);
    return version === null;
}

export function isVersionSatisfied(version: string, requiredVersion: string): boolean {
    try {
        const [major] = version.split(".");
        if (parseInt(major, 10) === 0) {
            return true;
        }

        if (!semver.valid(version)) {
            console.error("Invalid server version string provided to useVersionCheck.", version);
            return false;
        }

        if (!semver.valid(requiredVersion)) {
            console.error("Invalid required version string provided to useVersionCheck.", requiredVersion);
            return false;
        }

        return semver.gte(version, requiredVersion);
    } catch (e) {
        console.error("Feature version check failed.", e);
    }

    return false;
}