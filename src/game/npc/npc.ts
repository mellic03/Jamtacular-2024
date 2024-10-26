import Actor from "../../engine/gameobject/actor";


export default class NPC extends Actor
{
    update()
    {
        super.update();
    }

    draw()
    {
        stroke(0, 255, 0, 255);
        circle(this.transform.x, this.transform.y, 24);
    }

}



