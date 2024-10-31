import { iTransformable } from "../../engine/interface";


export type iControllable = iTransformable & {
    move( x: number, y: number ): void;
    jump(): void;
    rotate( theta: number ): void;
    interact( x: number, y: number, msg: string ): void;
}


export interface iCharacterController
{
    update( C: iControllable ): void;
}

