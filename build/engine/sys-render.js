import vec2 from "./math/vec2.js";
import { math } from "./math/math.js";
import GeometryTest from "./math/geometry.js";
import { EventEmitter } from "./sys-event.js";
export class RenderBuffer {
    constructor(w, h, offline_ctx) {
        this.buffer = null;
        this.w = w;
        this.h = h;
        this.buffer = offline_ctx.createFramebuffer({
            width: w,
            height: h,
            density: 1,
            format: FLOAT,
            textureFiltering: NEAREST
        });
    }
    read() {
        return this.buffer.pixels;
    }
    data() {
        return this.buffer.color;
    }
    map() {
        this.buffer.loadPixels();
        return this.buffer.pixels;
    }
    unmap() {
        this.buffer.updatePixels();
    }
}
const GTest = GeometryTest;
let Ren;
export var RenderEvent;
(function (RenderEvent) {
    RenderEvent[RenderEvent["RESIZE"] = 1] = "RESIZE";
})(RenderEvent || (RenderEvent = {}));
;
class Render {
    static init(width, height) {
        Render.width = width;
        Render.height = height;
        Render.span.setXY(width, height);
    }
    static preload() {
        Render.font = loadFont("assets/font/RodettaStamp.ttf");
    }
    static setup() {
        if (Render.webgl == false) {
            Render.canvas = createCanvas(Render.width, Render.height);
            Render.offline_ctx = createGraphics(Render.width, Render.height);
        }
        else {
            Render.canvas = createCanvas(Render.width, Render.height, WEBGL);
            Render.offline_ctx = createGraphics(Render.width, Render.height, WEBGL);
            textFont(Render.font);
        }
    }
    static on(msg, callback) {
        Render._events.on(msg, callback);
    }
    static emit(msg, data) {
        Render._events.emit(msg, data);
    }
    static resize(w, h) {
        this.width = w;
        this.height = h;
        Render.span.setXY(w, h);
        resizeCanvas(w, h);
    }
    static beginFrame() {
        this.mouse_screen.setXY(mouseX, mouseY);
        this.mouse_world.copy(this.screenToWorld(this.mouse_screen));
        Ren.span.setXY(Ren.width, Ren.height);
        Ren.tl.copy(Ren.view).addMul(Ren.span, -0.5);
        Ren.br.copy(Ren.view).addMul(Ren.span, +0.5);
        push();
        if (Ren.webgl == false) {
            translate(+Ren.width / 2, +Ren.height / 2, 0);
        }
        scale(Ren.scale);
        translate(-Ren.view.x, -Ren.view.y, 0);
        background(...Ren.bg_color);
        Ren.avg_fps = math.mix(Ren.avg_fps, frameRate(), 1.0 / 60.0);
    }
    static endFrame() {
        pop();
        // translate(+Ren.view.x, +Ren.view.y, 0);
        // scale(1.0 / Ren.scale);
    }
    static getOfflineContext() {
        return this.offline_ctx;
    }
    static avgFPS() {
        return Ren.avg_fps;
    }
    static setBackground(r, g, b, a) {
        Render.bg_color = [r, g, b, a];
    }
    static screenToWorld(screen) {
        return vec2.copy(screen).subMul(Ren.span, 0.5).divXY(Ren.scale).add(Ren.view);
    }
    static worldToScreen(world) {
        return vec2.copy(world).sub(Ren.view).mulXY(Ren.scale).addMul(Ren.span, 0.5);
    }
    static screenMouse() {
        return vec2.copy(this.mouse_screen);
    }
    static worldMouse() {
        return vec2.copy(this.mouse_world);
    }
    static pushInverseViewTransform() {
        push();
        translate(+Render.view.x, +Render.view.y, 0);
        scale(1.0 / Render.scale);
        if (Ren.webgl == false) {
            translate(-Render.width / 2, -Render.height / 2, 0);
        }
    }
    static popInverseViewTransform() {
        pop();
    }
    static screenText(label, x, y) {
        Render.pushInverseViewTransform();
        text(label, x, y);
        Render.popInverseViewTransform();
    }
    static worldText(label, x, y) {
        text(label, x, y);
    }
    static rectInView(x, y, w, h) {
        const vx = Render.view.x;
        const vy = Render.view.y;
        const hw = (0.5 * Render.width) / Render.scale;
        const hh = (0.5 * Render.height) / Render.scale;
        const c0 = (vx - hw < x + w) && (vx + hw > x);
        const c1 = (vy - hh < y + h) && (vy + hh > y);
        return (c0 && c1);
    }
    static rectCenter(pos, span) {
        rect(pos.x - span.x / 2, pos.y - span.x / 2, pos.x + span.x / 2, pos.y + span.y / 2);
    }
    static rectCornerXY(x, y, w, h) {
        const x0 = (x - Ren.view.x) * Ren.scale + (Ren.width / 2);
        const y0 = (y - Ren.view.y) * Ren.scale + (Ren.height / 2);
        const w0 = w * Ren.scale;
        const h0 = h * Ren.scale;
        if (!GTest.RectRectOverlap(x0, y0, w0, h0, 0, 0, Ren.width, Ren.height)) {
            return;
        }
        rect(x, y, w, h);
    }
    static rectCorner(tl, span) {
        Ren.rectCornerXY(tl.x, tl.y, span.x, span.y);
    }
    static rectCorners(tl, br) {
        rect(tl.x, tl.y, br.x, br.y);
    }
    static rectRotated(x, y, w, h, A, B) {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y - A.y, B.x - A.x);
        push();
        translate(A.x, A.y);
        rotate(theta);
        rect(x, y, w, h);
        pop();
    }
    static imageRotated(img, x, y, w, h, A, B) {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y - A.y, B.x - A.x);
        push();
        translate(A.x, A.y);
        rotate(theta);
        image(img, x, y, w, h);
        pop();
    }
}
Render._events = new EventEmitter();
Render.bg_color = [200, 200, 200, 255];
Render.view = new vec2(0, 0);
Render.span = new vec2(0, 0);
Render.tl = new vec2(0, 0);
Render.br = new vec2(0, 0);
Render.webgl = false;
Render.scale = 1.0;
Render.avg_fps = 1.0 / 60.0;
Render.mouse_screen = new vec2(0, 0);
Render.mouse_world = new vec2(0, 0);
export default Render;
Ren = Render;
//# sourceMappingURL=sys-render.js.map