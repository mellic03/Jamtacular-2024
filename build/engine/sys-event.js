import System from "./system.js";
export class EventEmitter {
    constructor() {
        this.callbacks = new Map();
    }
    on(msg, callback) {
        if (this.callbacks.has(msg) == false) {
            this.callbacks.set(msg, new Array());
        }
        this.callbacks.get(msg).push(callback);
    }
    emit(msg, data) {
        if (this.callbacks.has(msg) == false) {
            // console.log(`%c No such msg "${msg}"`, "background: grey; color: red;");
            return;
        }
        for (let callback of this.callbacks.get(msg)) {
            callback(data);
        }
    }
}
export default class sys_Event extends System {
    constructor() {
        super();
        this.callbacks = new Map();
    }
    on(msg, callback) {
        if (this.callbacks.has(msg) == false) {
            this.callbacks.set(msg, new Array());
        }
        this.callbacks.get(msg).push(callback);
    }
    emit(msg, data) {
        if (this.callbacks.has(msg) == false) {
            console.log(`%c No such msg "${msg}"`, "background: grey; color: red;");
            return;
        }
        for (let callback of this.callbacks.get(msg)) {
            callback(data);
        }
    }
}
//# sourceMappingURL=sys-event.js.map