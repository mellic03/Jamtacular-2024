import { Engine, __engine } from "./engine.js";
import CollisionGroup from "./physics/group.js";
import System from "./system.js";


export default class sys_Physics extends System
{
    groups: Map<string, CollisionGroup>;

    constructor()
    {
        super();

        this.groups = new Map<string, CollisionGroup>();
    }

    createGroup( name: string, group: CollisionGroup ): CollisionGroup
    {
        this.groups.set(name, group);
        return group;
    }

    getGroup( name: string ): CollisionGroup
    {
        return this.groups.get(name);
    }

    preload( engine: Engine ): void
    {
        
    }
    
    setup( engine: Engine ): void
    {

    }

    update( engine: Engine ): void
    {
        for (let [name, group] of this.groups)
        {
            group.update(engine);
        }
    }

}

