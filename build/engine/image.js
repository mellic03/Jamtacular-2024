import JtSystem from "./system/system.js";
class ImageManager extends JtSystem {
    constructor() {
        super();
        this.images = new Map();
    }
    loadImg(path) {
        return loadImage(path);
    }
    loadImgNamed(name, path) {
        const img = loadImage(path);
        this.images.set(name, img);
        return img;
    }
    getImgNamed(name) {
        return this.images.get(name);
    }
    preload() {
        this.loadImgNamed("space", "assets/img/space-lq.png");
        this.loadImgNamed("heart-red", "assets/img/heart-red.png");
        this.loadImgNamed("heart-grey", "assets/img/heart-grey.png");
    }
}
const ImgManager = new ImageManager();
export { ImgManager };
//# sourceMappingURL=image.js.map