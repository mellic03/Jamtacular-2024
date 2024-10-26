import { idk_math } from "../math/math.js";
import vec2 from "../math/vec2.js";
export default class RenderEngine {
    constructor(w, h, webgl = false) {
        this.timer = 0.0;
        this.width = w;
        this.height = h;
        this.webgl = webgl;
        this.scale = 1.0;
        this.avg_fps = 60.0;
        this.shaders = [null, null, null, null];
        this.fonts = [null, null, null, null];
    }
    get xoffset() {
        return (this.webgl == true ? 0.5 : 0.0) * this.width;
    }
    get yoffset() {
        return (this.webgl == true ? 0.5 : 0.0) * this.height;
    }
    preload() {
        const ctx = createGraphics(this.width, this.height, WEBGL);
        ctx.textureWrap(CLAMP);
        this.offline_ctx = ctx;
        this.shaders[0] = loadShader("src/engine/shaders/screenquad.vs", "src/engine/shaders/test.fs");
        this.shaders[1] = loadShader("src/engine/shaders/screenquad.vs", "src/engine/shaders/aberration.fs");
        this.fonts[0] = loadFont("assets/font/RodettaStamp.ttf");
    }
    setup() {
        if (this.webgl == true) {
            this.canvas = createCanvas(this.width, this.height, WEBGL);
        }
        else {
            this.canvas = createCanvas(this.width, this.height);
        }
        frameRate(165);
        textFont(this.fonts[0]);
    }
    update() {
        this.avg_fps = idk_math.mix(this.avg_fps, frameRate(), 1.0 / 60.0);
        this.timer += deltaTime / 1000.0;
    }
    /** Return an nxn offline context
     *
     * @param n
     * @returns
     */
    getOfflineContext() {
        return this.offline_ctx;
    }
    _renderWorldGridSector(cam, sector) {
        const pg = this.getOfflineContext();
        this.shaders[0].setUniform("un_texture", sector.buffer.data());
        // pg.plane(pg.width, pg.height);
        pg.rect(0, 0, sector.width, sector.width);
        image(pg, sector.pos.x, sector.pos.y, sector.span.x, sector.span.y);
    }
    renderWorldGridSector(cam, sector) {
        push();
        translate(-cam.x, -cam.y, 0);
        imageMode(CORNER);
        const pg = this.getOfflineContext();
        const program = this.shaders[0];
        let dir = new vec2(0.5 * this.width - mouseX, 0.5 * this.height - mouseY);
        dir.normalize();
        program.setUniform("un_lightdir", [dir.x, -0.15, -dir.y]);
        program.setUniform("un_terrain_pos", [sector.pos.x, sector.pos.y]);
        program.setUniform("un_terrain_scale", sector.scale);
        program.setUniform("un_time", this.timer);
        pg.background(0);
        pg.shader(program);
        this._renderWorldGridSector(cam, sector);
        for (let neighbour of sector.neighbours) {
            this._renderWorldGridSector(cam, neighbour);
        }
        pop();
    }
    postProcess() {
        imageMode(CORNER);
        const program = this.shaders[1];
        const pg = this.getOfflineContext();
        pg.shader(program);
        program.setUniform("un_texture", this.canvas);
        pg.rect(0, 0, this.width, this.height);
        image(pg, -this.xoffset, -this.yoffset, this.width, this.height);
    }
    avgFPS() {
        return this.avg_fps;
    }
    ellipse(x, y, z, w, h) {
        translate(0, 0, +z);
        ellipse(x, y, w, h);
        translate(0, 0, -z);
    }
    rect(x, y, z, w, h) {
        translate(0, 0, +z);
        rect(x, y, w, h);
        translate(0, 0, -z);
    }
}
//# sourceMappingURL=renderengine.js.map