class AudioManager {
    constructor() {
        this.sounds = new Map();
    }
    preload() {
        this.sounds.set("click", loadSound("assets/audio/click.wav"));
        this.sounds.set("midra1", loadSound("assets/audio/midra1.wav"));
    }
    getSound(name) {
        return this.sounds.get(name);
    }
}
const Audio = new AudioManager();
export { Audio };
//# sourceMappingURL=audio.js.map