import { HierarchicalTransform, Transform } from "../../engine/transform.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import vec2 from "../../engine/math/vec2.js";
import { Game } from "../game.js";
class CharacterConfigJSON {
    constructor(C, json) {
        console.log(json);
        console.assert(json.hasOwnProperty("behaviour"), `[${C.typename}] No behaviour`);
        console.assert(json.hasOwnProperty("body"), `[${C.typename}] No body`);
        console.assert(json.hasOwnProperty("limbs"), `[${C.typename}] No limbs`);
        this.behaviour = new BehaviourConfigJSON(json["behaviour"]);
        this.body = new BodyConfigJSON(json["body"]);
    }
}
class BehaviourConfigJSON {
    constructor(config) {
        this.moveForce = 1;
        this.jumpForce = 1;
        this.moveForce = config["moveForce"];
        this.jumpForce = config["jumpForce"];
    }
}
class BodyConfigJSON {
    constructor(config) {
        this.mass = 1.0;
        this.drag = 0.5;
        this.friction = 0.5;
        this.grav = 1.0;
        this.mass = config["mass"];
        this.drag = config["drag"];
        this.friction = config["friction"];
        this.grav = config["grav"];
    }
}
export class RigidBodyCharacter extends RigidBody {
    constructor(x, y, controller) {
        super(new Sprite(x, y), 1);
        this.aggression = 0;
        this.controllers = new Array();
        this.parts = new Array;
        this.typename = this.constructor.name;
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
        this.children = new Array();
        this.sprite["AyyLmao"] = this;
        {
            const json = Game.CharacterConfig;
            console.assert(json.hasOwnProperty(this.typename), "Ruh roh");
            this.config = new CharacterConfigJSON(this, json[this.typename]);
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
    update() {
        this.local.pos.setXY(this.sprite.x, this.sprite.y);
        HierarchicalTransform(this, Transform.Identity);
        if (this.getController() != null) {
            this.getController().update(this);
        }
    }
    rotate(theta) {
        this.local.rot += theta;
    }
    move(x, y) {
        const dir = vec2.tmp(x, y);
        const speed = this.config.behaviour.moveForce;
        if (Math.abs(dir.x) == 0 && Math.abs(dir.y) == 0) {
            return;
        }
        const scale = 1; // deltaTime / 16;
        dir.normalize().mulXY(scale * speed);
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
        this.applyForceXY(0, -1.0);
    }
    interact(x, y, msg = "") {
    }
}
//# sourceMappingURL=Character.js.map