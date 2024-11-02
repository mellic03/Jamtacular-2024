import vec2 from "../math/vec2.js";
class BasedStaticBody {
    constructor(x, y, w, h = w, color = [50, 50, 50, 255]) {
        this.id = BasedStaticBody.id_count++;
        this.tl = new vec2(x, y);
        this.br = new vec2(x, y).addXY(w, h);
        this.center = new vec2(x, y).addXY(w / 2, h / 2);
        this.span = new vec2(w, h);
        this.hspan = new vec2(w, y).divXY(2);
    }
    draw() {
        rect(this.tl.x, this.tl.y, this.span.x, this.span.y);
    }
}
BasedStaticBody.id_count = 0;
export default BasedStaticBody;
//# sourceMappingURL=staticbody-based.js.map