interface modules {
    /** av页深度审查 */
    readonly "avLostCheck.js": string;
}
namespace API {
    /** 模板：//api.bilibili.com/x/web-interface/view/detail?aid=${aid} */
    class Detail {
        code = 0;
        data = {
            Card: { archive_count: -1, article_count: -1, card: {}, follower: -1, following: false, like_num: -1, space: {} },
            Related: <any[]>[],
            Reply: { page: {}, replies: [] },
            Spec: null,
            Tags: <any[]>[],
            View: <Record<string, any>>{},
            elec: null,
            hot_share: {},
            recommend: null,
            view_addit: {}
        }
        message = "0";
        ttl = 1;
    }
    function view2Detail(data: any) {
        const result = new Detail();
        if (data.v2_app_api) {
            delete data.v2_app_api.redirect_url; // 番剧重定向会导致404，弃之
            result.data.Card.follower = data.v2_app_api.owner_ext?.fans;
            result.data.Card.card = { ...data.v2_app_api.owner, ...data.v2_app_api.owner_ext };
            result.data.Tags = data.v2_app_api.tag;
            result.data.View = data.v2_app_api;
            xhrhook(`api.bilibili.com/x/web-interface/view?aid=${aid}`, undefined, (res) => {
                const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            xhrhook(`api.bilibili.com/x/web-interface/archive/stat?aid=${aid}`, undefined, (res) => {
                const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid })}}`;
                res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
            }, false);
            return JSON.parse(JSON.stringify(result));
        }
        else return v1api(data);
    }
    function v1api(data: any) {
        const result = new Detail();
        const p = Number(getUrlValue("p"));
        result.data.Card.card = {
            face: "//static.hdslb.com/images/akari.jpg",
            mid: data.mid,
            name: data.author,
            vip: {}
        };
        result.data.View = {
            aid: data.aid || data.id || aid,
            cid: data.list[p ? p - 1 : 0].cid,
            copyright: 1,
            ctime: data.created,
            dimension: { width: 1920, height: 1080, rotate: 0 },
            duration: -1,
            owner: result.data.Card.card,
            pages: data.list,
            pic: data.pic,
            pubdate: data.lastupdatets,
            rights: {},
            stat: {
                aid: data.aid || data.id || aid,
                coin: data.coins,
                danmaku: data.video_review,
                dislike: 0,
                evaluation: "",
                favorite: data.favorites,
                his_rank: 0,
                like: -1,
                now_rank: 0,
                reply: -1,
                share: -1,
                view: data.play
            },
            state: 0,
            subtitle: { allow_submit: false, list: [] },
            tid: data.tid,
            title: data.title,
            tname: data.typename,
            videos: data.list.length
        }
        data.bangumi && (result.data.View.season = data.bangumi);
        xhrhook(`api.bilibili.com/x/web-interface/view?aid=${aid}`, undefined, (res) => {
            const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify(result.data.View)}}`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        xhrhook(`api.bilibili.com/x/web-interface/archive/stat?aid=${aid}`, undefined, (res) => {
            const t = `{"code": 0,"message":"0","ttl":1,"data":${JSON.stringify({ ...result.data.View.stat, aid })}}`;
            res.responseType === "json" ? res.response = JSON.parse(t) : res.response = res.responseText = t;
        }, false);
        return JSON.parse(JSON.stringify(result))
    }
    async function check(call: (res: any) => void) {
        try {
            toast.info(`正在进一步查询 av${aid} 的信息~`);
            const data = await xhr({
                url: `https://www.biliplus.com/api/view?id=${aid}`,
                responseType: "json"
            }, true)
            const res = view2Detail(data);
            if (res.data.View.season) {
                return location.replace(res.data.View.season.ogv_play_url);
                // 不重定向直接在av页载入Bangumi
                // avPgc = true;
                // ssid = res.data.View.season.season_id;
                // res.data.View.season.ogv_play_url.replace(/[eE][pP]\d+/, (d: string) => epid = <any>d.substring(2));;
            }
            call(res);
            setTimeout(() => {
                toast.custom(0, "warning", "这大概是一个无效av号~", "本页面使用缓存数据生成，并无法播放！", "部分上古视频还存在评论区哦~");
            }, 1e3);
        } catch (e) {
            debug.error(e);
        }

    }
    jsonphook("api.bilibili.com/x/web-interface/view/detail", undefined, (res, r, call) => {
        if (0 !== res.code) {
            const obj = urlObj(r);
            if (obj.aid) {
                aid = <number>obj.aid;
                check(call);
                return true
            }
        } else {
            if (res.data && res.data.View) {
                if (res.data.View.stein_guide_cid) {
                    sessionStorage.setItem("keepNew", 1);
                    location.reload();
                }
                Promise.resolve().then(() => {
                    config.upList && res.data.View.staff && upList(res.data.View.staff);
                    config.collection && res.data.View.is_season_display && res.data.View.ugc_season && collection(res.data.View);
                });
            }
        }
    }, false);
}