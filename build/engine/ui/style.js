export default class ui_Style {
    constructor(bg = [75, 75, 75, 220], fg = [150, 150, 150, 220], pad = [8, 8, 8, 8], mar = [4, 4, 4, 4], rad = [16]) {
        this.padding = [8, 8, 8, 8];
        this.margin = [0, 0, 0, 0];
        this.radius = [2, 2, 2, 2];
        this.bg = [75, 75, 75, 220];
        this.fg = [150, 150, 150, 220];
        this.center = [false, false];
        this.minWidth = 64;
        this.maxWidth = 512;
        this.minHeight = 64;
        this.maxHeight = 512;
        this.padding = pad;
        this.margin = mar;
        this.radius = rad;
        this.bg = bg;
        this.fg = fg;
    }
}
//# sourceMappingURL=style.js.map