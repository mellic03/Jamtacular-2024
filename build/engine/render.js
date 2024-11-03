import vec2 from "./math/vec2.js";
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
export var RenderEvent;
(function (RenderEvent) {
    RenderEvent[RenderEvent["WINDOW_RESIZE"] = 1] = "WINDOW_RESIZE";
})(RenderEvent || (RenderEvent = {}));
;
export default class RenderEngine extends EventEmitter {
    constructor() {
        super(...arguments);
        this.bg_color = [200, 200, 200, 255];
        this.view = new vec2(0, 0);
        this.span = new vec2(0, 0);
        this.tl = new vec2(0, 0);
        this.br = new vec2(0, 0);
        this.webgl = false;
        this.scale = 1.0;
        this.mouse_screen = new vec2(0, 0);
        this.mouse_world = new vec2(0, 0);
    }
    init(width, height) {
        this.width = width;
        this.height = height;
        this.span.setXY(width, height);
    }
    preload() {
        this.font = loadFont("assets/font/RodettaStamp.ttf");
        window.windowResized = () => {
            this.emit(RenderEvent.WINDOW_RESIZE, windowWidth - 32, windowHeight - 32);
        };
    }
    setup() {
        if (this.webgl == false) {
            this.canvas = createCanvas(this.width, this.height);
            this.offline_ctx = createGraphics(this.width, this.height);
        }
        else {
            this.canvas = createCanvas(this.width, this.height, WEBGL);
            this.offline_ctx = createGraphics(this.width, this.height, WEBGL);
            textFont(this.font);
        }
    }
    resize(w, h) {
        this.width = w;
        this.height = h;
        this.span.setXY(w, h);
        resizeCanvas(w, h);
    }
    beginFrame() {
        this.mouse_screen.setXY(mouseX, mouseY);
        this.mouse_world.copy(this.screenToWorld(this.mouse_screen));
        this.span.setXY(this.width, this.height);
        this.tl.copy(this.view).addMul(this.span, -0.5);
        this.br.copy(this.view).addMul(this.span, +0.5);
        push();
        if (this.webgl == false) {
            translate(+this.width / 2, +this.height / 2, 0);
        }
        scale(this.scale);
        translate(-this.view.x, -this.view.y, 0);
        background(...this.bg_color);
    }
    endFrame() {
        pop();
        // translate(+this.view.x, +this.view.y, 0);
        // scale(1.0 / this.scale);
    }
    getOfflineContext() {
        return this.offline_ctx;
    }
    setBackground(r, g, b, a) {
        this.bg_color = [r, g, b, a];
    }
    screenToWorld(screen) {
        return vec2.copy(screen).subMul(this.span, 0.5).divXY(this.scale).add(this.view);
    }
    worldToScreen(world) {
        return vec2.copy(world).sub(this.view).mulXY(this.scale).addMul(this.span, 0.5);
    }
    screenMouse() {
        return vec2.copy(this.mouse_screen);
    }
    worldMouse() {
        return vec2.copy(this.mouse_world);
    }
    pushInverseViewTransform() {
        push();
        translate(+this.view.x, +this.view.y, 0);
        scale(1.0 / this.scale);
        if (this.webgl == false) {
            translate(-this.width / 2, -this.height / 2, 0);
        }
    }
    popInverseViewTransform() {
        pop();
    }
    screenText(label, x, y) {
        this.pushInverseViewTransform();
        text(label, x, y);
        this.popInverseViewTransform();
    }
    worldText(label, x, y) {
        text(label, x, y);
    }
    rectInView(x, y, w, h) {
        const vx = this.view.x;
        const vy = this.view.y;
        const hw = (0.5 * this.width) / this.scale;
        const hh = (0.5 * this.height) / this.scale;
        const c0 = (vx - hw < x + w) && (vx + hw > x);
        const c1 = (vy - hh < y + h) && (vy + hh > y);
        return (c0 && c1);
    }
    rectCenter(pos, span) {
        rect(pos.x - span.x / 2, pos.y - span.x / 2, pos.x + span.x / 2, pos.y + span.y / 2);
    }
    rectCornerXY(x, y, w, h) {
        const x0 = (x - this.view.x) * this.scale + (this.width / 2);
        const y0 = (y - this.view.y) * this.scale + (this.height / 2);
        const w0 = w * this.scale;
        const h0 = h * this.scale;
        if (!GTest.RectRectOverlap(x0, y0, w0, h0, 0, 0, this.width, this.height)) {
            return;
        }
        rect(x, y, w, h);
    }
    rectCorner(tl, span) {
        this.rectCornerXY(tl.x, tl.y, span.x, span.y);
    }
    rectCorners(tl, br) {
        rect(tl.x, tl.y, br.x, br.y);
    }
    rectRotated(x, y, w, h, A, B) {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y - A.y, B.x - A.x);
        push();
        translate(A.x, A.y);
        rotate(theta);
        rect(x, y, w, h);
        pop();
    }
    imageCornerXY(img, x, y, w, h) {
        const x0 = (x - this.view.x) * this.scale + (this.width / 2);
        const y0 = (y - this.view.y) * this.scale + (this.height / 2);
        const w0 = w * this.scale;
        const h0 = h * this.scale;
        if (!GTest.RectRectOverlap(x0, y0, w0, h0, 0, 0, this.width, this.height)) {
            return;
        }
        image(img, x, y, w, h);
    }
    imageRotated(img, x, y, w, h, A, B) {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y - A.y, B.x - A.x);
        push();
        translate(A.x, A.y);
        rotate(theta);
        image(img, x, y, w, h);
        pop();
    }
}
export const Render = new RenderEngine();
//# sourceMappingURL=render.js.map