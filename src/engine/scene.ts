import Actor from "./actor.js";
import { Engine, __engine } from "./engine.js";
import System from "./system.js";


export default class Scene extends System
{
    private actors = [];

    constructor()
    {
        super();

        // const og_update = this.update;

        // this.update = () => {
        //   Scene.prototype.update.apply(this);
        //   return og_update.apply(this);
        // };
    }

    addActor( A: Actor ): void
    {
        this.actors.push(A);
    }

    preload( engine: Engine ): void
    {
        
    }

    setup( engine: Engine ): void
    {

    }

    private update_actor( engine: Engine, A: Actor )
    {
        A.update(engine);
        A.draw(engine);

        for (let child of A.children)
        {
            this.update_actor(engine, child);
        }
    }

    update( engine: Engine ): void
    {
        for (let A of this.actors)
        {
            A.transform.ForwardKinematics();
        }

        for (let A of this.actors)
        {
            this.update_actor(engine, A);
        }
    }
    
}

