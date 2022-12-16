import { apiBangumiSeason } from "../io/api-bangumi-season";
import { apiBiliplusView } from "../io/api-biliplus-view";
import { apiPlayerPagelist } from "../io/api-player-pagelist";
import { apiView } from "../io/api-view";
import { apiXView } from "../io/api-x-view";
import { abv } from "./abv";
import { debug } from "./debug";
import { objUrl, urlObj } from "./format/url";

/**
 * 从url中提取指定参数
 * @param name 参数名
 * @returns 参数值，不存在返回null
 */
export function getUrlValue(name: string) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}
const catchs = { aid: <Record<string, any>>{}, ssid: <Record<string, any>>{}, epid: <Record<string, any>>{} };
interface UrlParam {
    aid?: number;
    cid?: number;
    ssid?: number;
    epid?: number;
    p: number;
    pgc: boolean
}
/**
 * 从url中提取aid/cid/ssid/epid等信息，提取不到就尝试获取
 * @param url B站视频页url，或者提供视频相关参数
 * @param redirect 是否处理Bangumi重定向？注意对于失效视频，请主动置为`false`
 * @returns 对于bangumi，会设置`pgc=true`
 * @example
 * urlParam(location.href); // 完整url：会自动识别下面这些参数
 * urlParam("av806828803"); // av号
 * urlParam("av806828803?p=1"); // 指定分p
 * urlParam("BV1T34y1o72w"); // bv号
 * urlParam("ss3398"); // ss号
 * urlParam("ep84795"); // ep号
 * urlParam("aid=806828803"); // aid
 * urlParam("aid=806828803&p=1"); // 参数 + 分p
 * urlParam("avid=806828803"); // avid
 * urlParam("bvid=1T34y1o72w"); // bvid
 * urlParam("bvid=BV1T34y1o72w"); // 完整bvid
 * urlParam("ssid=3398"); // ssid
 * urlParam("epid=84795"); // epid
 * urlParam("season_id=3398"); // season_id
 * urlParam("ep_id=84795"); // ep_id
 */
export async function urlParam(url: string, redirect = true): Promise<UrlParam> {
    url && !url.includes("?") && (url = "?" + url);
    const obj = urlObj(url);
    let { aid, cid, ssid, epid, p } = obj;
    let pgc = false;
    !aid && (aid = obj.avid);
    !aid && (url.replace(/[aA][vV]\d+/, d => aid = d.substring(2)));
    !aid && (url.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/, d => aid = <string>abv(d)));
    !aid && obj.bvid && (aid = abv(obj.bvid));
    aid && !Number(aid) && (aid = abv(aid));
    p = p || 1;
    !ssid && (ssid = obj.seasonId);
    !ssid && (ssid = obj.season_id);
    !ssid && (url.replace(/[sS][sS]\d+/, d => ssid = d.substring(2)));
    !epid && (epid = obj.episodeId);
    !epid && (epid = obj.ep_id);
    !epid && (url.replace(/[eE][pP]\d+/, d => epid = d.substring(2)));
    if (ssid || epid) {
        const data = await apiBangumiSeason({ season_id: <number>ssid, ep_id: <number>epid });
    }
    if (!ssid && !epid && aid) {
        if (catchs.aid[aid]) return catchs.aid[aid][<number>p - 1] || catchs.aid[aid][0];
        if (!cid) {
            try {
                // 一般view接口：包含番剧重定向但无法突破有区域限制
                let data = await apiXView(aid);
                if (data.redirect_url) return urlParam(objUrl(data.redirect_url, { aid, cid, ssid, epid, p }));
                catchs.aid[aid] = data.pages;
                catchs.aid[aid].forEach((d: any) => d.aid = aid);
                return catchs.aid[aid][<number>p - 1] || catchs.aid[aid][0];
            } catch (e) {
                debug.error("view", e);
                try {
                    // pagelist接口，无区域限制但无法番剧重定向
                    catchs.aid[aid] = await apiPlayerPagelist(aid);
                    catchs.aid[aid].forEach((d: any) => d.aid = aid);
                    return catchs.aid[aid][<number>p - 1] || catchs.aid[aid][0];
                } catch (e) {
                    debug.error("pagelist", e);
                    try {
                        // 上古view接口：无区域限制但无法番剧重定向，包含部分上古失效视频信息
                        catchs.aid[aid] = (await apiView(aid)).list;
                        catchs.aid[aid].forEach((d: any) => d.aid = aid);
                        return catchs.aid[aid][<number>p - 1] || catchs.aid[aid][0];
                    } catch (e) {
                        debug.error("appkey", e);
                        try {
                            // BiliPlus接口：含失效视频信息（一般都有备份）
                            let data = await new apiBiliplusView(aid).getDate();
                            catchs.aid[aid] = data.list || (data.v2_app_api && data.v2_app_api.pages);
                            catchs.aid[aid].forEach((d: any) => d.aid = aid);
                            if (redirect && data.v2_app_api && data.v2_app_api.redirect_url) return urlParam(objUrl(data.v2_app_api.redirect_url, { aid, cid, ssid, epid, p }));
                            return catchs.aid[aid][<number>p - 1] || catchs.aid[aid][0];
                        } catch (e) { debug.error("biliplus", e); }
                    }
                }
            }
        }
    }
    if (ssid || epid) {
        if (ssid && catchs.ssid[ssid]) return catchs.ssid[ssid][<number>p - 1] || catchs.ssid[ssid][0];
        if (epid && catchs.epid[epid]) return catchs.epid[epid];
        pgc = true;
        let data = await apiBangumiSeason({ ep_id: <number>epid, season_id: <number>ssid });
        ssid = data.season_id;
        catchs.ssid[ssid] = [];
        data.episodes.forEach((d: any) => {
            Object.assign(d, { ssid, pgc, epid: d.ep_id });
            catchs.aid[d.aid] = catchs.aid[d.aid] || [];
            catchs.aid[d.aid].push(d);
            catchs.ssid[ssid].push(catchs.epid[d.ep_id] = d);
        });
        if (epid) return catchs.epid[epid];
        return catchs.ssid[ssid][<number>p - 1] || catchs.ssid[ssid][0];
    }
    return <UrlParam><unknown>{ aid, cid, ssid, epid, p, pgc }
}