import { Engine, __engine } from "./engine.js";
import BasedCollisionGroup from "./physics/group.js";
import System from "./system.js";


export default class sys_Physics extends System
{
    cringegroups: Map<string, Group>;
    basedgroups:  Map<string, BasedCollisionGroup>;

    static GROUP_WORLD:      Group;
    static GROUP_ROPES:      Group;
    static GROUP_CHARACTER:  Group;
    static GROUP_PLAYER:     Group;
    static GROUP_PROJECTILE: Group;

    static GROUP_ANGRY: Group;
    static GROUP_CALM:  Group;

    
    static GROUP_BASED_WORLD:  BasedCollisionGroup;
    static GROUP_BASED_ROPES:  BasedCollisionGroup;
    static GROUP_BASED_PLAYER: BasedCollisionGroup;


    constructor()
    {
        super();

        this.cringegroups = new Map<string, Group>();
        this.basedgroups  = new Map<string, BasedCollisionGroup>();
    }

    addGroup( name: string, group: Group ): Group
    {
        this.cringegroups.set(name, group);
        return group;
    }

    getGroup( name: string ): Group
    {
        return this.cringegroups.get(name);
    }

    addBasedGroup( name: string, group: BasedCollisionGroup ): BasedCollisionGroup
    {
        this.basedgroups.set(name, group);
        return group;
    }

    getBasedGroup( name: string ): BasedCollisionGroup
    {
        return this.basedgroups.get(name);
    }

    preload( engine: Engine ): void
    {
        sys_Physics.GROUP_WORLD      = new Group();
        sys_Physics.GROUP_ROPES      = new Group();
        sys_Physics.GROUP_CHARACTER  = new Group();
        sys_Physics.GROUP_PLAYER     = new Group();
        sys_Physics.GROUP_PROJECTILE = new Group();

        sys_Physics.GROUP_ANGRY = new Group();
        sys_Physics.GROUP_CALM  = new Group();

        // sys_Physics.GROUP_PLAYER.collides(sys_Physics.GROUP_WORLD, (A: Sprite, B: Sprite) => {
        //     // circle(A._collisions[0][0], A._collisions[0], 50);
        // })


        sys_Physics.GROUP_ROPES.overlaps(sys_Physics.GROUP_ROPES);
        sys_Physics.GROUP_PLAYER.overlaps(sys_Physics.GROUP_ROPES);

        // sys_Physics.GROUP_BASED_WORLD = new BasedCollisionGroup(0, 0);
        // sys_Physics.GROUP_BASED_ROPES = new BasedCollisionGroup(0, 0);
        // sys_Physics.GROUP_BASED_PLAYER = new BasedCollisionGroup(0, 0);

        // sys_Physics.GROUP_BASED_ROPES.collideWith(sys_Physics.GROUP_BASED_WORLD);
        // sys_Physics.GROUP_BASED_PLAYER.collideWith(sys_Physics.GROUP_BASED_ROPES);

        // this.addBasedGroup("world",  sys_Physics.GROUP_BASED_WORLD);
        // this.addBasedGroup("ropes",  sys_Physics.GROUP_BASED_ROPES);
        // this.addBasedGroup("player", sys_Physics.GROUP_BASED_PLAYER);
    }
    
    setup( engine: Engine ): void
    {

    }

    update( engine: Engine ): void
    {
        for (let [name, group] of this.basedgroups)
        {
            group.update(engine);
        }
    }

}

