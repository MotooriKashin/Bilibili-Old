import { bv2av } from "../utils/abv";
import { season as pgc } from "../io/api.bilibili.com/pgc/view/v2/app/season";
import { season as pugv } from "../io/api.bilibili.com/pugv/view/web/season";
import { detail as ugc } from "../io/api.bilibili.com/x/web-interface/view/detail";
import { Player } from "./widget/player";
import { ContentType } from "./widget/player/type";

export class Nano {
    #player = new Player();
    #event = <Record<EventType, Map<() => void, AbortController>>>{};
    constructor(private detail: INanoConfig) {
        this.#player.id = 'bilibili-player';

        this.#player.when('--reload').switchMap(e => {
            return new Observable<CustomEvent<INanoConfig>>(subscriper => {
                const timer = setTimeout(() => {
                    subscriper.next(<CustomEvent<INanoConfig>>e);
                    subscriper.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail: { seasonId, episodeId, aid, bvid, cid, kind, p, featureList } }) => {
            return new Observable<bigint>(subscriper => {
                const abortController = new AbortController();
                if (seasonId || episodeId) {
                    if (episodeId) {
                        this.#player.ep_id = BigInt(episodeId);
                    }
                    switch (kind) {
                        case GroupKind.Pgc: {
                            this.#player.type = undefined;
                            if ((aid || bvid) && cid) {
                                this.#player.aid = aid ? BigInt(aid) : bv2av(bvid!);
                                subscriper.next(BigInt(cid));
                                subscriper.complete();
                            } else {
                                pgc(episodeId ? { ep_id: episodeId } : { season_id: seasonId! }).then(({ code, message, data }) => {
                                    if (code) {
                                        subscriper.error(`${code} ${message}`);
                                        return;
                                    }
                                    const { modules, user_status } = data;
                                    const episodes = modules.filter(({ style }) => style === 'positive' || style === 'section').map(({ data: { episodes } }) => episodes).flat();
                                    let ep_id = this.#player.ep_id || user_status?.progress?.last_ep_id;
                                    for (const { id, aid, cid } of episodes) {
                                        if (!ep_id || ep_id.toString() === id.toString()) {
                                            this.#player.aid = BigInt(aid);
                                            subscriper.next(BigInt(cid));
                                            subscriper.complete();
                                            return;
                                        }
                                    }
                                    subscriper.error(`参数丢失，播放器无法启动~`);
                                }).catch(e => {
                                    if (e.name !== "AbortError") {
                                        subscriper.error(e);
                                    }
                                });
                            }
                            break;
                        }
                        case GroupKind.Pugv: {
                            this.#player.type = ContentType.Pugv;
                            if ((aid || bvid) && cid) {
                                this.#player.aid = aid ? BigInt(aid) : bv2av(bvid!);
                                subscriper.next(BigInt(cid));
                                subscriper.complete();
                            } else {
                                pugv(episodeId ? { ep_id: episodeId } : { season_id: seasonId! }).then(({ code, message, data }) => {
                                    if (code) {
                                        subscriper.error(`${code} ${message}`);
                                        return;
                                    }
                                    const { episodes, user_status } = data;
                                    let ep_id = this.#player.ep_id || user_status?.progress?.last_ep_id;
                                    for (const { id, aid, cid } of episodes) {
                                        if (!ep_id || ep_id.toString() === id.toString()) {
                                            this.#player.aid = BigInt(aid);
                                            subscriper.next(BigInt(cid));
                                            subscriper.complete();
                                            return;
                                        }
                                    }
                                    subscriper.error(`参数丢失，播放器无法启动~`);
                                }).catch(e => {
                                    if (e.name !== "AbortError") {
                                        subscriper.error(e);
                                    }
                                });
                            }
                            break;
                        }
                        default: {
                            subscriper.error(`未知播放器类型~`);
                        }
                    }
                } else if (aid || bvid || cid) {
                    this.#player.type = undefined;
                    if (!(aid || bvid) && globalThis.self !== globalThis.parent) {
                        // 例外情况：或许bvid填错到aid中了？
                        // 参考：https://www.bilibili.com/blackboard/topic/activity-YVFOpJplh.html
                        const { aid } = Object.fromEntries(new URLSearchParams(location.search).entries());
                        if (aid && /[BbVv]{2}1[FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf]{9}/.test(aid)) {
                            this.#player.aid = bv2av(aid);
                        } else {
                            subscriper.error(`参数不足，播放器无法启动~`);
                        }
                    } else {
                        this.#player.aid = aid ? BigInt(aid) : bv2av(bvid!);
                    }
                    ugc(this.#player.aid).then(({ code, message, data }) => {
                        if (code) {
                            subscriper.error(`${code} ${message}`);
                            return;
                        }
                        const { View: { cid, pages, redirect_url } } = data;
                        if (redirect_url) {
                            const ep = /ep\d+/i.exec(redirect_url);
                            if (ep) {
                                this.#player.ep_id = BigInt(ep[0].slice(2));
                            }
                        }
                        if (pages?.[0]) {
                            if (p) {
                                const i = Number(p) - 1;
                                subscriper.next(BigInt(pages[i]?.cid || pages[0].cid));
                                subscriper.complete();
                            } else {
                                subscriper.next(BigInt(pages[0].cid));
                                subscriper.complete();
                            }
                        } else if (cid) {
                            subscriper.next(BigInt(cid));
                            subscriper.complete();
                        } else {
                            subscriper.error('CID 丢失！');
                        }
                    }).catch(e => {
                        if (e.name !== "AbortError") {
                            subscriper.error(e);
                        }
                    });
                } else {
                    subscriper.error(`参数不足，播放器无法启动~`);
                }
                return () => abortController.abort();
            });
        }).subscribe(cid => {
            this.#player.identify();
            this.#player.cid = cid;
            this.#player.dispatchEvent(new CustomEvent(EventType.Player_Canplay, { detail: 0 }));
            this.#player.dispatchEvent(new CustomEvent(EventType.Player_PlayUrl_Done, { detail: { raw: { result: { play_video_type: 'whole' } } } }));
        });

        this.reload(detail);
    }
    seek(t: number) {
        this.#player.video.currentTime = t;
    }
    play() {
        this.#player.video.play().catch(() => { });
    }
    reload(detail: INanoConfig) {
        detail.element?.replaceChildren(this.#player);
        this.#player.dispatchEvent(new CustomEvent('--reload', { detail: Object.assign(this.detail, detail) }));
        this.#player.dispatchEvent(new CustomEvent(EventType.Player_Initialized, { detail: 0 }));
        detail.muted !== undefined && (this.#player.video.muted = detail.muted);
        if (detail.featureList) {
            for (const key of detail.featureList) {
                switch (key) {
                    case 'noAudioStream': {
                        this.#player.noAudioStream = true;
                        break;
                    }
                    case 'noVVReport': case 'noVTReport': case 'noVTHistory': {
                        this.#player.noVTReport = true;
                        break;
                    }
                }
            }
        }
    }
    pause() {
        this.#player.video.pause();
    }
    on(key: EventType, callback: () => void) {
        this.#event[key] || (this.#event[key] = new Map());
        const abortController = new AbortController();
        this.#event[key].set(callback, abortController);
        this.#player.when(key).subscribe(callback, { signal: abortController.signal });
    }
    once(key: EventType, callback: () => void) {
        this.#player.when(key).take(1).subscribe(callback);
    }
    off(key: EventType, callback: () => void) {
        this.#event[key]?.get(callback)?.abort();
    }
    setLoop(v: boolean) {
        this.#player.video.loop = v;
    }
    disconnect() {
        this.#player.identify();
        this.#player.remove();
    }
}
enum EventType {
    Media_Autoplay_Not_Allowed = 'Media_Autoplay_Not_Allowed',
    Media_Element_Resize = 'Media_Element_Resize',
    Player_Abort = 'Player_Abort',
    Player_Access_Changed = 'Player_Access_Changed',
    Player_Ai_Animation_Triggered = 'Player_Ai_Animation_Triggered',
    Player_AspectRatioChange = 'Player_AspectRatioChange',
    Player_Aspect_Switch_Change = 'Player_Aspect_Switch_Change',
    Player_AutoplayChange = 'Player_AutoplayChange',
    Player_BlackGapChange = 'Player_BlackGapChange',
    Player_CANT_PLAY_DRM = 'Player_Cant_Play_Drm',
    Player_Canplay = 'Player_Canplay',
    Player_Committed = 'Player_Committed',
    Player_Connected = 'Player_Connected',
    Player_Container_Resize = 'Player_Container_Resize',
    Player_Danmaku_Change = 'Player_Danmaku_Change',
    Player_Disconnect = 'Player_Disconnect',
    Player_Dispose = 'Player_Dispose',
    Player_DurationChange = 'Player_DurationChange',
    Player_Emptied = 'Player_Emptied',
    Player_Ended = 'Player_Ended',
    Player_Enter_Loading = 'Player_Enter_Loading',
    Player_Error = 'Player_Error',
    Player_HandoffChange = 'Player_HandoffChange',
    Player_Handoff_Signal = 'Player_Handoff_Signal',
    Player_Hide_Controls = 'Player_Hide_Controls',
    Player_Hide_EndPanel = 'Player_Hide_EndPanel',
    Player_Hotspot_Change = 'Player_Hotspot_Change',
    Player_Idle_Frame = 'Player_Idle_Frame',
    Player_Initialized = 'Player_Initialized',
    Player_Leave_Loading = 'Player_Leave_Loading',
    Player_LightOffChange = 'Player_LightOffChange',
    Player_LoadStart = 'Player_LoadStart',
    Player_LoadedData = 'Player_LoadedData',
    Player_LoadedMetadata = 'Player_LoadedMetadata',
    Player_LoopChange = 'Player_LoopChange',
    Player_Loop_Signal = 'Player_Loop_Signal',
    Player_LoudnessChange = 'Player_LoudnessChange',
    Player_MirrorChange = 'Player_MirrorChange',
    Player_Navigate = 'Player_Navigate',
    Player_OpEdChange = 'Player_OpEdChange',
    Player_PatchSwitch = 'Player_PatchSwitch',
    Player_Patch_Adv_Report = 'Player_Patch_Adv_Report',
    Player_Pause = 'Player_Pause',
    Player_Perch_Click = 'Player_Perch_Click',
    Player_Play = 'Player_Play',
    Player_PlayUrl_Done = 'Player_PlayUrl_Done',
    Player_Playing = 'Player_Playing',
    Player_Polar_Report = 'Player_Polar_Report',
    Player_PreferCodecChange = 'Player_PreferCodecChange',
    Player_Prepared = 'Player_Prepared',
    Player_Progress = 'Player_Progress',
    Player_ProgressBar_Change = 'Player_ProgressBar_Change',
    Player_Quality_Changed = 'Player_Quality_Changed',
    Player_Quality_Rendered = 'Player_Quality_Rendered',
    Player_Quality_Requested = 'Player_Quality_Requested',
    Player_RateChange = 'Player_RateChange',
    Player_Sand_Animation_Running = 'Player_Sand_Animation_Running',
    Player_Seeked = 'Player_Seeked',
    Player_Seeking = 'Player_Seeking',
    Player_SharePanel_Change = 'Player_SharePanel_Change',
    Player_Show_Controls = 'Player_Show_Controls',
    Player_Show_EndPanel = 'Player_Show_EndPanel',
    Player_Stalled = 'Player_Stalled',
    Player_Statue_Changed = 'Player_Statue_Changed',
    Player_Submit_Feedback = 'Player_Submit_Feedback',
    Player_Subtitle_Change = 'Player_Subtitle_Change',
    Player_Summary_Change = 'Player_Summary_Change',
    Player_Suspend = 'Player_Suspend',
    Player_TimeUpdate = 'Player_TimeUpdate',
    Player_Vip_Qulaity_Trial = 'Player_Vip_Qulaity_Trial',
    Player_Vip_Qulaity_Trial_End = 'Player_Vip_Qulaity_Trial_End',
    Player_Vip_Trial_Prompt_Toast = 'Player_Vip_Trial_Prompt_Toast',
    Player_Vip_Trial_Toast_Envoked = 'Player_Vip_Trial_Toast_Envoked',
    Player_Virtual_Action = 'Player_Virtual_Action',
    Player_VolumeChange = 'Player_VolumeChange',
    Player_Waiting = 'Player_Waiting',
}
interface INanoConfig {
    aid?: number;
    cid?: number;
    bvid?: string;
    seasonId?: number;
    episodeId?: number;
    element?: HTMLElement;
    kind: GroupKind;
    t?: number;
    p?: number;
    muted?: boolean;
    featureList?: Set<string>;
}

enum GroupKind {
    Ugc,
    Pgc,
    Pugv,
    Stein,
    Oneself,
    Manager,
}