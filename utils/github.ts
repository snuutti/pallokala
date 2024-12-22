export type Release = {
    tag_name: string;
    prerelease: boolean;
    published_at: string;
    body: string;
};

export async function getReleaseHistory(): Promise<Release[]> {
    const response = await fetch("https://api.github.com/repos/snuutti/pallokala/releases");
    return await response.json();
}