import Engine from "../engine.js";
import Actor from "../gameobject/actor.js";
import idk_Camera from "../gameobject/camera.js";
import RenderEngine from "../render/renderengine.js";

export default class GameState
{
    private engine: Engine;
    private root:   Actor;
    public  name:   string;
    public  parent: GameState; 

    private children: Map<string, GameState>;
    private active_children: Map<string, GameState>;

    constructor( engine: Engine, name: string, parent: GameState = null )
    {
        this.engine = engine;
        this.root = new Actor(0, 0, 0);
        this.name = name;

        this.parent = parent;
        this.children = new Map<string, GameState>();
        this.active_children = new Map<string, GameState>();
    }

    getActiveChildren(): Map<string, GameState>
    {
        return this.active_children;
    }

    private validate( name: string, desired: boolean ): boolean
    {
        if (desired == true)
        {
            console.assert(this.children.has(name), `Child state "${name}" does not exist`);
            return this.children.has(name);
        }

        else
        {
            console.assert(this.children.has(name) == false, `Child state "${name}" already exists`);
            return (this.children.has(name) == false);
        }
    }


    addActor<T extends Actor>( obj ): T
    {
        this.root.giveChild(obj);
        return obj as T;
    }

    addChildState( state: GameState, active: boolean = false ): void
    {
        if (this.validate(state.name, false))
        {
            state.parent = this;
            this.children.set(state.name, state);

            if (active == true)
            {
                this.activateChildState(state.name);
            }
        }
    }

    activateChildState( name: string ): void
    {
        if (this.active_children.has(name) == false)
        {
            this.active_children.set(name, this.children.get(name));
        }
    }

    deativateChildState( name: string ): void
    {
        if (this.active_children.has(name) == true)
        {
            this.active_children.delete(name);
        }
    }

    transitionChildState( from: string, to: string ): void
    {
        if (!this.validate(from, true) || !this.validate(to, true))
        {
            return;
        }

        const A = this.children.get(from);
        const B = this.children.get(to);

        console.log(`${from} --> ${to}`);

        A.exit(B);
        B.enter(A);

        this.deativateChildState(from);
        this.activateChildState(to);
    }

    transition( to: string ): void
    {
        console.assert(this.parent != null, "No parent state!");

        if (this.parent != null)
        {
            this.parent.transitionChildState(this.name, to);
        }
    }

    enter( prev: GameState ): void
    {

    }

    exit( next: GameState ): void
    {

    }

    private _update_node( node: Actor )
    {
        node.update();

        for (let child of node.children)
        {
            this._update_node(child);
        }
    }

    private _render_node( ren: RenderEngine, node: Actor )
    {
        // if (in_frustum(node))
        {
            node.draw(ren);
    
            for (let child of node.children)
            {
                this._render_node(ren, child);
            }
        }
    }


    update(): void
    {
        this.root.transform.computeHierarchy();
        this._update_node(this.root);
    
        for (let [name, state] of this.active_children)
        {
            state.update();
        }
    }

    draw( ren: RenderEngine, cam: idk_Camera )
    {
        translate(-cam.x, -cam.y);
        this._render_node(ren, this.root);
        translate(+cam.x, +cam.y);

        for (let [name, state] of this.active_children)
        {
            state.draw(ren, cam);
        }
    }

}
