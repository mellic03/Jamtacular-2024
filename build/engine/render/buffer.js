export default class ComputeBuffer {
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
//# sourceMappingURL=buffer.js.map