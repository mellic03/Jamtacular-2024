import vec2 from "../math/vec2.js";
import JtSystem from "../system/system.js";
class JtNoiseSystem extends JtSystem {
    constructor() {
        super();
        this.imgVoronoi = new Array(4);
        this.uv = new vec2(0, 0);
    }
    preload() {
        for (let i = 0; i < 4; i++) {
            // this.imgVoronoi[i] = loadImage(`assets/img/noise/voronoi/${i}.jpg`);
        }
    }
    setup() {
        noiseSeed(1831);
        // for (let img of this.imgVoronoi)
        // {
        //     img.loadPixels();
        // }
    }
    update() {
    }
    perlin(x, y) {
        return noise(x, y);
    }
    voronoi(x, y) {
        return 0;
        // const u = int(x) % 256;
        // const v = int(y) % 256;
        // return this.imgVoronoi[0].pixels[256*v + u];
    }
    FBM(x, y, octaves = 4, persistence = 0.5, lacunarity = 2, noisefunction = this.perlin) {
        let fbm = 0.0;
        let amp = 1.0;
        let freq = 1.0;
        let rot = 0.0;
        this.uv.from(x, y);
        for (let i = 0; i < octaves; i++) {
            fbm += amp * noisefunction(freq * this.uv.x, freq * this.uv.y);
            amp *= persistence;
            freq *= lacunarity;
            rot += 2 * Math.PI / octaves;
        }
        return fbm;
    }
}
export const NoiseSystem = new JtNoiseSystem;
//# sourceMappingURL=noisesystem.js.map