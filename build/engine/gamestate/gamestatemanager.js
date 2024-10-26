// import GameState from "./gamestate.js";
// export default class GameStateManager
// {
//     private states: Map<string, GameState>;
//     private active_states: Map<string, GameState>;
//     constructor()
//     {
//         this.states = new Map<string, GameState>();
//         this.active_states = new Map<string, GameState>();
//     }
//     getActiveStates(): Map<string, GameState>
//     {
//         return this.active_states;
//     }
//     private validate( name: string, desired: boolean ): boolean
//     {
//         if (desired == true)
//         {
//             console.assert(this.states.has(name), `State "${name}" does not exist`);
//             return this.states.has(name);
//         }
//         else
//         {
//             console.assert(this.states.has(name) == false, `State "${name}" already exists`);
//             return (this.states.has(name) == false);
//         }
//     }
//     add( state: GameState, name: string ): void
//     {
//         this.states.set(name, state);
//         state.name = name;
//         state.statemanager = this;
//     }
//     transition( from: string, to: string ): void
//     {
//         if (!this.validate(from, true) || !this.validate(to, true))
//         {
//             return;
//         }
//         const A = this.states.get(from);
//         const B = this.states.get(to);
//         console.log(`${from} --> ${to}`);
//         A.exit(B);
//         B.enter(A);
//         this.makeNonResident(from);
//         this.makeResident(to);
//     }
//     makeResident( name: string ): void
//     {
//         if (this.active_states.has(name) == false)
//         {
//             this.active_states.set(name, this.states.get(name));
//         }
//     }
//     makeNonResident( name: string ): void
//     {
//         if (this.active_states.has(name) == true)
//         {
//             this.active_states.delete(name);
//         }
//     }
//     update(): void
//     {
//         for (let [name, state] of this.active_states)
//         {
//             state.update();
//         }
//     }
// }
//# sourceMappingURL=gamestatemanager.js.map