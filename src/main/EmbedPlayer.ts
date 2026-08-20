import { season as pgv } from "../io/api.bilibili.com/pgc/view/v2/app/season";
import { season as pugv } from "../io/api.bilibili.com/pugv/view/web/season";
import { detail } from "../io/api.bilibili.com/x/web-interface/view/detail";
import { bv2av } from "../utils/abv";
import { Player } from "./widget/player";
import { ContentType } from "./widget/player/type";

export class EmbedPlayer extends Player {
    static override get is() {
        return 'embed-player';
    }
    #implement = new AbortController();
    override connectedCallback() {
        super.connectedCallback();

        this.#implement.abort();
        this.#implement = new AbortController();

        this.when('--init').switchMap(e => {
            return new Observable<CustomEvent<string>>(subscriper => {
                const timer = setTimeout(() => {
                    subscriper.next(<CustomEvent<string>>e);
                    subscriper.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail: params }) => {
            return new Observable<bigint>(subscriper => {
                const abortController = new AbortController();
                const { aid, bvid, cid, type, episodeId: ep_id, season_type, p } = Object.fromEntries(new URLSearchParams(params).entries());
                if (ep_id) {
                    this.ep_id = BigInt(ep_id);
                    if (type) {
                        this.type = ContentType.Pugv; // 暂时全作为 pugv 处理
                        if ((aid || bvid) && cid) {
                            this.aid = aid ? BigInt(aid) : bv2av(bvid!);
                            subscriper.next(BigInt(cid));
                            subscriper.complete();
                        } else {
                            pugv({ ep_id: this.ep_id }, { signal: abortController.signal }).then(({ code, message, data }) => {
                                if (code) {
                                    subscriper.error(`${code} ${message}`);
                                    return;
                                }
                                const { episodes } = data;
                                for (const { id, aid, cid } of episodes) {
                                    if (this.ep_id === BigInt(id)) {
                                        this.aid = BigInt(aid)
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
                    } else {
                        this.type == undefined;
                        if ((aid || bvid) && cid) {
                            this.aid = aid ? BigInt(aid) : bv2av(bvid!);
                            subscriper.next(BigInt(cid));
                        } else {
                            pgv({ ep_id: this.ep_id }, { signal: abortController.signal }).then(({ code, message, data }) => {
                                if (code) {
                                    subscriper.error(`${code} ${message}`);
                                    return;
                                }
                                const { modules } = data;
                                const episodes = modules.filter(({ style }) => style === 'positive' || style === 'section').map(({ data: { episodes } }) => episodes).flat();
                                for (const { id, aid, cid } of episodes) {
                                    if (this.ep_id === BigInt(id)) {
                                        this.aid = BigInt(aid)
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
                    }
                } else if (aid || bvid) {
                    this.aid = aid ? BigInt(aid) : bv2av(bvid!);
                    if (cid && !season_type) {
                        subscriper.next(BigInt(cid));
                        subscriper.complete();
                    } else {
                        detail(this.aid, { signal: abortController.signal }).then(({ code, message, data }) => {
                            if (code) {
                                subscriper.error(`${code} ${message}`);
                                return;
                            }
                            const { View: { cid, pages, redirect_url } } = data;
                            if (redirect_url) {
                                const ep = /ep\d+/i.exec(redirect_url);
                                if (ep) {
                                    this.ep_id = BigInt(ep[0].slice(2));
                                }
                            }
                            if (pages?.[0]) {
                                if (p) {
                                    const i = Number(p) - 1;
                                    subscriper.next(BigInt(pages[i]?.cid || pages[0].cid));
                                } else {
                                    subscriper.next(BigInt(pages[0].cid));
                                }
                                subscriper.complete();
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
                    }
                } else {
                    subscriper.error('参数不足，播放器无法启动~');
                }
                return () => abortController.abort();
            })
        }).subscribe(cid => {
            this.identify();
            this.cid = cid;
        }, { signal: this.#implement.signal });
    }
    override disconnectedCallback() {
        super.disconnectedCallback();
        this.#implement.abort();
    }
}
customElements.define(EmbedPlayer.is, EmbedPlayer);