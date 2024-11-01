import { __engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import { GS_Gameplay } from "../state/gameplay/gameplay.js";
import { iCharacterController } from "./controller.js";
import CharacterFloating from "../character/CharacterFloating.js";

enum State {
    Idle,
    BackingUp,
    Charging
};

export default class FloatingController implements iCharacterController
{
    private state = State.Idle;
    private timer = 0.0;


    idle( C: CharacterFloating )
    {
        // const dt     = deltaTime / 1000.0;
        // const player = GS_Gameplay.player;
        // const dist   = C.world.pos.dist(player.world.pos);

        // C.aggression *= 0.999;

        // if (dist <= 512)
        // {
        //     this.state = State.BackingUp;
        //     this.timer = 0.0;
        // }
    }


    backingUp( C: CharacterFloating )
    {
        // const dt     = deltaTime / 1000.0;
        // const player = GS_Gameplay.player;
        // const dir    = vec2.tmp().displacement(player.world.pos, C.world.pos).normalize();

        // C.aggression = 1;
        // // C.aggression = math.clamp(C.aggression * 1.5, 0, 1);
        // C.move(0.65*dir.x, 0.65*dir.y);

        // this.timer += dt;

        // if (this.timer >= 2.0)
        // {
        //     C.aggression = 0.1;
        //     this.state = State.Charging;
        //     this.timer = 0.0;
        // }
    }


    charging( C: CharacterFloating )
    {
        // const dt     = deltaTime / 1000.0;
        // const player = GS_Gameplay.player;
        // const dir    = vec2.tmp().displacement(player.world.pos, C.world.pos).normalize();

        // C.aggression = 1;
        // // C.aggression = math.clamp(C.aggression * 1.5, 0, 1);
        // // C.move(-2*dir.x, -2*dir.y);
        // const dist = C.world.pos.dist(player.world.pos);

        // C.moveTo(player.world.pos.x, player.world.pos.y);

        // this.timer += dt;

        // if (this.timer >= 4.0)
        // {
        //     this.state = State.Idle;
        //     this.timer = 0.0;
        // }
    }



    update( C: CharacterFloating )
    {
        // switch (this.state)
        // {
        //     case State.Idle:      this.idle(C);      break;
        //     case State.BackingUp: this.backingUp(C); break;
        //     case State.Charging:  this.charging(C);  break;
        // }
    }

}
