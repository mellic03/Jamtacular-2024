
class AudioManager
{
    sounds: Map<string, any>;

    constructor()
    {
        this.sounds = new Map<string, any>();
    }

    preload()
    {
        this.sounds.set("click",  loadSound("assets/audio/click.wav"));
        this.sounds.set("midra1", loadSound("assets/audio/midra1.wav"));
    }

    getSound( name: string )
    {
        return this.sounds.get(name);
    }

}

const Audio = new AudioManager();
export { Audio };