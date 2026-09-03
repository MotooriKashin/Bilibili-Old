export class ScriptSound {
    #sound: HTMLAudioElement;
    constructor(name: string, onLoad?: () => void) {
        const url = `//i2.hdslb.com/soundlib/${name}.mp3`;
        this.#sound = new Audio(url);
        onLoad && this.#sound.when('load').take(1).subscribe(onLoad);
    }
    loadPercent() {
        return Math.floor(this.#sound.buffered.end(0) / this.#sound.duration);
    }
    play(startTime: number, _loops: number) {
        startTime && (this.#sound.currentTime = startTime / 1000);
        this.#sound.play();
    }
    stop() {
        this.#sound.currentTime = this.#sound.duration;
    }
    remove() {
        this.#sound.remove();
    }
}