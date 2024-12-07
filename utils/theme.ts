import { APCAcontrast, sRGBtoY } from "apca-w3";
import { hex2rgba, rgba2hex } from "@/utils/colors";

// Copied from https://github.com/pufferpanel/pufferpanel/blob/v3/client/frontend/src/utils/theme.js

export function deriveOpacity(base: string, opacity: number): string {
    const rgba = hex2rgba(base);
    if (!rgba) {
        return base;
    }

    rgba[3] = Number(opacity);
    return rgba2hex(rgba);
}

export function deriveContrast(base: string, options: string[], foreground: boolean): string {
    const selected = options.map(opt => {
        if (foreground) {
            return [opt, contrast(opt, base)];
        } else {
            return [opt, contrast(base, opt)];
        }
    }).reduce((a: (string | number | undefined)[], b: (string | number)[]) => {
        if ((a[1] as number) >= (b[1] as number)) {
            return a;
        }

        return b;
    }, [undefined, 0]);

    return selected[0] as string;
}

function contrast(color1: string, color2: string): number {
    const color1rgba = hex2rgba(color1);
    const color2rgba = hex2rgba(color2);
    if (!color1rgba || !color2rgba) {
        return 0;
    }

    const y1 = sRGBtoY(alphaBlend(color1rgba, color2rgba));
    const y2 = sRGBtoY(color2rgba  as [number, number, number]);
    const c = Number(APCAcontrast(y1, y2));
    return c < 0 ? c * -1 : c;
}

function alphaBlend(rgbaFG = [0, 0, 0, 1.0], rgbBG = [0, 0, 0], isInt = true): [r: number, g: number, b: number] {
    rgbaFG[3] = Math.max(Math.min(rgbaFG[3], 1.0), 0.0);
    const compBlend = 1.0 - rgbaFG[3];
    const rgbOut = [0, 0, 0];

    for (let i = 0; i < 3; i++) {
        rgbOut[i] = rgbBG[i] * compBlend + rgbaFG[i] * rgbaFG[3];
        if (isInt) {
            rgbOut[i] = Math.min(Math.round(rgbOut[i]), 255);
        }
    }

    return rgbOut as [number, number, number];
}