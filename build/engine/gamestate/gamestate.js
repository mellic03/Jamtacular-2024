import Actor from "../gameobject/actor.js";
export default class GameState {
    constructor(engine, name, parent = null) {
        this.engine = engine;
        this.root = new Actor(0, 0, 0);
        this.name = name;
        this.parent = parent;
        this.children = new Map();
        this.active_children = new Map();
    }
    getActiveChildren() {
        return this.active_children;
    }
    validate(name, desired) {
        if (desired == true) {
            console.assert(this.children.has(name), `Child state "${name}" does not exist`);
            return this.children.has(name);
        }
        else {
            console.assert(this.children.has(name) == false, `Child state "${name}" already exists`);
            return (this.children.has(name) == false);
        }
    }
    addActor(obj) {
        this.root.giveChild(obj);
        return obj;
    }
    addChildState(state, active = false) {
        if (this.validate(state.name, false)) {
            state.parent = this;
            this.children.set(state.name, state);
            if (active == true) {
                this.activateChildState(state.name);
            }
        }
    }
    activateChildState(name) {
        if (this.active_children.has(name) == false) {
            this.active_children.set(name, this.children.get(name));
        }
    }
    deativateChildState(name) {
        if (this.active_children.has(name) == true) {
            this.active_children.delete(name);
        }
    }
    transitionChildState(from, to) {
        if (!this.validate(from, true) || !this.validate(to, true)) {
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
    transition(to) {
        console.assert(this.parent != null, "No parent state!");
        if (this.parent != null) {
            this.parent.transitionChildState(this.name, to);
        }
    }
    enter(prev) {
    }
    exit(next) {
    }
    _update_node(node) {
        node.update();
        for (let child of node.children) {
            this._update_node(child);
        }
    }
    _render_node(ren, node) {
        // if (in_frustum(node))
        {
            node.draw(ren);
            for (let child of node.children) {
                this._render_node(ren, child);
            }
        }
    }
    update() {
        this.root.transform.computeHierarchy();
        this._update_node(this.root);
        for (let [name, state] of this.active_children) {
            state.update();
        }
    }
    draw(ren, cam) {
        translate(-cam.x, -cam.y);
        this._render_node(ren, this.root);
        translate(+cam.x, +cam.y);
        for (let [name, state] of this.active_children) {
            state.draw(ren, cam);
        }
    }
}
//# sourceMappingURL=gamestate.js.map