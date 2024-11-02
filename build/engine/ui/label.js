import ui_ElementBase from "./base.js";
export default class ui_Label extends ui_ElementBase {
    constructor(label) {
        super();
        this.label = label;
        this.style.maxWidth = 1024;
        this.style.maxHeight = 64;
    }
    update(bounds) {
        super.update(bounds);
    }
    draw(depth = 0) {
        rectMode(CORNERS);
        textAlign(CENTER, CENTER);
        textSize(24);
        stroke(0);
        fill(this.style.fg);
        text(this.label, 0.5 * (this.xmin + this.xmax), 0.5 * (this.ymin + this.ymax));
    }
}
//# sourceMappingURL=label.js.map