import Actor from "./gameobject/actor.js";
import idk_Camera from "./gameobject/camera.js";
import GameState from "./gamestate/gamestate.js";
import RenderEngine from "./render/renderengine.js";
import EventManager from "./event.js";
import { IO } from "./IO.js";
import JtSystem from "./system/system.js";
import { NoiseSystem } from "./noise/noisesystem.js";


export const EventFlag = {
    UPDATE: 1,
    DRAW:   2
};


export default class Engine
{
    private systems = new Array<JtSystem>;

    public ren: RenderEngine;
    public event: EventManager<number>;
    private gamestate: GameState;
    root: Actor;

    constructor( res_x, res_y )
    {
        this.ren   = new RenderEngine(res_x, res_y, true);
        this.event = new EventManager();
        this.gamestate = new GameState(this, "rootstate", null);
        this.root  = new Actor(0, 0, 0);

        this.addSystem(NoiseSystem);
    }

    addSystem( system: JtSystem )
    {
        this.systems.push(system);
    }

    preload()
    {
        this.ren.preload();

        for (let system of this.systems)
        {
            system.preload();
        }
    }
 
    setup()
    {
        this.ren.setup();

        for (let system of this.systems)
        {
            system.setup();
        }
    }

    update(): void
    {
        this.event.emit(EventFlag.UPDATE, null);

        this.ren.update();
        IO.update();
        this.gamestate.update();

        for (let system of this.systems)
        {
            system.update();
        }
    }

    addActor<T extends Actor>( obj ): T
    {
        this.root.giveChild(obj);
        return obj as T;
    }

    getRootState(): GameState
    {
        return this.gamestate;
    }

    draw( cam: idk_Camera ): void
    {
        this.gamestate.draw(this.ren, cam);
    }
}

