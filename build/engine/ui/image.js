import { ImgManager } from "../image.js";
import ui_ElementBase from "./base.js";
import ui_Style from "./style.js";
export default class ui_Image extends ui_ElementBase {
    constructor(img_name, size = 32) {
        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding = [16, 16, 16, 16];
        style.radius = [4, 4, 4, 4];
        style.center = [false, true];
        style.minWidth = size;
        style.maxWidth = size;
        style.minHeight = size;
        style.maxHeight = size;
        super(style, []);
        this.img_name = img_name;
    }
    update(bounds) {
        super.update(bounds);
    }
    draw(ren, depth = 0.0) {
        rectMode(CORNERS);
        textAlign(CENTER, CENTER);
        textSize(24);
        stroke(0);
        // super.draw(ren, depth);
        const img = ImgManager.getImgNamed(this.img_name);
        imageMode(CORNERS);
        image(img, this.xmin, this.ymin, this.xmax, this.ymax);
    }
}
//# sourceMappingURL=image.js.map