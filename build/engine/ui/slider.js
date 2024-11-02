export {};
// export default class ui_Slider extends ui_Label
// {
//     public slider;
//     private callback: Function;
//     constructor( callback: Function )
//     {
//         super("");
//         this.slider = createSlider(0, 1, 0, 1/120);
//         this.slider.input(() => {
//             this.callback(this.slider.value());
//         });
//     }
//     update( bounds: ui_Bounds )
//     {
//         super.update(bounds);
//         this.slider.position(512, 512);
//     }
//     draw( depth: number = 0.0 )
//     {
//         rectMode(CORNERS);
//         textAlign(CENTER, CENTER);
//         textSize(24);
//         stroke(0);
//         super.draw(depth);
//         fill(this.style.fg);
//         text(this.label, 0.5*(this.xmin+this.xmax), 0.5*(this.ymin+this.ymax));
//     }
// }
//# sourceMappingURL=slider.js.map