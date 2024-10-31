


export class idk_Stack<T>
{
    private data = new Array<T>();

    push( data: T ): void
    {
        this.data.push(data);
    }

    top(): T
    {
        if (this.data.length == 0)
        {
            return null;
        }

        else
        {
            return this.data[this.data.length-1];
        }
    }

    pop(): T
    {
        if (this.data.length == 0)
        {
            return null;
        }

        else
        {
            return this.data.pop();
        }
    }

    empty(): boolean
    {
        return this.data.length == 0;
    }

}

