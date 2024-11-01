


export class idk_Stack<T>
{
    public data = new Array<T>();

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
        if (this.empty())
        {
            return null;
        }

        const data = this.top();
        this.data.length -= 1;
        return data;
    }

    size(): number
    {
        return this.data.length;
    }

    empty(): boolean
    {
        return this.size() <= 0;
    }

}

