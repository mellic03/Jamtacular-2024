import System from "./system.js";
import sys_Audio from "./sys-audio.js";
import sys_Image from "./sys-image.js";
import sys_Particle from "./sys-particle.js";
import { math } from "./math/math.js";
import BasedAnimation from "./animation.js";
import { Render } from "./render.js";
import { IO } from "./IO.js";
import { StateManager } from "./gamestate.js";


export interface iSystem
{
    preload(): void;
    setup():   void;
    update():  void;
    draw():    void;

}

class Engine_Internal
{
    private isystems = new Array<iSystem>;
    private systems  = new Array<System>;

    private lookup  = new Map<string, number>;
    private dt      = 1.0 / 60.0;
    private current_fps = 60.0;
    private target_fps  = 60.0;

    init( res_x: number, res_y: number, fps: number )
    {
        this.target_fps = fps;
        Render.init(res_x, res_y);

        this.addiSystem(StateManager);
        this.addiSystem(IO);
        this.addSystem(new sys_Audio);
        this.addSystem(new sys_Image);
        // this.addSystem(new sys_Noise);
        this.addSystem(new sys_Particle);
        // this.addSystem(new sys_Physics);
        // this.addSystem(new sys_World);
    }

    dtime(): number
    {
        return this.dt / 1000.0;
    }

    avgFPS(): number
    {
        return this.current_fps;
    }

    addSystem( system: System )
    {
        console.log(`[Engine.addSystem] ${system.constructor.name}`);

        this.systems.push(system);
        this.lookup.set(system.constructor.name, this.systems.length-1);
    }

    getSystem<T extends System>( sys_type: { new(): T }): T
    {
        const idx = this.lookup.get(sys_type.name);
        return this.systems[idx] as T;
    }

    addiSystem( sys: iSystem )
    {
        console.log(`[Engine.addiSystem] ${sys.constructor.name}`);
        this.isystems.push(sys);
        this.lookup.set(sys.constructor.name, this.isystems.length-1);
    }


    preload()
    {
        Render.preload();

        for (let sys of this.isystems)
        {
            sys.preload();
        }

        for (let system of this.systems)
        {
            system.preload();
        }
    }
 
    setup()
    {
        frameRate(this.target_fps);
        Render.setup();

        for (let sys of this.isystems)
        {
            sys.setup();
        }

        for (let system of this.systems)
        {
            system.setup();
        }
    }

    draw(): void
    {
        for (let sys of this.isystems)
        {
            sys.update();
        }

        this.dt  = deltaTime;
        this.current_fps = math.mix(this.current_fps, frameRate(), 1.0/8.0);

        Render.beginFrame();

        BasedAnimation.update();

        for (let system of this.systems)
        {
            system.update();
        }

        for (let sys of this.isystems)
        {
            sys.draw();
        }

        Render.endFrame();
    }
}


export const Engine = new Engine_Internal();

