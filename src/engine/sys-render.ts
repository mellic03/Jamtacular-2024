import vec2 from "./math/vec2.js";
import { __engine } from "./engine.js";
import { Graphics, Image } from "p5";
import { math } from "./math/math.js";
import GeometryTest from "./math/geometry.js";


export class RenderBuffer
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


const GTest = GeometryTest;
let   Ren;


export default class Render
{
    static width:  number;
    static height: number;

    public  static view  = new vec2(0, 0);
    private static span  = new vec2(0, 0);
    private static tl    = new vec2(0, 0);
    private static br    = new vec2(0, 0);
    private static webgl = false;
    private static canvas: any;

    static scale   = 1.0;
    static avg_fps = 1.0 / 60.0;

    static mouse_screen = new vec2(0, 0);
    static mouse_world  = new vec2(0, 0);

    private static offline_ctx: Graphics;
    private static font: any;

    static init( width=1024, height=1024 )
    {
        Render.width  = width;
        Render.height = height;
        Render.span.setXY(width, height);
    }

    static preload(): void
    {
        Render.font = loadFont("assets/font/RodettaStamp.ttf");
    }

    static setup(): void
    {
        if (Render.webgl == false)
        {
            Render.canvas = createCanvas(Render.width, Render.height);
        }

        else
        {
            Render.canvas = createCanvas(Render.width, Render.height, WEBGL);
            textFont(Render.font);
        }

        frameRate(165);
        
        // Render.offline_ctx = createGraphics(Render.width, Render.height, WEBGL);
    }

    static update(): void
    {
        this.mouse_screen.setXY(mouseX, mouseY);
        this.mouse_world.copy(this.screenToWorld(this.mouse_screen));

        Ren.span.setXY(Ren.width, Ren.height);
        Ren.tl.copy(Ren.view).addMul(Ren.span, -0.5);
        Ren.br.copy(Ren.view).addMul(Ren.span, +0.5);

        if (Ren.webgl == false)
        {
            translate(+Ren.width/2, +Ren.height/2, 0);
        }

        scale(Ren.scale);
        translate(-Ren.view.x, -Ren.view.y, 0);
        background(200);

        Ren.avg_fps = math.mix(Ren.avg_fps, frameRate(), 1.0/60.0);
    }







    static avgFPS(): number
    {
        return Ren.avg_fps;
    }


    static screenToWorld( screen: vec2 ): vec2
    {
        return vec2.copy(screen).subMul(Ren.span, 0.5).divXY(Ren.scale).add(Ren.view);
    }

    static worldToScreen( world: vec2 ): vec2
    {
        return vec2.copy(world).sub(Ren.view).mulXY(Ren.scale).addMul(Ren.span, 0.5);
    }


    static screenMouse(): vec2
    {
        return vec2.copy(this.mouse_screen);
    }

    static worldMouse(): vec2
    {
        return vec2.copy(this.mouse_world);
    }

    static screenText( label: string, x: number, y: number ): void
    {
        push();
        translate(+Render.view.x, +Render.view.y, 0);
        scale(1.0 / Render.scale);
    
        x = x - Ren.width/2;
        y = y - Ren.height/2;
        
        text(label, x, y);

        pop();
    }

    static worldText( label: string, x: number, y: number ): void
    {
        text(label, x, y);
    }


    static rectInView( x: number, y: number, w: number, h: number ): boolean
    {
        const vx = Render.view.x;
        const vy = Render.view.y;
        const hw = (0.5 * Render.width) / Render.scale;
        const hh = (0.5 * Render.height) / Render.scale;

        const c0 = (vx-hw < x+w) && (vx+hw > x);
        const c1 = (vy-hh < y+h) && (vy+hh > y);

        return (c0 && c1);
    }

    static rectCenter( pos: vec2, span: vec2 ): void
    {
        rect(pos.x-span.x/2, pos.y-span.x/2, pos.x+span.x/2, pos.y + span.y/2);
    }

    static rectCornerXY( x, y, w, h ): void
    {
        const x0 = (x - Ren.view.x) * Ren.scale + (Ren.width/2);
        const y0 = (y - Ren.view.y) * Ren.scale + (Ren.height/2);
        const w0 = w * Ren.scale;
        const h0 = h * Ren.scale;

        if (!GTest.RectRectOverlap(x0, y0, w0, h0, 0, 0, Ren.width, Ren.height))
        {
            return;
        }

        rect(x, y, w, h);
    }

    static rectCorner( tl: vec2, span: vec2 ): void
    {
        Ren.rectCornerXY(tl.x, tl.y, span.x, span.y);
    }

    static rectCorners( tl: vec2, br: vec2 ): void
    {
        rect(tl.x, tl.y, br.x, br.y);
    }

    static rectRotated( x: number, y: number, w: number, h: number, A: vec2, B: vec2 )
    {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y-A.y, B.x-A.x);

        push();
            translate(A.x, A.y);
            rotate(theta);
            rect(x, y, w, h);
        pop();
    }

    static imageRotated( img: Image, x: number, y: number, w: number, h: number, A: vec2, B: vec2 )
    {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y-A.y, B.x-A.x);

        push();
            translate(A.x, A.y);
            rotate(theta);
            image(img, x, y, w, h);
        pop();
    }

}


Ren = Render;