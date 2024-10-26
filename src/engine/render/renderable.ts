import RenderEngine from "./renderengine";

export default interface iRenderable
{
    draw( ren: RenderEngine ): void;
};

