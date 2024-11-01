import { RigidBodyCharacter } from "../game/character/Character.js";
import { idk_Stack } from "./ds/idk_stack.js";
import { iRenderable, iTransformable, iUpdatable } from "./interface.js";
import { EventEmitter } from "./sys-event.js";

// import { Actor } from "./actor.js";


export enum GameStateFlag
{
    NONE    = (0 << 0),
    UPDATE  = (1 << 0),
    DRAW    = (1 << 1),
    OTHER   = (1 << 2)
};


export class StateManager
{
    protected static states = new Array<GameState<any>>();
    protected static lookup = new Map<string, number>();

    public static addState<T>( state: GameState<T> ): GameState<T>
    {
        StateManager.states.push(state);
        StateManager.lookup.set(state.constructor.name, this.states.length-1);
        return state;
    }

    public static getState<T extends GameState>( state: { new(): T } ): GameState
    {
        return StateManager.states[this.lookup.get(state.name)];
    }

    public static preload(): void
    {
        for (let state of StateManager.states)
        {
            state.preload();
        }
    }

    public static setup(): void
    {
        for (let state of StateManager.states)
        {
            state.setup();
        }
    }


    public static update(): void
    {
        for (let state of StateManager.states)
        {
            if (state.isActive(GameStateFlag.UPDATE))
            {
                state.update();
            }
        }
    }


    public static draw(): void
    {
        for (let state of StateManager.states)
        {
            if (state.isActive(GameStateFlag.DRAW))
            {
                state.draw();
            }
        }
    }
}





export abstract class GameState<T=string> extends EventEmitter<T> implements iUpdatable, iRenderable
{
    public  name:   string;
    public  active: GameStateFlag;
    public  parent: GameState<any>;

    public  substates     = new Array<GameState<any>>();
    public  stack         = new idk_Stack<GameState<any>>();
    private lookup        = new Map<string, number>();

    // private actors         = new Array<typeof Actor>();
    private updatables     = new Array<iUpdatable>();
    private renderables    = new Array<iRenderable & iTransformable>();


    constructor()
    {
        super();

        this.name   = this.constructor.name;
        this.active = GameStateFlag.NONE;
        this.parent = null;
    }


    public addActor( A: any )
    {
        // this.actors.push(A);
    }


    public addObject( obj: any ): void
    {
        if ((obj as iUpdatable).update != undefined) { this.updatables.push(obj);  }
        if ((obj as iRenderable).draw  != undefined) { this.renderables.push(obj); }
    }


    public setFlag( flag: GameStateFlag, bit: boolean ): void
    {
        if (bit) this.active |=  flag;
        else     this.active &= ~flag;
    }

    public isActive( flags: GameStateFlag = (GameStateFlag.UPDATE | GameStateFlag.DRAW) ): boolean
    {
        return (this.active & flags) == flags;
    }

    public makeActive( flags: GameStateFlag = (GameStateFlag.UPDATE | GameStateFlag.DRAW) ): GameState<T>
    {
        this.active |= flags;
        return this;
    }

    public makeInactive( flags: GameStateFlag = (GameStateFlag.UPDATE | GameStateFlag.DRAW) ): GameState<T>
    {
        this.active &= ~flags;
        return this;
    }


    public addSubstate( state: GameState ): GameState
    {
        state.parent = this;
        this.substates.push(state);
        this.lookup.set(state.constructor.name, this.substates.length-1);
        return state;
    }

    public getState<T extends GameState>( state: { new(): T } ): GameState
    {
        return this.substates[this.lookup.get(state.name)];
    }

    private print_transition( fn_name: string, fromstate: GameState | null, tostate: GameState | null ): void
    {
        const left = `[${this.constructor.name}.${fn_name}]`;

        if ( fromstate &&  tostate)  console.log(left + ` ${fromstate.name} --> ${tostate.name}`);
        if ( fromstate && !tostate)  console.log(left + ` ${fromstate.name} --> None`);
        if (!fromstate &&  tostate)  console.log(left + ` None --> ${tostate.name}`);
    }



    public pushState<T extends GameState>( to: { new(): T } ): void
    {
        if (this.lookup.has(to.name) == false)
        {
            console.assert(false, "Fuck");
            return;
        }

        const fromstate = this.stack.top();
        const tostate   = this.substates[this.lookup.get(to.name)];

        tostate.enter();
        this.stack.push(tostate);
    }


    public popState(): GameState | null
    {
        const fromstate = this.stack.pop();
        const tostate   = this.stack.top();

        if (fromstate) { fromstate.exit(); }

        // this.print_transition("popState", fromstate, tostate);

        return fromstate;
    }


    public stackEmpty(): boolean
    {
        return this.stack.empty();
    }


    public topState(): GameState | null
    {
        return this.stack.top();
    }


    public transition<T extends GameState>( to: { new(): T } ): void
    {
        this.popState();
        this.pushState(to);
    }


    public preload(): void {  };
    public setup():   void {  };
    public enter():   void {  };
    public exit():    void {  };

    public update(): void
    {
        for (let obj of this.updatables)
        {
            obj.update();
        }

        // for (let A of this.actors)
        // {
        //     A.updateSelf();
        // }

        if (this.topState())
        {
            this.topState().update();
        }

        for (let state of this.substates)
        {
            if (state.isActive(GameStateFlag.UPDATE))
            {
                state.update();
            }
        }
    };

    public draw(): void
    {
        for (let obj of this.renderables)
        {
            obj.draw();
        }

        // for (let A of this.actors)
        // {
        //     A.drawSelf();
        // }
    
        if (this.topState())
        {
            this.topState().draw();
        }

        for (let state of this.substates)
        {
            if (state.isActive(GameStateFlag.DRAW))
            {
                state.draw();
            }
        }
    };

}


