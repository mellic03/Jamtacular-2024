import { Audio } from "../audio.js";
import ui_ElementBase from "./base.js";
import ui_Style from "./style.js";
export default class ui_Button extends ui_ElementBase {
    constructor(label, callback = () => { }) {
        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding = [8, 8, 8, 16];
        style.radius = [4, 4, 4, 4];
        style.center = [true, false];
        style.maxWidth = 512;
        style.minHeight = 52;
        style.maxHeight = 52;
        super(style, []);
        this.label = label;
        this.callback = callback;
    }
    offMouseHover() {
        // const dt = deltaTime / 1000.0;
        // const a  = idk_math.clamp(16.0*dt, 0.0, 1.0);
        // for (let i=0; i<this.style.fg.length; i++)
        // {
        //     this.style.bg[i] += a * (this.style_og.bg[i] - this.style.bg[i]);
        //     this.style.fg[i] += a * (this.style_og.fg[i] - this.style.fg[i]);
        // }
        this.style.bg = [...this.style_og.bg];
        this.style.fg = [...this.style_og.fg];
    }
    onMouseHover() {
        // const dt = deltaTime / 1000.0;
        // const a  = idk_math.clamp(16.0*dt, 0.0, 1.0);
        // for (let i=0; i<this.style.fg.length; i++)
        // {
        //     this.style.bg[i] += a * (this.style_og.fg[i] - this.style.bg[i]);
        //     this.style.fg[i] += a * (this.style_og.bg[i] - this.style.fg[i]);
        // }
        this.style.bg = [...this.style_og.fg];
        this.style.fg = [...this.style_og.bg];
    }
    onMouseDown() {
        this.offMouseHover();
    }
    onMouseClick() {
        Audio.getSound("click").play();
        this.callback();
    }
    update(bounds) {
        super.update(bounds);
    }
    draw(ren, depth = 0.0) {
        rectMode(CORNERS);
        textAlign(CENTER, CENTER);
        textSize(24);
        stroke(0);
        super.draw(ren, depth);
        fill(this.style.fg);
        text(this.label, 0.5 * (this.xmin + this.xmax), 0.5 * (this.ymin + this.ymax));
    }
}
//# sourceMappingURL=button.js.map