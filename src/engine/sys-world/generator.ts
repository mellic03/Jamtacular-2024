import * as p5 from "p5";


export default class WorldGenerator
{
    static generateWorld( w: number, h: number, scale: number ): Array<Array<number>>
    {
        const data = new Array<Array<number>>();

        WorldGenerator.clear(w, h, data);
        WorldGenerator.gen_world(w, h, scale, data);

        return data;
    }


    static loadWorld( w: number, h: number, img: p5.Image ): Array<Array<number>>
    {
        const data = new Array<Array<number>>();

        WorldGenerator.clear(w, h, data);
        WorldGenerator.load_file(w, h, img, data);

        return data;
    }


    private static clear( w: number, h: number, output: Array<Array<number>> ): void
    {
        for (let i=0; i<h; i++)
        {
            output.push([]);

            for (let j=0; j<w; j++)
            {
                output[i].push(0);
            }
        }
    }


    private static gen_world( w: number, h: number, scale: number, output: Array<Array<number>> ): void
    {
        for (let i=0; i<h; i++)
        {
            for (let j=0; j<w; j++)
            {
                const x = scale*(j - w/2);
                const y = scale*(i - h/2);
                const dx = 0 - x;
                const dy = 0 - y;

                // if (Math.sqrt(dx*dx + dy*dy) < 888)
                if (Math.sqrt(dx*dx + dy*dy) < 512)
                {
                    output[i][j] = 0;
                }

                // else if (y <= x)
                else if (-128 <= y && y < +128)
                {
                    output[i][j] = 0;
                }

                else if (noise((x/2048)+4096, (y/2048)+4096) < 0.35)
                {
                    output[i][j] = 0;
                }
    
                else
                {
                    output[i][j] = 1;
                }
            }
        }
    
    }


    private static load_file( w: number, h: number, img: p5.Image, output: Array<Array<number>> ): void
    {
        
    
    }

}