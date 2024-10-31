

export abstract class UI_State
{
    private static _all    = new Array<UI_State>();
    private static _active = new Set<UI_State>();

    constructor()
    {
        UI_State._all.push(this);
    }

    abstract update(): void;
    abstract draw():   void;

    public static updateAll(): void
    {
        for (let state of UI_State._active)
        {
            state.update();
        }
    }

    public static drawAll(): void
    {
        for (let state of UI_State._active)
        {
            state.update();
        }
    }

    makeActive(): void
    {
        UI_State._active.add(this);
    }

    makeInactive(): void
    {
        if (UI_State._active.has(this))
        {
            UI_State._active.delete(this);
        }
    }

    transitionTo( state: UI_State ): UI_State
    {
        this.makeInactive();
        state.makeActive();
        return state;
    }


}

