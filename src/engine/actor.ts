// import { BaseActor } from "./actor-base.js";
// import { SomeObject } from "./actor-SomeObject.js";


// export class Actor extends BaseActor
// {
//     private instance: any; // Actual SomeObject.Actor instance

//     // Private constructor to prevent direct instantiation
//     private constructor(actorInstance: any)
//     {
//         super(); // Call the parent constructor
//         this.instance = actorInstance; // Store the actor instance
//     }

//     // Static factory method to create an Actor instance
//     static async create(x: number, y: number, w: number, h: number): Promise<Actor>
//     {
//         const ActorClass = await BaseActor.initialize(); // Wait for SomeObject.Actor to be ready
//         const instance = new ActorClass(x, y, w, h); // Create the instance of SomeObject.Actor
//         return new Actor(instance); // Return a new Actor wrapping the instance
//     }

//     updateSelf()
//     {

//     }

//     drawSelf()
//     {

//     }
// }