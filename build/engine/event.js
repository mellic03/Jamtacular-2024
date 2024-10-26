class SubscriberID {
    constructor(msg, idx) {
        this.msg = msg;
        this.idx = idx;
    }
}
export default class EventManager {
    constructor() {
        this.callbacks = new Map();
    }
    on(msg, callback) {
        if (this.callbacks.has(msg) == false) {
            this.callbacks.set(msg, new Array());
        }
        this.callbacks.get(msg).push(callback);
        return new SubscriberID(msg, this.callbacks.get(msg).length - 1);
    }
    emit(msg, data) {
        console.assert(this.callbacks.has(msg), `No such msg "${msg}"`);
        for (let callback of this.callbacks.get(msg)) {
            callback(data);
        }
    }
}
//# sourceMappingURL=event.js.map