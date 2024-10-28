import System from "./system.js";
import vec2 from "./math/vec2.js";
import { Engine, __engine } from "./engine.js";


export default class sys_Noise extends System
{
    private imgVoronoi = new Array<any>(4);
    private uv = new vec2(0, 0);

    constructor()
    {
        super();
    }

    preload( engine: Engine ): void
    {
        for (let i=0; i<4; i++)
        {
            this.imgVoronoi[i] = loadImage(`assets/img/noise/voronoi/${i}.jpg`);
        }
    }
    
    setup( engine: Engine ): void
    {
        noiseSeed(1831);

        for (let img of this.imgVoronoi)
        {
            img.loadPixels();
        }
    }

    update( engine: Engine ): void
    {
        // console.log(this.imgVoronoi[0]);
    }


    perlin( x, y ): number
    {
        return noise(x, y);
    }


    voronoi( x, y ): number
    {
        const u = int(x) % 256;
        const v = int(y) % 256;
        return this.imgVoronoi[0].pixels[256*v + u];
    }


    FBM( x, y, octaves=4, persistence=0.5, lacunarity=2, noisefunction=this.perlin ): number
    {
        let fbm  = 0.0;
        let amp  = 1.0;
        let freq = 1.0;
        let rot  = 0.0;
    
        for (let i=0; i<octaves; i++)
        {
            this.uv.setXY(x, y);
            this.uv.rotate(rot);

            fbm  += amp * noisefunction(freq*this.uv.x, freq*this.uv.y);
            amp  *= persistence;
            freq *= lacunarity;
            rot  += 2*Math.PI / octaves;
        }
    
        return fbm;
    }


}


