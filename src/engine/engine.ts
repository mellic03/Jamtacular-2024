import System from "./system.js";
import sys_Render from "./sys-render.js";
import sys_Event from "./sys-event.js";
import sys_Audio from "./sys-audio.js";
import sys_Image from "./sys-image.js";
import sys_Noise from "./sys-noise.js";
import sys_Particle from "./sys-particle.js";
import Scene from "./scene.js";
import sys_World from "./sys-world.js";
import { math } from "./math/math.js";
import sys_Physics from "./sys-physics.js";
import { IO } from "./IO.js";


export class Engine
{
    private systems = new Array<System>;
    private scenes  = new Array<Scene>;
    private lookup  = new Map<string, number>;
    private dt      = 1.0 / 60.0;
    private fps     = 60.0;

    init( res_x, res_y )
    {
        this.addSystem(new sys_Render(res_x, res_y));
        this.addSystem(new sys_Audio);
        this.addSystem(new sys_Image);
        this.addSystem(new sys_Event);
        this.addSystem(new sys_Noise);
        this.addSystem(new sys_Particle);
        this.addSystem(new sys_Physics);
        this.addSystem(new sys_World);
    }

    dtime(): number
    {
        return this.dt / 1000.0;
    }

    avgFPS(): number
    {
        return this.fps;
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

    addScene( scene: Scene ): void
    {
        this.addSystem(scene);
    }

    getScene<T extends Scene>( scene_type: { new(): T }): T
    {
        const idx = this.lookup.get(scene_type.name);
        return this.systems[idx] as T;
    }

    preload()
    {
        console.log(`[Engine.preload]`);

        for (let system of this.systems)
        {
            system.preload(this);
        }
    }
 
    setup()
    {
        console.log(`[Engine.setup]`);

        for (let system of this.systems)
        {
            system.setup(this);
        }
    }

    draw(): void
    {
        this.dt  = deltaTime;
        this.fps = math.mix(this.fps, frameRate(), 1.0/60.0);

        IO.update();

        for (let system of this.systems)
        {
            system.update(this);
        }
    }
}



export const __engine = new Engine();

