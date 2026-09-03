import type { DisplayObject } from "./flash/display/DisplayObject";
import { ScriptSound } from "./ScriptSound";

export class ScriptPlayer {
    #video: HTMLVideoElement;
    get state() {
        return this.#video.ended ? 'stop' : this.#video.paused ? 'pause' : 'playing';
    }
    get time() {
        return this.#video.currentTime * 1e3;
    }
    get commentList() {
        return [];
    }
    get refreshRate() {
        return 0;
    }
    set refreshRate(_v: number) { }
    get width() {
        return this.#video.clientWidth;
    }
    get height() {
        return this.#video.clientHeight;
    }
    get videoWidth() {
        return this.#video.videoWidth;
    }
    get videoHeight() {
        return this.#video.videoHeight;
    }
    get isContinueMode() {
        return false;
    }
    constructor(video: HTMLVideoElement) {
        this.#video = video;
    }
    play() {
        this.#video.play().catch(() => { });
    }
    pause() {
        this.#video.pause();
    }
    seek(t: number) {
        this.#video.currentTime = t / 1e3;
    }
    jump(av: string, page = 1, newWindow = false) {
        const url = new URL(`//www.bilibili.com/video/${av}`, location.href);
        page > 1 && url.searchParams.set('p', <any>page);
        open(url, newWindow ? '_blank' : '_self');
    }
    /** TODO */
    commentTrigger(_func: Function, _timeout = 1e3) {
        return 0;
    }
    /** TODO */
    keyTrigger(_func: Function, _timeout = 1e3, _isUp = false) {
        return 0;
    }
    /** TODO */
    setMask(_mask: DisplayObject) { }
    createSound(name: string, onLoad?: () => void) {
        return new ScriptSound(name, onLoad);
    }
}