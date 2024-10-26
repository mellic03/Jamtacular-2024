


class Allocator<T>
{
    data:    Array<T>;
    forward: Array<number>;
    reverse: Array<number>;

    constructor()
    {

    }

    create( ...args ): number
    {
        let ctor: new (...args: any[]) => T;
        this.data.push(new ctor(...args));

        return this.data.length - 1;
    }

    get( id: number ): T
    {
        let idx = this.forward[id];
        return this.data[idx];
    }

    destroy( id: number ): void
    {
        
    }

}