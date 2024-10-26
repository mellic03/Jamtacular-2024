import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";
export default class ui_List extends ui_ElementBase {
    constructor(...children) {
        let style = new ui_Style();
        style.center = [true, true];
        super(style, children);
        this.temp = new ui_Bounds(0, 0, 1024, 1024);
    }
    update(bounds) {
        super.update(bounds);
        this.temp.copy(this.bounds);
        for (let child of this.children) {
            child.update(this.temp);
            this.temp.ymin += child.style.maxHeight;
            this.temp.ymin += 0.5 * child.style.padding[3];
        }
    }
    draw(ren, depth = 0) {
        rectMode(CORNERS);
        stroke(0);
        super.draw(ren, depth);
        for (let child of this.children) {
            child.draw(ren, depth + 1);
        }
    }
}
//# sourceMappingURL=list.js.map