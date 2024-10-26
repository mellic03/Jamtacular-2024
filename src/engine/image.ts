import JtSystem from "./system/system.js";

class ImageManager extends JtSystem
{
    images: Map<string, any>;

    constructor()
    {
        super();
        this.images = new Map<string, any>();
    }

    loadImg( path: string )
    {
        return loadImage(path);
    }

    loadImgNamed( name: string, path: string )
    {
        const img = loadImage(path);
        this.images.set(name, img);
        return img;
    }

    getImgNamed( name: string )
    {
        return this.images.get(name);
    }

    preload()
    {
        this.loadImgNamed("space", "assets/img/space-lq.png");

        this.loadImgNamed("heart-red",  "assets/img/heart-red.png");
        this.loadImgNamed("heart-grey", "assets/img/heart-grey.png");
    }


}

const ImgManager = new ImageManager();
export { ImgManager };