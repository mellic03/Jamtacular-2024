import { Transform } from "./transform";


export interface iUpdatable
{
    update(): void;
}


export interface iRenderable
{
    draw(): void;
}


export interface iTransformable
{
    local: Transform;
    world: Transform;
    children: Array<iTransformable>;
}

