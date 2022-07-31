import { urlPack } from "../../runtime/lib/url";
import { debug } from "../../runtime/debug";
import { doWhile } from "../../runtime/do_while";
import { toast } from "../../runtime/toast/toast";

/** 番剧时间表栈 */
const inline: Record<string, any>[] = [];
/** 提取时间，格式hh:mm */
function getDate(ctx: string) {
    let result = "";
    ctx.replace(/\d{2}:\d{2}/, d => result = d);
    return result;
}
/**
 * 整体当日数据
 * @param title 当日名字：周x
 * @param item 当日番剧数据表
 */
function decodeInline(title: string, item: Record<string, any>[]) {
    let i = 0;
    switch (title) {
        case "周一": i = 1;
            break;
        case "周二": i = 2;
            break;
        case "周三": i = 3;
            break;
        case "周四": i = 4;
            break;
        case "周五": i = 5;
            break;
        case "周六": i = 6;
            break;
        case "周日": i = 7;
            break;
    }
    inline[i] || (inline[i] = {});
    item.forEach(d => {
        let time = getDate(d.content);
        if (time) {
            inline[i][time] || (inline[i][time] = []);
            inline[i][time].push({
                cover: "",
                delay: 0,
                delay_id: 0,
                delay_index: "",
                delay_reason: "",
                ep_cover: "",
                episode_id: -1,
                follows: d.positions.position3,
                plays: d.positions.position2,
                pub_index: d.positions.position4,
                pub_time: time,
                pub_ts: -1,
                published: 1,
                season_id: d.item_id,
                square_cover: d.image,
                title: d.title
            });
        }
    });
}
/** 港澳台番剧时间表 */
export const timeline = () => {
    doWhile(() => document.querySelector<any>("#bili_bangumi > .bangumi-module")?.__vue__ || (<any>window)?.__INITIAL_STATE__, async d => {
        try {
            const index = await urlPack.getJson("app.bilibili.com/x/v2/activity/index", { page_id: 167998 });
            const item: {
                item_id: number,
                title: string;
            }[] = index.data.cards[0].item[0].item;
            await Promise.all(item.reduce((s, d) => {
                s.push(urlPack.getJson("app.bilibili.com/x/v2/activity/inline", { page_id: d.item_id }).then(t => {
                    const item: Record<string, any>[] = t.data.cards[0].item;
                    decodeInline(d.title, item);
                }));
                return s;
            }, <Promise<any>[]>[]));
            const source = JSON.parse(JSON.stringify(d.timeline || d.timingData));
            source.forEach((d: any) => {
                const i = d.day_of_week;
                Object.entries(inline[i]).forEach(t => {
                    if (d.episodes) { // 主页
                        d.episodes.push(...t[1]);
                    }
                    else { // 新番时间表
                        d.seasonMap[t[0]] || (d.seasonMap[t[0]] = []);
                        d.seasonMap[t[0]].push(...t[1]);
                    }
                });
            });
            d.timeline ? d.timeline = source : d.timingData = source;
        } catch (e) {
            debug.error("获取港澳台番剧时间线出错 ಥ_ಥ");
            toast.error("港澳台番剧时间线", e);
        }
    });
}
