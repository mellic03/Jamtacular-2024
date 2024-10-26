

class SubscriberID<T>
{
    msg: T;
    idx: number;

    constructor( msg: T, idx: number )
    {
        this.msg = msg;
        this.idx = idx;
    }
}


export default class EventManager<T>
{
    callbacks: Map<T, Array<Function>>;

    constructor()
    {
        this.callbacks = new Map<T, Array<Function>>();
    }

    on( msg: T, callback: Function ): SubscriberID<T>
    {
        if (this.callbacks.has(msg) == false)
        {
            this.callbacks.set(msg, new Array<Function>());
        }
    
        this.callbacks.get(msg).push(callback);

        return new SubscriberID(msg, this.callbacks.get(msg).length-1);
    }

    emit( msg: T, data: any ): void
    {
        console.assert(this.callbacks.has(msg), `No such msg "${msg}"`);

        for (let callback of this.callbacks.get(msg))
        {
            callback(data);
        }
    }
}


