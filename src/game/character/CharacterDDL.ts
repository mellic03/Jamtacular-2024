import { Engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import { WorldQueryResult } from "../../engine/sys-world/query.js";
import { CharacterController } from "../controller/controller.js";
import { Game } from "../game.js";
import { GS_Gameplay } from "../state/gameplay.js";
import { GS_World } from "../state/world.js";
import CharacterFloating from "./CharacterFloating.js";




export default class CharacterDDL extends CharacterFloating
{
    grabpoints = new Array<vec2>();
    grabbiness = 0;

    constructor( x: number, y: number, ropegroup: Group, controller?: CharacterController )
    {
        super(x, y, ropegroup, controller);

        for (let T of this.tentacles)
        {
            this.grabpoints.push(new vec2(0, 0));
        }
            
    }


    update()
    {
        super.update();

        this.grabbiness = 0;



        if (IO.keyTapped(KEYCODE.R))
        {
            for (let i=0; i<this.tentacles.length; i++)
            {
                this.grabpoints[i].setXY(0, 0);
            }
        }

        for (let i=0; i<this.tentacles.length; i++)
        {
            const T   = this.tentacles[i];
            const pos = vec2.tmp(T.hand.x, T.hand.y);
            const dir = vec2.copy(this.vel).add(vec2.tmp().rand(-0.25, +0.25));

            if (this.grabpoints[i].x == 0 && this.grabpoints[i].x == 0)
            {
                const T = this.tentacles[i];

                if (GS_World.raycast(this.world.x, this.world.y, dir.x, dir.y))
                {
                    const hit = WorldQueryResult.hit;
                    if (vec2.copy(hit).subXY(T.hand.x, T.hand.y).magSq() < 256*256)
                    {

                    }
                    this.grabpoints[i].copy(hit);
                }
            }
        }

        for (let i=0; i<this.tentacles.length; i++)
        {
            const T   = this.tentacles[i];
            const pos = vec2.tmp(T.hand.x, T.hand.y);

            if (pos.distSq(this.grabpoints[i]) < 32)
            {
                this.grabbiness += 1;
            }
        
            else
            {
                const dx = Math.max(this.grabpoints[i].x - pos.x, 8);
                const dy = Math.max(this.grabpoints[i].y - pos.y, 8);
                T.hand.applyForce(dx, dy);
            }
        }
        
    }


    draw()
    {
        super.draw();

    }


    move( x: number, y: number ): void
    {
        super.move(x, y);
    }


    interact( x: number, y: number, msg?: string ): void
    {
        const dir = vec2.tmp(x, y).sub(this.world.pos).normalize();

    }

}

