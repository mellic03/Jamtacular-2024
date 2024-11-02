import System from "./system.js";
export default class sys_Audio extends System {
    constructor() {
        super();
        this.cache = new Map();
    }
    load(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        else {
            const img = loadSound(path);
            this.cache.set(path, img);
            return img;
        }
    }
    get(name) {
        return this.cache.get(name);
    }
}
//# sourceMappingURL=sys-audio.js.map