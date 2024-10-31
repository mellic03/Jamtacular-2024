import { __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import Render from "../../engine/sys-render.js";
import { RootScene } from "../game.js";
import { RigidBodyCharacter } from "./character.js";
import { iCharacterController } from "./controller.js";
import CharacterFloatingType from "./floating-type.js";

enum State {
    Idle,
    BackingUp,
    Charging
};

export default class FloatingController implements iCharacterController
{
    private state = State.Idle;
    private timer = 0.0;


    idle( C: CharacterFloatingType )
    {
        const dt     = deltaTime / 1000.0;
        const player = RootScene.player;
        const dist   = C.world.pos.dist(player.world.pos);

        C.aggression *= 0.999;

        if (dist <= 512)
        {
            this.state = State.BackingUp;
            this.timer = 0.0;
        }
    }


    backingUp( C: CharacterFloatingType )
    {
        const dt     = deltaTime / 1000.0;
        const player = RootScene.player;
        const dir    = vec2.tmp().displacement(player.world.pos, C.world.pos).normalize();

        C.aggression = 1;
        // C.aggression = math.clamp(C.aggression * 1.5, 0, 1);
        C.move(0.65*dir.x, 0.65*dir.y);

        this.timer += dt;

        if (this.timer >= 2.0)
        {
            C.aggression = 0.1;
            this.state = State.Charging;
            this.timer = 0.0;
        }
    }


    charging( C: CharacterFloatingType )
    {
        const dt     = deltaTime / 1000.0;
        const player = RootScene.player;
        const dir    = vec2.tmp().displacement(player.world.pos, C.world.pos).normalize();

        C.aggression = 1;
        // C.aggression = math.clamp(C.aggression * 1.5, 0, 1);
        // C.move(-2*dir.x, -2*dir.y);
        const dist = C.world.pos.dist(player.world.pos);

        C.moveTo(player.world.pos.x, player.world.pos.y);

        this.timer += dt;

        if (this.timer >= 4.0)
        {
            this.state = State.Idle;
            this.timer = 0.0;
        }
    }



    update( C: CharacterFloatingType )
    {
        switch (this.state)
        {
            case State.Idle:      this.idle(C);      break;
            case State.BackingUp: this.backingUp(C); break;
            case State.Charging:  this.charging(C);  break;
        }
    }

}
