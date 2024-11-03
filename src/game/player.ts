// import { RigidBodyCharacter } from "./character/character.js";
// import { Engine }
// import BodyPartHead from "./bodypart/head.js";
// import sys_Image from "../engine/sys-image.js";
// import { Image } from "p5";
// import Rope from "../engine/physics/rope.js";
// import sys_Physics from "../engine/sys-physics.js";
// import CharacterController from "./character/controller.js";
// import BodyPart from "./bodypart/bodypart.js";
// import { Render } from "../engine/render.js";



// export default class Player extends RigidBodyCharacter
// {
//     head:          BodyPartHead;
//     legcontroller: LegControllerBiped;

//     // rope: Rope;

//     hi_height = 0.999;
//     lo_height = 0.4;

//     heightfactor: number = 0;
//     yoffset: number = 0;
//     roffset: number = 0;

//     img_body: Image;

//     constructor( x: number, y: number, controller: CharacterController )
//     {
//         super(x, y, controller);

//         this.sprite.shape = "circle";
//         this.sprite.gravityScale = 0;
//         this.sprite.autoDraw = true;
//         this.drag = 0.8;

//         const group = sys_Physics.GROUP_ROPES;
//         // this.rope = new Rope(group, this.transform, x, y, 8, 64, 8, -1);

//         const img = Engine.getSystem(sys_Image);
//         this.img_body = img.get("assets/img/heart-red.png");

//         this.head = new BodyPartHead(0, -48, img.get("assets/img/michael.png"));
//         this.addPart(this.head);

//         this.legcontroller = new LegControllerBiped(this);
//         // this.addLegController(this.legcontroller);

//         // this.addArm(new BodyPartArm(-18, -8, -0, 0.0, [35, 40]));
//         // this.addArm(new BodyPartArm(+18, -8, +0, 0.2, [35, 40]));
//     }

//     update()
//     {
//         super.update();

//         this.controller.update(engine, this);

//         this.head.transform.mult(this.transform);
//         this.legcontroller.update();

//         this.legcontroller.legs[0].transform.parent = this.transform;
//         this.legcontroller.legs[1].transform.parent = this.transform;

//         Render.view.mixXY(this.x, this.y, 0.01);

//         // this.rlocal = 0.2 * (this.vel.x / this.max_vel);
//     }

//     draw()
//     {
//         imageMode(CENTER);
//         this.head.draw();

//         if (this.legcontroller.legs[0].direction == -1)
//         {
//             // this.arms[0].draw();
//             this.legcontroller.legs[0].draw();

//             imageMode(CENTER);
//             image(this.img_body, this.x, this.y, 48, 48);

//             this.legcontroller.legs[1].draw();
//             // this.arms[1].draw();
//         }

//         else
//         {
//             // this.arms[1].draw();
//             this.legcontroller.legs[1].draw();

//             imageMode(CENTER);
//             image(this.img_body, this.x, this.y, 48, 48);
    
//             this.legcontroller.legs[0].draw();
//             // this.arms[0].draw();
//         }
    
//     }

//     move( x: number, y: number ): void
//     {
//         super.move(64*x, 64*y);
//     }

// }


