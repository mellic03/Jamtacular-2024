export class UI_State {
    constructor() {
        UI_State._all.push(this);
    }
    static updateAll() {
        for (let state of UI_State._active) {
            state.update();
        }
    }
    static drawAll() {
        for (let state of UI_State._active) {
            state.update();
        }
    }
    makeActive() {
        UI_State._active.add(this);
    }
    makeInactive() {
        if (UI_State._active.has(this)) {
            UI_State._active.delete(this);
        }
    }
    transitionTo(state) {
        this.makeInactive();
        state.makeActive();
        return state;
    }
}
UI_State._all = new Array();
UI_State._active = new Set();
//# sourceMappingURL=ui-state.js.map