import { idk_Stack } from "./ds/idk_stack.js";
import { EventEmitter } from "./sys-event.js";
// import { Actor } from "./actor.js";
export var GameStateFlag;
(function (GameStateFlag) {
    GameStateFlag[GameStateFlag["NONE"] = 0] = "NONE";
    GameStateFlag[GameStateFlag["UPDATE"] = 1] = "UPDATE";
    GameStateFlag[GameStateFlag["DRAW"] = 2] = "DRAW";
    GameStateFlag[GameStateFlag["OTHER"] = 4] = "OTHER";
})(GameStateFlag || (GameStateFlag = {}));
;
export class StateManager {
    static addState(state) {
        StateManager.states.push(state);
        StateManager.lookup.set(state.constructor.name, this.states.length - 1);
        return state;
    }
    static getState(state) {
        return StateManager.states[this.lookup.get(state.name)];
    }
    static preload() {
        for (let state of StateManager.states) {
            state.preload();
        }
    }
    static setup() {
        for (let state of StateManager.states) {
            state.setup();
        }
    }
    static update() {
        for (let state of StateManager.states) {
            if (state.isActive(GameStateFlag.UPDATE)) {
                state.update();
            }
        }
    }
    static draw() {
        for (let state of StateManager.states) {
            if (state.isActive(GameStateFlag.DRAW)) {
                state.draw();
            }
        }
    }
}
StateManager.states = new Array();
StateManager.lookup = new Map();
export class GameState extends EventEmitter {
    constructor() {
        super();
        this.substates = new Array();
        this.stack = new idk_Stack();
        this.lookup = new Map();
        // private actors         = new Array<typeof Actor>();
        this.updatables = new Array();
        this.renderables = new Array();
        this.name = this.constructor.name;
        this.active = GameStateFlag.NONE;
        this.parent = null;
    }
    addActor(A) {
        // this.actors.push(A);
    }
    addObject(obj) {
        if (obj.update != undefined) {
            this.updatables.push(obj);
        }
        if (obj.draw != undefined) {
            this.renderables.push(obj);
        }
    }
    setFlag(flag, bit) {
        if (bit)
            this.active |= flag;
        else
            this.active &= ~flag;
    }
    isActive(flags = (GameStateFlag.UPDATE | GameStateFlag.DRAW)) {
        return (this.active & flags) == flags;
    }
    makeActive(flags = (GameStateFlag.UPDATE | GameStateFlag.DRAW)) {
        this.active |= flags;
        return this;
    }
    makeInactive(flags = (GameStateFlag.UPDATE | GameStateFlag.DRAW)) {
        this.active &= ~flags;
        return this;
    }
    addSubstate(state) {
        state.parent = this;
        this.substates.push(state);
        this.lookup.set(state.constructor.name, this.substates.length - 1);
        return state;
    }
    getState(state) {
        return this.substates[this.lookup.get(state.name)];
    }
    print_transition(fn_name, fromstate, tostate) {
        const left = `[${this.constructor.name}.${fn_name}]`;
        if (fromstate && tostate)
            console.log(left + ` ${fromstate.name} --> ${tostate.name}`);
        if (fromstate && !tostate)
            console.log(left + ` ${fromstate.name} --> None`);
        if (!fromstate && tostate)
            console.log(left + ` None --> ${tostate.name}`);
    }
    pushState(to) {
        if (this.lookup.has(to.name) == false) {
            console.assert(false, "Fuck");
            return;
        }
        const fromstate = this.stack.top();
        const tostate = this.substates[this.lookup.get(to.name)];
        tostate.enter();
        this.stack.push(tostate);
    }
    popState() {
        const fromstate = this.stack.pop();
        const tostate = this.stack.top();
        if (fromstate) {
            fromstate.exit();
        }
        // this.print_transition("popState", fromstate, tostate);
        return fromstate;
    }
    stackEmpty() {
        return this.stack.empty();
    }
    topState() {
        return this.stack.top();
    }
    transition(to) {
        this.popState();
        this.pushState(to);
    }
    preload() { }
    ;
    setup() { }
    ;
    enter() { }
    ;
    exit() { }
    ;
    update() {
        for (let obj of this.updatables) {
            obj.update();
        }
        // for (let A of this.actors)
        // {
        //     A.updateSelf();
        // }
        if (this.topState()) {
            this.topState().update();
        }
        for (let state of this.substates) {
            if (state.isActive(GameStateFlag.UPDATE)) {
                state.update();
            }
        }
    }
    ;
    draw() {
        for (let obj of this.renderables) {
            obj.draw();
        }
        // for (let A of this.actors)
        // {
        //     A.drawSelf();
        // }
        if (this.topState()) {
            this.topState().draw();
        }
        for (let state of this.substates) {
            if (state.isActive(GameStateFlag.DRAW)) {
                state.draw();
            }
        }
    }
    ;
}
//# sourceMappingURL=gamestate.js.map