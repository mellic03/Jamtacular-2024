import { Engine, __engine } from "../engine.js";
import vec2 from "../math/vec2.js";


export default class StaticBody
{
    private static id_count = 0;

    id:     number;
    sprite: Sprite;
    tl:     vec2;
    br:     vec2;
    center: vec2;
    span:   vec2;
    hspan:  vec2;

    constructor( x: number, y: number, w: number, h=w, color=[50, 50, 50, 255] )
    {
        this.id     = StaticBody.id_count++;
        this.tl     = new vec2(x, y);
        this.br     = new vec2(x, y).addXY(w, h);
        this.center = new vec2(x, y).addXY(w/2, h/2);
        this.span   = new vec2(w, h);
        this.hspan  = new vec2(w, y).divXY(2);

        this.sprite = new Sprite(this.center.x, this.center.y);
        this.sprite.static = true;
        this.sprite.width  = w;
        this.sprite.height = h;
    
        this.sprite.color.setRed(color[0]);
        this.sprite.color.setGreen(color[1]);
        this.sprite.color.setBlue(color[2]);
        this.sprite.color.setAlpha(color[3]);
    }

    draw( engine: Engine )
    {
        this.sprite.draw();
        // rect(this.center.x, this.center.y, this.span.x, this.span.y);
    }
}
