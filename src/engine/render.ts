import vec2 from "./math/vec2.js";
import { Engine } from "./engine.js";
import { Graphics, Image } from "p5";
import { math } from "./math/math.js";
import GeometryTest from "./math/geometry.js";
import { EventEmitter } from "./sys-event.js";


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

export enum RenderEvent
{
    WINDOW_RESIZE = 1
};


export default class RenderEngine extends EventEmitter<RenderEvent>
{
    private bg_color = [200, 200, 200, 255];

    public  view  = new vec2(0, 0);
    public  width:  number;
    public  height: number;
    public  span  = new vec2(0, 0);
    public  tl    = new vec2(0, 0);
    public  br    = new vec2(0, 0);
    public  webgl = false;
    private canvas: any;

    scale   = 1.0;

    mouse_screen = new vec2(0, 0);
    mouse_world  = new vec2(0, 0);

    private offline_ctx: Graphics;
    private font: any;

    init( width, height )
    {
        this.width  = width;
        this.height = height;
        this.span.setXY(width, height);
    }

    preload(): void
    {
        this.font = loadFont("assets/font/RodettaStamp.ttf");
        
        window.windowResized = () => {
            this.emit(
                RenderEvent.WINDOW_RESIZE,
                windowWidth-32,
                windowHeight-32
            );
        };
    }

    setup(): void
    {
        if (this.webgl == false)
        {
            this.canvas = createCanvas(this.width, this.height);
            this.offline_ctx = createGraphics(this.width, this.height);
        }

        else
        {
            this.canvas = createCanvas(this.width, this.height, WEBGL);
            this.offline_ctx = createGraphics(this.width, this.height, WEBGL);
            textFont(this.font);
        }
    }


    resize( w: number, h: number ): void
    {
        this.width  = w;
        this.height = h;
        this.span.setXY(w, h);
        resizeCanvas(w, h);
    }


    beginFrame(): void
    {
        this.mouse_screen.setXY(mouseX, mouseY);
        this.mouse_world.copy(this.screenToWorld(this.mouse_screen));

        this.span.setXY(this.width, this.height);
        this.tl.copy(this.view).addMul(this.span, -0.5);
        this.br.copy(this.view).addMul(this.span, +0.5);

        push();

        if (this.webgl == false)
        {
            translate(+this.width/2, +this.height/2, 0);
        }

        scale(this.scale);
        translate(-this.view.x, -this.view.y, 0);
        background(...this.bg_color);

    }

    endFrame(): void
    {
        pop();
        // translate(+this.view.x, +this.view.y, 0);
        // scale(1.0 / this.scale);
    }




    getOfflineContext(): Graphics
    {
        return this.offline_ctx;
    }

    setBackground( r: number, g: number, b: number, a: number ): void
    {
        this.bg_color = [r, g, b, a];
    }

    screenToWorld( screen: vec2 ): vec2
    {
        return vec2.copy(screen).subMul(this.span, 0.5).divXY(this.scale).add(this.view);
    }

    worldToScreen( world: vec2 ): vec2
    {
        return vec2.copy(world).sub(this.view).mulXY(this.scale).addMul(this.span, 0.5);
    }

    screenMouse(): vec2
    {
        return vec2.copy(this.mouse_screen);
    }

    worldMouse(): vec2
    {
        return vec2.copy(this.mouse_world);
    }


    pushInverseViewTransform(): void
    {
        push();
        translate(+this.view.x, +this.view.y, 0);
        scale(1.0 / this.scale);
    
        if (this.webgl == false)
        {
            translate(-this.width/2, -this.height/2, 0);
        }
    }

    popInverseViewTransform(): void
    {
        pop();
    }

    screenText( label: string, x: number, y: number ): void
    {
        this.pushInverseViewTransform();
        text(label, x, y);
        this.popInverseViewTransform();
    }

    worldText( label: string, x: number, y: number ): void
    {
        text(label, x, y);
    }


    rectInView( x: number, y: number, w: number, h: number ): boolean
    {
        const vx = this.view.x;
        const vy = this.view.y;
        const hw = (0.5 * this.width) / this.scale;
        const hh = (0.5 * this.height) / this.scale;

        const c0 = (vx-hw < x+w) && (vx+hw > x);
        const c1 = (vy-hh < y+h) && (vy+hh > y);

        return (c0 && c1);
    }

    rectCenter( pos: vec2, span: vec2 ): void
    {
        rect(pos.x-span.x/2, pos.y-span.x/2, pos.x+span.x/2, pos.y + span.y/2);
    }

    rectCornerXY( x, y, w, h ): void
    {
        const x0 = (x - this.view.x) * this.scale + (this.width/2);
        const y0 = (y - this.view.y) * this.scale + (this.height/2);
        const w0 = w * this.scale;
        const h0 = h * this.scale;

        if (!GTest.RectRectOverlap(x0, y0, w0, h0, 0, 0, this.width, this.height))
        {
            return;
        }

        rect(x, y, w, h);
    }

    rectCorner( tl: vec2, span: vec2 ): void
    {
        this.rectCornerXY(tl.x, tl.y, span.x, span.y);
    }

    rectCorners( tl: vec2, br: vec2 ): void
    {
        rect(tl.x, tl.y, br.x, br.y);
    }

    rectRotated( x: number, y: number, w: number, h: number, A: vec2, B: vec2 )
    {
        vec2.tmp().displacement(A, B);
        const theta = atan2(B.y-A.y, B.x-A.x);

        push();
            translate(A.x, A.y);
            rotate(theta);
            rect(x, y, w, h);
        pop();
    }


    imageCornerXY( img: Image, x, y, w, h ): void
    {
        const x0 = (x - this.view.x) * this.scale + (this.width/2);
        const y0 = (y - this.view.y) * this.scale + (this.height/2);
        const w0 = w * this.scale;
        const h0 = h * this.scale;

        if (!GTest.RectRectOverlap(x0, y0, w0, h0, 0, 0, this.width, this.height))
        {
            return;
        }

        image(img, x, y, w, h);
    }


    imageRotated( img: Image, x: number, y: number, w: number, h: number, A: vec2, B: vec2 )
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

export const Render = new RenderEngine();

