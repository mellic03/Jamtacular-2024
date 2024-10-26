

export default class ComputeBuffer
{
    w: number;
    h: number;
    buffer = null;

    constructor( w: number, h: number, offline_ctx: any )
    {
        this.w = w;
        this.h = h;

        this.buffer = offline_ctx.createFramebuffer({
            width:   w,
            height:  h,
            density: 1,
            format:  FLOAT,
            textureFiltering: NEAREST
        });
    }


    read()
    {
        return this.buffer.pixels;
    }

    data()
    {
        return this.buffer.color;
    }

    map()
    {
        this.buffer.loadPixels();
        return this.buffer.pixels;
    }

    unmap()
    {
        this.buffer.updatePixels();
    }
}

