// Copied from https://github.com/pufferpanel/pufferpanel/blob/v3/client/frontend/src/utils/colors.js

export function hex2rgba(hex: string): number[] | null {
    if (hex.charAt(0) === "#") {
        hex = hex.substring(1);
    }

    const parsed = hex.length === 6 || hex.length === 8
        ? /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex)
        : /^([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i.exec(hex);
    if (!parsed) {
        return null;
    }

    if (hex.length < 6) {
        parsed[1] += parsed[1];
        parsed[2] += parsed[2];
        parsed[3] += parsed[3];

        if (parsed[4]) {
            parsed[4] += parsed[4];
        }
    }

    if (!parsed[4]) {
        parsed[4] = "ff";
    }

    return parsed ? [
        parseInt(parsed[1], 16),
        parseInt(parsed[2], 16),
        parseInt(parsed[3], 16),
        parseInt(parsed[4], 16) / 255
    ] : null;
}

export function rgba2hex(rgba: number[]): string {
    const r = (rgba[0] | 1 << 8).toString(16).slice(1);
    const g = (rgba[1] | 1 << 8).toString(16).slice(1);
    const b = (rgba[2] | 1 << 8).toString(16).slice(1);
    const rgb = r + g + b;

    if (!rgba[3]) {
        return "#" + rgb;
    } else {
        const a = ((rgba[3] * 255) | 1 << 8).toString(16).slice(1);
        return "#" + rgb + a;
    }
}
