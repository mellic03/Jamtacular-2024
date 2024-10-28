import System from "./system.js";


export default class sys_Image extends System
{
    cache: Map<string, any>;

    constructor()
    {
        super();
        this.cache = new Map<string, any>();
    }

    load( path: string )
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

    get( path: string )
    {
        return this.cache.get(path);
    }
}

