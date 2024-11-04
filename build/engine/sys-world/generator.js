export default class WorldGenerator {
    static generateWorld(w, h, scale, xoff = 2048, yoff = 1024) {
        const data = new Array();
        WorldGenerator.clear(w, h, data);
        WorldGenerator.gen_world(w, h, scale, xoff, yoff, data);
        return data;
    }
    static loadWorld(w, h, img) {
        const data = new Array();
        WorldGenerator.clear(w, h, data);
        WorldGenerator.load_file(w, h, img, data);
        return data;
    }
    static clear(w, h, output) {
        for (let i = 0; i < h; i++) {
            output.push([]);
            for (let j = 0; j < w; j++) {
                output[i].push(0);
            }
        }
    }
    static gen_world(w, h, scale, xoff, yoff, output) {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const x = scale * (j - w / 2);
                const y = scale * (i - h / 2);
                const dx = 0 - x;
                const dy = 0 - y;
                // if (Math.sqrt(dx*dx + dy*dy) < 888)
                if (Math.sqrt(dx * dx + dy * dy) < 512) {
                    output[i][j] = 0;
                }
                // else if (y <= x)
                else if ((-128 <= x && x < +128) || (-128 <= y && y < +128)) {
                    output[i][j] = 0;
                }
                else if (noise((j / 32) + xoff, (i / 32) + yoff) < 0.45) {
                    output[i][j] = 0;
                }
                else {
                    output[i][j] = 1;
                }
            }
        }
    }
    static load_file(w, h, img, output) {
    }
    static generateImage(w, h, input) {
        const img = createImage(w, h);
        img.loadPixels();
        const data = img.pixels;
        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                const idx = 4 * (w * r + c);
                const n = input[r][c];
                WorldGenerator.writeRGBA(n, data, idx);
            }
        }
        img.updatePixels();
        return img;
    }
    static writeRGBA(n, dst, idx) {
        dst[idx + 0] = 255 - (200 * n);
        dst[idx + 1] = 255 - (200 * n);
        dst[idx + 2] = 255 - (200 * n);
        dst[idx + 3] = 255;
    }
}
//# sourceMappingURL=generator.js.map