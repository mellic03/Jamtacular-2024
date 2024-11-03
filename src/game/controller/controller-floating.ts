import { Engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import { GS_Gameplay } from "../state/gameplay.js";
import { CharacterController } from "./controller.js";
import CharacterFloating from "../character/CharacterFloating.js";

enum State {
    Idle,
    BackingUp,
    Charging
};

export default class FloatingController extends CharacterController
{
    private state = State.Idle;
    private timer = 0.0;


    idle( C: CharacterFloating )
    {
        const dt     = deltaTime / 1000.0;
        const player = GS_Gameplay.player;
        const dist   = C.world.pos.dist(player.world.pos);

        C.aggression *= 0.999;

        if (dist <= 512)
        {
            this.state = State.BackingUp;
            this.timer = 0.0;
        }
    }


    backingUp( C: CharacterFloating )
    {
        const dt     = deltaTime / 1000.0;
        const player = GS_Gameplay.player;
        const dir    = vec2.tmp().displacement(player.world.pos, C.world.pos).normalize();

        C.aggression = 1;
        C.move(0.65*dir.x, 0.65*dir.y);

        this.timer += dt;

        if (this.timer >= 2.0)
        {
            C.aggression = 0.1;
            this.state = State.Charging;
            this.timer = 0.0;
        }
    }


    charging( C: CharacterFloating )
    {
        const dt     = deltaTime / 1000.0;
        const player = GS_Gameplay.player;
        const dir    = vec2.tmp().displacement(player.world.pos, C.world.pos).normalize();

        C.aggression = 1;
        const dist = C.world.pos.dist(player.world.pos);

        C.moveTo(player.world.pos.x, player.world.pos.y);

        this.timer += dt;

        if (this.timer >= 4.0)
        {
            this.state = State.Idle;
            this.timer = 0.0;
        }
    }



    update( C: CharacterFloating )
    {
        if (this.is_good == false)
        {
            return;
        }

        switch (this.state)
        {
            case State.Idle:      this.idle(C);      break;
            case State.BackingUp: this.backingUp(C); break;
            case State.Charging:  this.charging(C);  break;
        }
    }

}
