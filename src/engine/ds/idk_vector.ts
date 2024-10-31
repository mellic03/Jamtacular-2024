

export default class idk_vector<T> extends Array<T>
{
    constructor( size: number, value: T )
    {
        super();

        for (let i=0; i<size; i++)
        {
            this.push(value);
        }
    }
}

