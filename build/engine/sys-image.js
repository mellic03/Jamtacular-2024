import System from "./system.js";
export default class sys_Image extends System {
    constructor() {
        super();
        this.cache = new Map();
    }
    load(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        else {
            const img = loadImage(path);
            this.cache.set(path, img);
            return img;
        }
    }
    get(path) {
        return this.cache.get(path);
    }
}
//# sourceMappingURL=sys-image.js.map