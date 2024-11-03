// import Actor from "../../engine/actor.js";
// import { Engine }
// import { EventEmitting } from "../../engine/sys-event.js";
// import { RigidBodyCharacter } from "../character/character.js";
// import BodyPartLeg, { LegParams } from "./leg.js";



// export default abstract class LegController
// {
//     parent: RigidBodyCharacter;
//     params: LegParams;
//     legs:   Array<BodyPartLeg>;

//     constructor( parent: RigidBodyCharacter )
//     {
//         this.parent = parent;
//         this.params = new LegParams();
//         this.legs   = [];
//     }

//     update()
//     {
//         for (let L of this.legs)
//         {
//             L.transform.mult(this.parent.transform);
//             L.update();
//         }
//     }

//     draw()
//     {
//         if (this.legs[0].direction == -1)
//         {
//             this.legs[0].draw();
//             this.legs[1].draw();
//         }

//         else
//         {
//             this.legs[1].draw();
//             this.legs[0].draw();
//         }
//     }

//     setParams( params: LegParams ): void
//     {
//         for (let L of this.legs)
//         {
//             L.params = params;
//         }
//     }

//     addLeg( leg: BodyPartLeg )
//     {
//         this.legs.push(leg);
//     }

//     setRestHeight( height: number )
//     {
//         for (let leg of this.legs)
//         {
//             leg.params.rest_height = height;
//         }
//     }

//     setDirection( dir: number )
//     {
//         for (let leg of this.legs)
//         {
//             leg.direction = Math.sign(dir);
//         }
//     }

// }

