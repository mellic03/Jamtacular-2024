import ui_ElementBase from "./base.js";
export default class ui_Dummy extends ui_ElementBase {
    constructor() {
        super();
        this.style.bg = [0, 0, 0, 0];
        this.style.maxWidth = 99999;
        this.style.maxHeight = 99999;
        this.updateStyle();
    }
    update(bounds) {
        super.update(bounds);
    }
    draw(depth = 0) {
    }
}
//# sourceMappingURL=dummy.js.map