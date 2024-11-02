import System from "./system.js";
export default class Scene extends System {
    constructor() {
        super();
        this.actors = [];
        // const og_update = this.update;
        // this.update = () => {
        //   Scene.prototype.update.apply(this);
        //   return og_update.apply(this);
        // };
    }
    // addActor( A: Actor ): void
    // {
    //     this.actors.push(A);
    // }
    preload(engine) {
    }
    setup(engine) {
    }
    // private update_actor( engine: Engine, A: Actor )
    // {
    //     A.update(engine);
    //     A.draw(engine);
    //     for (let child of A.children)
    //     {
    //         this.update_actor(engine, child);
    //     }
    // }
    update(engine) {
        // for (let A of this.actors)
        // {
        //     A.transform.ForwardKinematics();
        // }
        // for (let A of this.actors)
        // {
        //     this.update_actor(engine, A);
        // }
    }
}
//# sourceMappingURL=scene.js.map