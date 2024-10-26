

export default class ui_Style
{
    padding = [8, 8, 8, 8];
    margin  = [0, 0, 0, 0];
    radius  = [2, 2, 2, 2];

    bg = [75, 75, 75, 220];
    fg = [150, 150, 150, 220];

    center = [false, false];

    minWidth = 64;
    maxWidth = 512;

    minHeight = 64;
    maxHeight = 512;

    constructor( bg  = [75, 75, 75, 220], fg  = [150, 150, 150, 220],
                 pad = [8, 8, 8, 8], mar = [4, 4, 4, 4], rad = [16] )
    {
        this.padding = pad;
        this.margin  = mar;
        this.radius  = rad;
        this.bg = bg;
        this.fg = fg;
    }
}

