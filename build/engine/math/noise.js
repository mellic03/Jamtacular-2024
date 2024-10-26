import vec2 from "./vec2.js";
let uv = new vec2(0, 0);
/**
 *
 * @param noisefunction 2D Noise function, takes two values and returns a number.
 */
function FBM(x, y, octaves = 4, persistence = 0.5, lacunarity = 2) {
    let fbm = 0.0;
    let amp = 1.0;
    let freq = 1.0;
    let rot = 0.0;
    uv.from(x, y);
    for (let i = 0; i < octaves; i++) {
        fbm += amp * noise(freq * uv.x, freq * uv.y);
        amp *= persistence;
        freq *= lacunarity;
        rot += 2 * Math.PI / octaves;
    }
    return fbm;
}
export const JtNoise = {
    FBM
};
//# sourceMappingURL=noise.js.map