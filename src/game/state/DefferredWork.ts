
type DispatchableWork = () => boolean;


export interface iDefferedTask
{
    taskid:   number;
    finished: boolean;

    work():     boolean;
    callback(): void;
}



class DefferedWorkManager
{
    private _tasks   = new Map<number, iDefferedTask>();
    private _idcount = 0;

    constructor()
    {

    };


    update(): void
    {
        let cull = [];

        for (let [id, task] of this._tasks)
        {
            if (task.work())
            {
                task.callback();
                task.finished = true;
                cull.push(id);
            }
        }

        for (let id of cull)
        {
            this._tasks.delete(id);
        }
    }


    dispatch( task: iDefferedTask ): void
    {
        task.taskid   = this._idcount++;
        task.finished = false;
        this._tasks.set(task.taskid, task);
    }


    interrupt( task: iDefferedTask ): void
    {
        this._tasks.delete(task.taskid);
    }
}


export const WorkManager = new DefferedWorkManager;

