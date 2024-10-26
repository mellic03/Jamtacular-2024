class Allocator {
    constructor() {
    }
    create(...args) {
        let ctor;
        this.data.push(new ctor(...args));
        return this.data.length - 1;
    }
    get(id) {
        let idx = this.forward[id];
        return this.data[idx];
    }
    destroy(id) {
    }
}
//# sourceMappingURL=allocator.js.map