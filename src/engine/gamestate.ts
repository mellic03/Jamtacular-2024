import { iRenderable, iTransformable, iUpdatable } from "./interface";


export class SceneManager
{
    private static scenes = new Array<GameScene>();
    private static lookup = new Map<string, number>();
    private static active = new Set<GameScene>();

    public static addScene( scene: GameScene ): GameScene
    {
        SceneManager.scenes.push(scene);
        SceneManager.lookup.set(scene.constructor.name, this.scenes.length-1);
        return scene;
    }

    public static getScene<T extends GameScene>( scene: { new(): T } ): GameScene
    {
        return SceneManager.scenes[this.lookup.get(scene.name)];
    }

    public static isActive( scene: GameScene ): boolean
    {
        return SceneManager.active.has(scene);
    }

    public static makeActive( scene: GameScene ): void
    {
        SceneManager.active.add(scene);
    }

    public static makeInactive( scene: GameScene ): void
    {
        SceneManager.active.delete(scene);
    }


    public static preload(): void
    {
        for (let scenes of SceneManager.scenes)
        {
            scenes.preload();
        }
    }

    public static setup(): void
    {
        for (let scenes of SceneManager.scenes)
        {
            scenes.setup();
        }
    }

    public static update(): void
    {
        for (let scene of SceneManager.active)
        {
            scene.update();
        }
    }

    public static draw(): void
    {
        for (let scene of SceneManager.active)
        {
            scene.draw();
        }
    }
}


export abstract class GameScene implements iUpdatable, iRenderable
{
    private states   = new Array<GameState>();
    private lookup   = new Map<string, number>();
    private state: GameState = null;

    public children = new Array<GameScene>();

    public updatables  = new Array<iUpdatable>();
    public renderables = new Array<iRenderable & iTransformable>();

    public addObject( obj: any ): void
    {
        if ((obj as iUpdatable).update != undefined)
            this.updatables.push(obj);

        if ((obj as iRenderable).draw != undefined && (obj as iTransformable).local != undefined)
            this.renderables.push(obj);
    }


    public isActive(): boolean
    {
        return SceneManager.isActive(this);
    }


    public makeActive(): GameScene
    {
        SceneManager.makeActive(this);
        return this;
    }


    public makeInactive(): GameScene
    {
        SceneManager.makeInactive(this);
        return this;
    }


    public addState( state: GameState ): GameState
    {
        state.scene = this;
        this.states.push(state);
        this.lookup.set(state.constructor.name, this.states.length-1);
        return state;
    }


    public currentState(): GameState
    {
        return this.state;
    }


    public stateTransition<T extends GameState>( to: { new(): T } ): GameState
    {
        console.assert(
            this.lookup.has(to.name) == true,
            `[${this.constructor.name}.stateTransition] ${this.constructor.name} does not have state ${to.name}`
        );

        if (this.lookup.has(to.name) == false)
        {
            return null;
        }

        const fromstate = this.currentState();
        const tostate   = this.states[this.lookup.get(to.name)];

        if (fromstate) { fromstate.exit(tostate);  }
        if (tostate)   { tostate.enter(fromstate); }

        if (fromstate)
            console.log(`[${this.constructor.name}.stateTransition] ${fromstate.name} --> ${tostate.name}`);
        else
            console.log(`[${this.constructor.name}.stateTransition] None --> ${tostate.name}`);

        this.state = tostate;

        return this.state;
    }


    public preload(): void {  };
    public setup():   void {  };

    abstract update(): void;
    abstract draw():   void;
}



export abstract class GameState
{
    name:  string;
    scene: GameScene;

    constructor()
    {
        this.name  = this.constructor.name;
        this.scene = null;
    }

    abstract enter( fromstate?: GameState ): void
    abstract exit( tostate?: GameState ): void
    abstract update(): void;
    abstract draw():   void;
}

