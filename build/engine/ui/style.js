import Render from "../sys-render.js";
class ui_Style {
    constructor(bg = [75, 75, 75, 220], fg = [150, 150, 150, 220], pad = [8, 8, 8, 8], mar = [4, 4, 4, 4], rad = [16]) {
        this.padding = [8, 8, 8, 8];
        this.margin = [0, 0, 0, 0];
        this.radius = [2, 2, 2, 2];
        this.bg = [75, 75, 75, 220];
        this.fg = [150, 150, 150, 220];
        this.align = [ui_Style.LEFT, ui_Style.LEFT]; // 0 -> left,  1 -> mid,  2 -> right
        this.boundLimitTypes = [ui_Style.PIXELS, ui_Style.PIXELS, ui_Style.PIXELS, ui_Style.PIXELS];
        this.widthType = ui_Style.PIXELS;
        this.minWidth = 64;
        this.maxWidth = 512;
        this.heightType = ui_Style.PIXELS;
        this.minHeight = 64;
        this.maxHeight = 512;
        this.padding = pad;
        this.margin = mar;
        this.radius = rad;
        this.bg = bg;
        this.fg = fg;
    }
}
ui_Style.LEFT = 0;
ui_Style.TOP = 0;
ui_Style.CENTER = 1;
ui_Style.BOTTOM = 2;
ui_Style.RIGHT = 2;
ui_Style.PIXELS = 10;
ui_Style.RATIO = 11;
export default ui_Style;
export function setSyleWidthLimit(style, minPixels, maxPixels, minRatio, maxRatio, minType = ui_Style.PIXELS, maxType = ui_Style.PIXELS) {
    const vw = Render.width;
    style.minWidth = Math.max(minPixels, vw * minRatio);
    style.maxWidth = Math.min(maxPixels, vw * maxRatio);
}
export function setSyleHeightLimit(style, minPixels, maxPixels, minRatio, maxRatio, minType = ui_Style.PIXELS, maxType = ui_Style.PIXELS) {
    const vh = Render.height;
    style.minHeight = Math.max(minPixels, vh * minRatio);
    style.maxHeight = Math.min(maxPixels, vh * maxRatio);
}
export function setSyleSpanLimitAsRatio(style, minWidth, maxWidth, minHeight, maxHeight) {
    const vw = Render.width;
    const vh = Render.height;
    style.minHeight = minWidth * vw;
    style.maxWidth = maxWidth * vw;
    style.minHeight = minHeight * vh;
    style.maxHeight = maxHeight * vh;
}
export function setSyleSpanLimitAsPixels(style, minWidth, maxWidth, minHeight, maxHeight) {
    style.minHeight = minWidth;
    style.maxWidth = maxWidth;
    style.minHeight = minHeight;
    style.maxHeight = maxHeight;
}
//# sourceMappingURL=style.js.map