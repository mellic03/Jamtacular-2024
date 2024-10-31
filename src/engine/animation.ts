import { Engine, __engine } from "./engine.js";
import * as p5 from "p5";
import { math } from "./math/math.js";
import vec2 from "./math/vec2.js";

export default class BasedAnimation
{
    private static all = new Array<BasedAnimation>();

    pos:  vec2 = new vec2(0, 0);
    size: vec2 = new vec2(128, 128);
    rotation: number = 0;

    get x(): number { return this.pos.x; }
    get y(): number { return this.pos.y; }
    set x( n: number ) { this.pos.x = n; }
    set y( n: number ) { this.pos.y = n; }

    timer      = 0;
    duration   = 1.0;
    playing    = false;
    looping    = true;

    is_tiled   = false;
    rows       = 0;
    cols       = 0;
    row_idx    = 0;
    col_idx    = 0;
    
    num_frames = 0;
    frame_idx  = 0;
    images     = new Array<p5.Image>();

    constructor()
    {
        BasedAnimation.all.push(this);
    }

    static load( frames: Array<string> ): BasedAnimation
    {
        const A = new BasedAnimation();

        for (let path of frames)
        {
            A.images.push(loadImage(path));
        }

        A.num_frames = frames.length;
        A.duration   = frames.length * (1.0 / 30.0);

        return A;
    }

    static loadTiled( path: string, tiles_x: number, tiles_y: number, tiles_total: number ): BasedAnimation
    {
        const A = new BasedAnimation();

        A.images     = [loadImage(path)];
        A.is_tiled   = true;
        A.rows       = tiles_y;
        A.cols       = tiles_x;
        A.num_frames = tiles_total;
        A.duration   = tiles_total * (1.0 / 30.0);

        return A;
    }


    static update(): void
    {
        for (const A of BasedAnimation.all)
        {
            A._update();
        }
    }


    private _update(): void
    {
        const dt = deltaTime / 1000.0;

        if (this.looping == false)
        {
            if (this.playing)
            {
                this.timer += dt;

                if (this.timer > this.duration)
                {
                    this.timer   = 0;
                    this.playing = false;
                }
            }
        }

        else if (this.playing)
        {
            this.timer = (this.timer + dt) % this.duration;
        }

        this.frame_idx = Math.floor(this.num_frames * (this.timer / this.duration));
    }


    copy(): BasedAnimation
    {
        const A = new BasedAnimation();

        A.pos.copy(this.pos);
        A.size.copy(this.size);

        A.timer      = 0.0;
        A.duration   = this.duration;
        A.playing    = this.playing;
        A.looping    = this.looping;

        A.is_tiled   = this.is_tiled;
        A.rows       = this.rows;
        A.cols       = this.cols;

        A.num_frames = this.num_frames;
        A.frame_idx  = this.frame_idx;
        A.images     = this.images;

        return A;
    }


    draw(): void
    {
        if (this.playing == false)
        {
            return;
        }

        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        translate(-this.x, -this.y);


        const w = this.size.x;
        const h = this.size.y;

        if (this.is_tiled)
        {
            noSmooth();

            const img = this.images[0];
            const idx = this.frame_idx;

            const row = Math.floor(idx / this.cols);
            const col = idx % this.cols;

            const dw  = img.width / this.cols;
            const dh  = img.height / this.rows;
            const dx  = dw*col;
            const dy  = dh*row;

            image(img, this.x, this.y, w, h, dx, dy, dw, dh);
        }

        else
        {
            const img = this.images[this.frame_idx];
            image(img, this.x, this.y, w, h);
        }

        pop();
    }

}
