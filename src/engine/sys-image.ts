import System from "./system.js";
import * as p5 from "p5";


export default class sys_Image extends System
{
    cache: Map<string, p5.Image>;

    constructor()
    {
        super();
        this.cache = new Map<string, p5.Image>();
    }

    load( path: string ): p5.Image
    {
        if (this.cache.has(path))
        {
            return this.cache.get(path);
        }

        else
        {
            const img = loadImage(path);
            this.cache.set(path, img);
            return img;
        }
    }

    get( path: string ): p5.Image
    {
        return this.cache.get(path);
    }
}

