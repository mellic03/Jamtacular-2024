import vec2 from "./math/vec2.js";
class BasedAnimation {
    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    set x(n) { this.pos.x = n; }
    set y(n) { this.pos.y = n; }
    constructor() {
        this.pos = new vec2(0, 0);
        this.size = new vec2(128, 128);
        this.rotation = 0;
        this.timer = 0;
        this.duration = 1.0;
        this.playing = false;
        this.looping = true;
        this.is_tiled = false;
        this.rows = 0;
        this.cols = 0;
        this.row_idx = 0;
        this.col_idx = 0;
        this.num_frames = 0;
        this.frame_idx = 0;
        this.images = new Array();
        BasedAnimation.all.push(this);
    }
    static load(frames) {
        const A = new BasedAnimation();
        for (let path of frames) {
            A.images.push(loadImage(path));
        }
        A.num_frames = frames.length;
        A.duration = frames.length * (1.0 / 30.0);
        return A;
    }
    static loadTiled(path, tiles_x, tiles_y, tiles_total) {
        const A = new BasedAnimation();
        A.images = [loadImage(path)];
        A.is_tiled = true;
        A.rows = tiles_y;
        A.cols = tiles_x;
        A.num_frames = tiles_total;
        A.duration = tiles_total * (1.0 / 30.0);
        return A;
    }
    static update() {
        for (const A of BasedAnimation.all) {
            A._update();
        }
    }
    _update() {
        const dt = deltaTime / 1000.0;
        if (this.looping == false) {
            if (this.playing) {
                this.timer += dt;
                if (this.timer > this.duration) {
                    this.timer = 0;
                    this.playing = false;
                }
            }
        }
        else if (this.playing) {
            this.timer = (this.timer + dt) % this.duration;
        }
        this.frame_idx = Math.floor(this.num_frames * (this.timer / this.duration));
    }
    copy() {
        const A = new BasedAnimation();
        A.pos.copy(this.pos);
        A.size.copy(this.size);
        A.timer = 0.0;
        A.duration = this.duration;
        A.playing = this.playing;
        A.looping = this.looping;
        A.is_tiled = this.is_tiled;
        A.rows = this.rows;
        A.cols = this.cols;
        A.num_frames = this.num_frames;
        A.frame_idx = this.frame_idx;
        A.images = this.images;
        return A;
    }
    draw() {
        if (this.playing == false) {
            return;
        }
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        translate(-this.x, -this.y);
        const w = this.size.x;
        const h = this.size.y;
        if (this.is_tiled) {
            noSmooth();
            const img = this.images[0];
            const idx = this.frame_idx;
            const row = Math.floor(idx / this.cols);
            const col = idx % this.cols;
            const dw = img.width / this.cols;
            const dh = img.height / this.rows;
            const dx = dw * col;
            const dy = dh * row;
            image(img, this.x, this.y, w, h, dx, dy, dw, dh);
        }
        else {
            const img = this.images[this.frame_idx];
            image(img, this.x, this.y, w, h);
        }
        pop();
    }
}
BasedAnimation.all = new Array();
export default BasedAnimation;
//# sourceMappingURL=animation.js.map