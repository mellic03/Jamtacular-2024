export class idk_Stack {
    constructor() {
        this.data = new Array();
    }
    push(data) {
        this.data.push(data);
    }
    top() {
        if (this.data.length == 0) {
            return null;
        }
        else {
            return this.data[this.data.length - 1];
        }
    }
    pop() {
        if (this.empty()) {
            return null;
        }
        const data = this.top();
        this.data.length -= 1;
        return data;
    }
    size() {
        return this.data.length;
    }
    empty() {
        return this.size() <= 0;
    }
}
//# sourceMappingURL=idk_stack.js.map