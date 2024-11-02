import ui_Label from "./label.js";
import ui_Style from "./style.js";
export default class ui_Title extends ui_Label {
    constructor(label) {
        let style = new ui_Style([50, 50, 50, 150], [255, 255, 255, 255]);
        style.padding = [1, 1, 32, 128];
        style.radius = [0, 0, 0, 0];
        style.align = [ui_Style.LEFT, ui_Style.TOP];
        style.maxWidth = 1024;
        style.maxHeight = 42;
        super(label);
        this.updateStyle(style);
        // this.style.maxWidth  = 1024;
        // this.style.maxHeight = 64;
    }
    update(bounds) {
        super.update(bounds);
    }
    draw(depth = 0) {
        super.draw(depth);
    }
}
//# sourceMappingURL=title.js.map