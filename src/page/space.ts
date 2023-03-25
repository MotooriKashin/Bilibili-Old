import { BLOD } from "../core/bilibili-old";
import { toast } from "../core/toast";
import { user } from "../core/user";
import { accountGetCardByMid } from "../io/account-getcardbymid";
import { jsonCheck } from "../io/api";
import json from '../json/mid.json';
import { debug } from "../utils/debug";
import { timeFormat } from "../utils/format/time";
import { xhrHook } from "../utils/hook/xhr";
import { poll } from "../utils/poll";
import { VdomTool } from "../utils/vdomtool";

const Mid = {
    11783021: '哔哩哔哩番剧出差',
    1988098633: 'b站_戲劇咖',
    2042149112: 'b站_綜藝咖'
}
export class PageSpace {
    protected mid: number;
    /** 失效视频aid */
    protected aids: number[] = [];
    protected aidInfo: Record<'cover' | 'title', string>[] = [];
    constructor() {
        this.mid = Number(BLOD.path[3] && BLOD.path[3].split("?")[0]);
        this.midInfo();
        user.addCallback(status => {
            status.album && this.album();
            status.jointime && this.jointime();
            status.lostVideo && this.lostVideo();
        });
    }
    /** 修复限制访问up空间 */
    protected midInfo() {
        switch (this.mid) {
            case 11783021:
            case 1988098633:
            case 2042149112:
                json.data.name = Mid[this.mid];
                json.data.official.desc = json.data.name + ' 官方帐号';
                xhrHook("acc/info?", undefined, obj => {
                    if (obj.responseText && obj.responseText.includes("-404")) {
                        obj.response = obj.responseText = JSON.stringify(json);
                        toast.warning("该用户被404，已使用缓存数据恢复访问！")
                    }
                }, false);
                break;
            default:
                break;
        }
    }
    /** 还原相簿 */
    protected album() {
        xhrHook("api.bilibili.com/x/dynamic/feed/draw/doc_list", undefined, obj => {
            const response = JSON.parse(<string>obj.responseText);
            let data = response.data.items.reduce((s: number[], d: Record<string, any>) => {
                s.push(d.doc_id);
                return s;
            }, []);
            setTimeout(() => {
                document.querySelectorAll(".album-card").forEach((d, i) => {
                    (<HTMLAnchorElement>d.firstChild).href = `//h.bilibili.com/${data[i]}`;
                    (<HTMLAnchorElement>d.children[1]).href = `//h.bilibili.com/${data[i]}`;
                })
            }, 1000)
        }, false);
    }
    /** 动态重定向回相簿 */
    static album() {
        xhrHook(['x/polymer/web-dynamic', 'detail?'], undefined, res => {
            const result = res.responseType === "json" ? res.response : JSON.parse(res.response);
            if (result.code === 0) {
                if (result.data?.item.type === 'DYNAMIC_TYPE_DRAW') location.replace(`https://h.bilibili.com/${result.data.item.basic.rid_str}`)
            }
        }, false);
    }
    /** 注册时间 */
    protected jointime() {
        poll(() => document.querySelector(".section.user-info"), t => {
            accountGetCardByMid(this.mid)
                .then(d => {
                    const jointime = timeFormat(d.regtime * 1000, true);
                    const node = <HTMLDivElement>t.lastChild;
                    new VdomTool(`<div class="info-regtime" style="display: inline-block;word-break: break-all;">
                    <span class="info-command" style="display: inline-block;font-size: 12px;font-family: Microsoft YaHei;line-height: 16px;color: #9499a0;margin-right: 16px;">注册</span>
                    <span class="info-value" style="color: #6d757a;font-family: Microsoft YaHei;font-size: 12px;line-height: 16px;padding-right: 15px;">${jointime}</span>
                </div>`).appendTo(node);
                })
        })
    }
    /** 失效视频 */
    protected lostVideo() {
        // 收藏
        xhrHook('x/v3/fav/resource/list', undefined, async res => {
            try {
                const data = jsonCheck(res.response);
                if (data.data.medias) {
                    data.data.medias.forEach((d: any) => {
                        d.attr % 2 && this.aids.push(d.id);
                    });
                }
                if (this.aids.length) {
                    const msg = toast.list('失效视频 >>>', '> ' + this.aids.join(' '));
                    this.lostVideoView().then(() => {
                        setTimeout(() => {
                            msg.push('> 数据返回，正在修复~');
                            let resolve = 0, reject = 0;
                            msg.type = 'success';
                            const ele = document.querySelector("#page-fav");
                            if (ele) {
                                const medias = (<any>ele).__vue__.favListDetails.medias;
                                medias?.forEach((d: any) => {
                                    if (d.attr % 2) {
                                        msg.push(`> av${d.id}`);
                                        if (this.aidInfo[d.id].title) {
                                            resolve++;
                                            d.title = this.aidInfo[d.id].title;
                                            msg.push('>' + this.aidInfo[d.id].title);
                                        } else {
                                            reject++;
                                            d.title = `av${d.id}`;
                                            msg.push('> 未能获取到有效信息！');
                                        }
                                        this.aidInfo[d.id].cover && (d.cover = this.aidInfo[d.id].cover);
                                        d.attr = 0;
                                        ele.querySelector(`[data-aid=${d.bvid}]`)?.children[1]?.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                                    }
                                })
                            }
                            msg.push('> ', `> 修复结束：成功 ${resolve} 失败 ${reject}`, 'fin <<<');
                            msg.delay = 4;
                        }, 100);
                    });
                }
            } catch { }
        }, false);
    }
    protected lostVideoView() {
        const arr: Promise<void>[] = [];
        while (this.aids.length) {
            arr.push((async () => {
                const d = this.aids.shift()!;
                if (this.aidInfo[d]) return;
                let title!: string, cover!: string;
                await GM.fetch(`//www.biliplus.com/video/av${d}`)
                    .then(d => d.text())
                    .then(d => {
                        if (d.match(/\<title\>.+?\ \-\ AV/)) {
                            title = d.match(/\<title\>.+?\ \-\ AV/)![0].replace(/<title>/, "").replace(/ - AV/, "");
                            cover = d.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)![0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
                        }
                    })
                    .catch(e => {
                        debug.error(`获取失效视频av${d}信息错误`, 'BILIPLUS', e);
                    });
                if (!title || !cover) {
                    await GM.fetch(`//www.biliplus.com/all/video/av${d}`)
                        .then(d => d.text())
                        .then(d => {
                            if (d.match('/api/view_all?')) {
                                const url = d.match(/\/api\/view_all\?.+?\',cloudmoe/)![0].replace(/\',cloudmoe/, "");
                                return GM.fetch(`//www.biliplus.com${url}`)
                            }
                            throw new Error('无cid缓存');
                        })
                        .then(d => d.json())
                        .then(d => {
                            d = jsonCheck(d);
                            title = title || d.data.info.title
                            cover = cover || d.data.info.pic
                        })
                        .catch(e => {
                            debug.error(`获取失效视频av${d}信息错误`, 'BILIPLUSALL', e);
                        });
                }
                if (!title || !cover) {
                    await GM.fetch(`//www.jijidown.com/video/av${d}`)
                        .then(d => d.text())
                        .then(d => {
                            if (d.match('window._INIT')) {
                                title = title || d.match(/\<title\>.+?\-哔哩哔哩唧唧/)![0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                                cover = cover || d.match(/\"img\":\ \".+?\",/)![0].match(/http.+?\",/)![0].replace(/",/, "");
                            }
                        })
                        .catch(e => {
                            debug.error(`获取失效视频av${d}信息错误`, 'JIJIDOWN', e);
                        });
                }
                cover = cover && cover.replace("http:", "")
                this.aidInfo[d] = { title, cover };
            })());
        }
        return Promise.all(arr);
    }
}