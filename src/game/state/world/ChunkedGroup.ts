import vec2 from "../../../engine/math/vec2";
import { Render } from "../../../engine/render";
import { Game } from "../../game";


export class ChunkedGroup
{
    tl:   vec2;
    span: vec2;

    constructor( corner: vec2, span: vec2 )
    {
        this.tl   = new vec2().copy(corner);
        this.span = new vec2().copy(span);
    }

}




class ChunkManager_Internal
{
    private _chunks = new Map<[number, number], string>();


    constructor()
    {

    }


    update(): void
    {
        const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
        const scale  = Game.GlobalConfig["World"]["ChunkScale"];

        const tl = vec2.copy(Render.tl);
        const br = vec2.copy(Render.br);

        const chunkW = scale*W;
        const chunkH = scale*H;

        fill(50, 50, 200);

        for (let i=tl.y; i<br.y; i+=chunkH)
        {
            for (let j=tl.x; j<br.x; j+=chunkW)
            {
                rect(j, i, 25);
            }
        }
    }


    clear(): void
    {
        this._chunks.clear();
    }
}



export const ChunkManager = new ChunkManager_Internal();

