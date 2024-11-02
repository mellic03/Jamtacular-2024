import { __engine } from "../../engine/engine.js";
import { HierarchicalTransform, Transform } from "../../engine/transform.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import vec2 from "../../engine/math/vec2.js";
import { Game } from "../game.js";
export class CharacterConfigJSON {
    constructor(config) {
        this.aggression = 0;
        if (config.hasOwnProperty("aggression")) {
            this.aggression = config["aggression"];
        }
    }
}
export class RigidBodyCharacter extends RigidBody {
    constructor(x, y, controller) {
        super(new Sprite(x, y), 1);
        this.timer = 0.0;
        this.try_jump = false;
        this.jump_timer = 0.0;
        this.controllers = new Array();
        this.parts = new Array;
        this.state = "idle";
        const ctor_name = this.constructor.name;
        this.sprite["AyyLmao"] = this;
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
        this.children = new Array();
        this.config = new CharacterConfigJSON(Game.CharacterConfig[ctor_name]);
        // this.config.load(Game.config[ctor_name]);
        if (Game.CharacterConfig.hasOwnProperty(ctor_name)) {
            this.config = Game.CharacterConfig[ctor_name];
        }
        this.pushController(controller);
    }
    pushController(ctl) {
        if (ctl != null) {
            this.controllers.push(ctl);
        }
    }
    popController() {
        if (this.controllers.length > 0) {
            return this.controllers.pop();
        }
        else {
            return null;
        }
    }
    getController() {
        if (this.controllers.length > 0) {
            return this.controllers[this.controllers.length - 1];
        }
        return null;
    }
    addPart(part) {
        this.children.push(part);
        this.parts.push(part);
    }
    _jumping() {
        const dt = deltaTime / 1000.0;
        this.jump_timer += (deltaTime / 1000.0);
        if (this.jump_timer < 0.25) {
            this.sprite.vel.y = -4.0;
        }
        else {
            this.state = "idle";
            this.jump_timer = -1.0;
        }
    }
    update() {
        this.local.pos.setXY(this.sprite.x, this.sprite.y);
        HierarchicalTransform(this, Transform.Identity);
        if (this.getController() != null) {
            this.getController().update(this);
        }
        if (this.state == "idle") {
            this.jump_timer += __engine.dtime();
            if (this.try_jump) {
                this.state = "jumping";
                this.try_jump = false;
            }
        }
        else if (this.state == "jumping") {
            this._jumping();
        }
        for (let part of this.parts) {
            part.update();
        }
    }
    rotate(theta) {
        this.local.rot += theta;
    }
    move(x, y) {
        const dir = vec2.tmp(x, y);
        if (Math.abs(dir.x) == 0 && Math.abs(dir.y) == 0) {
            return;
        }
        dir.normalize().mulXY(256);
        this.applyForceXY(dir.x, dir.y);
    }
    moveTo(x, y) {
        const dt = 16.0; // deltaTime;
        const disp = vec2.tmp().displacement(this.world.pos, vec2.tmp(x, y));
        if (disp.magSq() > 0.0005) {
            const dir = disp.normalize();
            this.applyForce(dir.mulXY(dt));
        }
    }
    jump() {
        if (this.state != "jumping" && this.jump_timer > 0.0) {
            this.try_jump = true;
            this.jump_timer = 0.0;
        }
        // this.applyForceXY(0, -32.0);
    }
    interact(x, y, msg = "") {
    }
}
//# sourceMappingURL=Character.js.map