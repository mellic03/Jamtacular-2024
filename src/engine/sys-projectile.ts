// import BasedAnimation from "./animation.js";
// import { Engine, __engine } from "./engine.js";
// import vec2 from "./math/vec2.js";
// import BasedRigidBody from "./physics/rigidbody-based.js";
// import sys_Physics from "./sys-physics.js";



// export class Projectile
// {
//     pos: vec2;
//     vel: vec2;
//     img: BasedAnimation;
//     fn:  Function;

//     reset( x: number, y: number, vx: number, vy: number, img: BasedAnimation=null, callback: Function=null )
//     {
//         this.pos = new vec2(x, y);
//         this.vel = new vec2(vx, vy);
//         this.img = img;
//         this.fn  = callback;
//     }
// }



// export default class ProjectileManager
// {
//     static buffer_idx  = 0;
//     static buffer_size = 256;
//     static projectiles = new Array<Projectile>();


//     static setup(): void
//     {
//         for (let i=0; i<ProjectileManager.buffer_size; i++)
//         {
//             ProjectileManager.projectiles.push(new Projectile());
//             ProjectileManager.createProjectile(-2000, -2000, 0, 0, null);
//         }
//     }


//     static update(): void
//     {
//         const dt  = deltaTime / 1000.0;
//         const hit = vec2.tmp();

//         for (let i=0; i<ProjectileManager.buffer_idx; i++)
//         {
//             const p = ProjectileManager.projectiles[i];
//                   p.vel.addXY(0.0, 9.8);
//                   p.pos.addMul(p.vel, dt);

//             // if (sys_Physics.GROUP_BASED_WORLD.sphere_collides(p.pos, 20, hit))
//             // {
//             //     if (p.fn != null) { p.fn(hit, p.vel); }
//             //     ProjectileManager.deleteProjectile(i);
//             // }

//             if (p.pos.x < -99999 || p.pos.x > +99999 || p.pos.y < -99999 || p.pos.y > +99999)
//             {
//                 ProjectileManager.deleteProjectile(i);
//             }
//         }

//     }

//     static draw(): void
//     {
//         for (let i=0; i<ProjectileManager.buffer_idx; i++)
//         {
//             const p = ProjectileManager.projectiles[i];

//             if (p.img != null)
//             {
//                 p.img.pos.copy(p.pos);
//                 p.img.rotation = p.vel.angle();
//                 p.img.draw();
//             }

//             circle(p.pos.x, p.pos.y, 20);
//         }
//     }


//     static deleteProjectile( idx: number ): void
//     {
//         const len = ProjectileManager.buffer_idx;
//         const tmp = ProjectileManager.projectiles[idx];

//         ProjectileManager.projectiles[idx]   = ProjectileManager.projectiles[len-1];
//         ProjectileManager.projectiles[len-1] = tmp;
//         ProjectileManager.buffer_idx -= 1;
//     }


//     static createProjectile( x: number, y: number, vx: number, vy: number,
//                              img: BasedAnimation=null, callback: Function=null ): void
//     {
//         const idx = ProjectileManager.buffer_idx;
//         ProjectileManager.buffer_idx = (ProjectileManager.buffer_idx + 1) % ProjectileManager.buffer_size;

//         ProjectileManager.projectiles[idx].reset(x, y, vx, vy, img, callback);
//     }

// }

