export default class ui_Bounds {
    constructor(xmin, xmax, ymin, ymax) {
        this.fromMinMax(xmin, xmax, ymin, ymax);
    }
    fromMinMax(xmin, xmax, ymin, ymax) {
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }
    fromCenterSpan(cx, cy, w, h) {
        this.xmin = cx - w / 2;
        this.xmax = cx + w / 2;
        this.ymin = cy - h / 2;
        this.ymax = cy + h / 2;
    }
    copy(b) {
        this.xmin = b.xmin;
        this.xmax = b.xmax;
        this.ymin = b.ymin;
        this.ymax = b.ymax;
    }
}
//# sourceMappingURL=bounds.js.map