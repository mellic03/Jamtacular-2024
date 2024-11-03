import System from "./system.js";


export interface EventEmitting<T>
{
    event: EventEmitter<T>;
}


export class EventEmitter<T>
{
    private callbacks = new Map<T, Array<Function>>();

    public on( msg: T, callback: Function ): void
    {
        if (this.callbacks.has(msg) == false)
        {
            this.callbacks.set(msg, new Array<Function>());
        }
    
        this.callbacks.get(msg).push(callback);
    }

    public emit( msg: T, ...data: any ): void
    {
        if (this.callbacks.has(msg) == false)
        {
            // console.log(`%c No such msg "${msg}"`, "background: grey; color: red;");
            return;
        }

        for (let callback of this.callbacks.get(msg))
        {
            callback(...data);
        }
    }
}

