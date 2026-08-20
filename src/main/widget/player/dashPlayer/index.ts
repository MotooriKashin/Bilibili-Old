import type { IPlayer, Player } from "../index.js";
import { log } from "../../../../utils/debug.js";
import { https } from "../../../../utils/url.js";
import type { IDash } from "../../../io/api.bilibili.com/x/player/playurl.js";
import { upos } from "../upos.js";
import { Fetch } from "./fetch.js";

export class DashPlayer implements IPlayer {
    /**
     * 播放器类型
     * | 0 | 1 | 2 |
     * | - | - | - |
     * | 正常 | 纯视频 | 纯音频 |
     */
    private type = 0;
    private video: IDash['video'];
    private audio: IDash['audio'];
    private disposableStack = new DisposableStack();
    abortController = new AbortController();
    private mediaSource?: MediaSource;
    private sbVideo?: Fetch;
    private sbAudio?: Fetch;
    private flushing = 0;
    constructor(
        private player: Player,
        dash: IDash,
    ) {
        this.pretreat(dash);
        this.init();
    }
    onQnChange(qn: number) {
        if (qn > 0) {
            switch (this.type) {
                case 0: {
                    const v = this.video?.find(({ id }) => id === qn);
                    if (v && this.sbVideo) {
                        this.sbVideo.switchSource(`${v.mime_type}; codecs="${v.codecs}"`, upos(v.base_url, ...(v.backup_url || [])), this.player.video.currentTime);
                        this.player.statistic('Mime Type:', `${v.mime_type}; codecs="${v.codecs}", ${this.sbAudio?.type}`);
                    } else {
                        this.player.toast('无法切换到该画质');
                    }
                    break;
                }
                case 1: {
                    const v = this.video?.find(({ id }) => id === qn);
                    if (v) {
                        const { currentTime } = this.player.video;
                        this.player.video.src = https(v.base_url);
                        this.player.video.currentTime = currentTime;
                        this.player.video.play().catch(() => { });
                        this.player.statistic('Mime Type:', `${v.mime_type}; codecs="${v.codecs}"`);
                        this.player.statistic('playerTypee:', 'NaivePlayer');
                    } else {
                        this.player.toast('无法切换到该画质');
                    }
                    break;
                }
            }
        }
    }
    endOfStream() {
        if (this.sbVideo?.isEnd && this.sbAudio?.isEnd) {
            this.mediaSource?.endOfStream();
        }
    }
    fetchError() {
        if (this.flushing) return;
        this.flushing++;
        if (this.flushing > 3) {
            this.player.toast('无法获取视频，请检查网络~');
            return;
        }
        log(`网络错误：尝试第${this.flushing}次重连~`);
        this.player.content.dispatchEvent(new CustomEvent('--playurl', {
            detail: (v: boolean) => {
                if (!v) this.flushing = 0;
            }
        }));
    }
    flush(dash: IDash) {
        this.pretreat(dash);
        const [v, a] = [this.video!.find(({ id }) => id === this.player.qn) || this.video![0]!, this.audio![0]!];
        if (this.sbVideo) {
            this.sbVideo.flushing = false;
            this.sbVideo.switchSource(`${v.mime_type}; codecs="${v.codecs}"`, upos(v.base_url, ...(v.backup_url || [])), this.player.video.currentTime);
        }
        if (this.sbAudio) {
            this.sbAudio.flushing = false;
            this.sbAudio.switchSource(`${a.mime_type}; codecs="${a.codecs}"`, upos(a.base_url, ...(a.backup_url || [])), this.player.video.currentTime);
        }
        this.flushing = 0;
        this.player.statistic('Mime Type:', `${v.mime_type}; codecs="${v.codecs}", ${a.mime_type}; codecs="${a.codecs}"`);
        this.player.statistic('playerTypee:', 'DashPlayer');
    }
    identify() {
        this.disposableStack.dispose();
        this.disposableStack = new DisposableStack();
        this.abortController.abort();
        this.abortController = new AbortController();
        this.sbVideo?.identify();
        this.sbAudio?.identify();
        delete this.sbVideo;
        delete this.sbAudio;
        this.flushing = 0;
        this.player.video.removeAttribute('src');
        this.player.video.load();
    }
    private pretreat({ video = [], audio = [], flac, dolby }: IDash) {
        video = video ?? [];
        audio = audio ?? [];
        if (this.player.codecid) {
            this.video = video.toSorted(({ id: i0 }, { id: i1 }) => i1 - i0).filter(({ codecid, mime_type, codecs }) => codecid === this.player.codecid && MediaSource.isTypeSupported(`${mime_type}; codecs="${codecs}"`));
        } else {
            this.video = video.toSorted(({ id: i0 }, { id: i1 }) => i1 - i0).filter(({ mime_type, codecs }) => MediaSource.isTypeSupported(`${mime_type}; codecs="${codecs}"`));
        }
        this.audio = audio.toSorted(({ id: i0 }, { id: i1 }) => i1 - i0).filter(({ mime_type, codecs }) => MediaSource.isTypeSupported(`${mime_type}; codecs="${codecs}"`));
        if (dolby?.audio) {
            for (const a of dolby.audio) {
                if (MediaSource.isTypeSupported(`${a.mime_type}; codecs="${a.codecs}"`)) {
                    this.audio.unshift(a);
                }
            }
        }
        if (flac?.audio && MediaSource.isTypeSupported(`${flac.audio.mime_type}; codecs="${flac.audio.codecs}"`)) {
            this.audio.unshift(flac.audio);
        }
    }
    private async init() {
        if (this.video?.[0] && this.audio?.[0]) {
            this.type = 0;
            this.mediaSource = new MediaSource();
            this.player.video.src = this.disposableStack.adopt(URL.createObjectURL(this.mediaSource), URL.revokeObjectURL);
            if (this.mediaSource.readyState !== 'open') {
                const { promise, resolve } = Promise.withResolvers<Event>();
                this.mediaSource.when('sourceopen').takeUntil(this.mediaSource.when('sourceclose')).takeUntil(this.mediaSource.when('sourceended')).take(1).subscribe(resolve, { signal: this.abortController.signal });
                await promise;
            }
            this.disposableStack.dispose();
            const [v, a] = [this.video!.find(({ id }) => id === this.player.qn) || this.video![0]!, this.audio![0]!];
            const [vb, ab] = [this.mediaSource.addSourceBuffer(`${v.mime_type}; codecs="${v.codecs}"`), this.mediaSource.addSourceBuffer(`${a.mime_type}; codecs="${a.codecs}"`)];
            this.sbVideo = new Fetch(this, this.mediaSource, vb, upos(v.base_url, ...(v.backup_url || [])), `${v.mime_type}; codecs="${v.codecs}"`)
            this.sbAudio = new Fetch(this, this.mediaSource, ab, upos(a.base_url, ...(a.backup_url || [])), `${a.mime_type}; codecs="${a.codecs}"`);

            // 视频缓冲暂停
            this.player.video.when('waiting').subscribe(() => {
                if (this.flushing) return;
                const { currentTime, duration, buffered } = this.player.video;
                if (duration && currentTime >= duration) return;
                if (currentTime === 0 && buffered.length && buffered.start(0) <= 1.5) {
                } else {
                    this.sbVideo?.onWaiting(currentTime);
                    this.sbAudio?.onWaiting(currentTime);
                }
            }, { signal: this.abortController.signal });
            // 视频时间更新
            this.player.video.when('timeupdate').subscribe(() => {
                if (this.flushing) return;
                const { currentTime, duration } = this.player.video;
                if (duration && currentTime >= duration) return;
                this.sbVideo?.onTimeupdate(currentTime);
                this.sbAudio?.onTimeupdate(currentTime);
            }, { signal: this.abortController.signal });

            this.player.statistic('Mime Type:', `${v.mime_type}; codecs="${v.codecs}", ${a.mime_type}; codecs="${a.codecs}"`);
            this.player.statistic('playerTypee:', 'DashPlayer');

            // 异常处理
            this.mediaSource.when('sourceclose').take(1).subscribe(() => {
                const { error } = this.player.video;
                if (error) {
                    switch (error.code) {
                        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: {
                            if (error.message.toLocaleLowerCase().includes('video')) {
                                this.player.toast(`[${v.mime_type}; codecs="${v.codecs}"]：视频流有问题，尝试更换~`);
                                const s = new Set(this.video);
                                s.delete(v);
                                this.identify();
                                this.video = Array.from(s);
                                return this.init();
                            } else if (error.message.toLocaleLowerCase().includes('audio')) {
                                this.player.toast(`[${a.mime_type}; codecs="${a.codecs}"]：音频流有问题，尝试更换~`);
                                const s = new Set(this.audio);
                                s.delete(a);
                                this.identify();
                                this.audio = Array.from(s);
                                return this.init();
                            }
                            break;
                        }
                    }
                }
                return this.player.toast('播放器发生致命错误~')
            }, { signal: this.abortController.signal });
        } else if (this.video?.[0]) {
            this.type = 1;
            const { base_url, backup_url, mime_type, codecs } = this.video.find(({ id }) => id === this.player.qn) || this.video[0];
            this.player.video.src = upos(base_url, ...(backup_url || [])).toJSON();
            log('音频轨道丢失');
            this.player.statistic('Mime Type:', `${mime_type}; codecs="${codecs}"`);
            this.player.statistic('playerTypee:', 'NaivePlayer');
        } else if (this.audio?.[0]) {
            this.type = 2;
            const { base_url, backup_url, mime_type, codecs } = this.audio[0];
            this.player.video.src = upos(base_url, ...(backup_url || [])).toJSON();
            log('视频画面丢失');
            this.player.statistic('Mime Type:', `${mime_type}; codecs="${codecs}"`);
            this.player.statistic('playerTypee:', 'NaivePlayer');
        }
    }
}