export async function getPanelVersion(baseUrl: string): Promise<string | null> {
    const response = await fetch(`${baseUrl}/api/config`);
    return response.headers.get("X-Api-Version");
}

export async function isUnsupportedVersion(baseUrl: string): Promise<boolean> {
    const version = await getPanelVersion(baseUrl);
    return version === null;
}