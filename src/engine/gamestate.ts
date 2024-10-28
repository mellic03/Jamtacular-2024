

export class GameState
{
    private group: GameStateManager;
    public  name: string

    constructor( name: string, group: GameStateManager )
    {
        this.name  = name;
        this.group = group;
    }

    transition( to: string ): void
    {
        this.group.childTransition(this.name, to);
    }

}


export class GameStateManager
{
    states = new Map<string, GameState>();

    constructor()
    {

    }
    
    addState( state: GameState ): void
    {
        this.states.set(state.name, state);
    }

    getState( name: string ): GameState
    {
        return this.states.get(name);
    }

    childTransition( from: string, to: string ): void
    {
        // this.states.set(state.name, state);
    }
}
