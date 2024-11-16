import { SessionStore } from "pufferpanel";

class UnifiedSessionStore implements SessionStore {
    private token: string | null = null;
    private sessionCookie: string | null = null;
    private authCookie: string | null = null;
    private scopes: string[] | null = null;

    setToken(token: string) {
        this.token = token;
    }

    setSessionCookie(sessionCookie: string) {
        this.sessionCookie = sessionCookie;
    }

    setAuthCookie(authCookie: string) {
        this.authCookie = authCookie;
    }

    setScopes(scopes: string[]) {
        this.scopes = scopes;
    }

    getToken() {
        return this.token;
    }

    getSessionCookie() {
        return this.sessionCookie;
    }

    getAuthCookie() {
        return this.authCookie;
    }

    getScopes() {
        return this.scopes;
    }

    isLoggedIn() {
        return this.token !== null || this.authCookie !== null;
    }

    deleteSession(): void {
        this.token = null;
        this.sessionCookie = null;
        this.authCookie = null;
        this.scopes = null;
    }

}

export default UnifiedSessionStore;