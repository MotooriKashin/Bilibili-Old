/**
 * 本模块负责基于av页重构为媒体页
 */
(function () {
    if (config.medialist && /\/medialist\/play\//.test(location.href)) {
        if (/ml\d+/.test(location.href)) {
            API.xhrhook(["medialist/resource/list?", "biz_id"], function (args) {
                const obj = API.urlObj(args[1]);
                sessionStorage.setItem("medialist", obj.biz_id);
                this.addEventListener("readystatechange", () => {
                    if (this.readyState === 4) {
                        if (!this.response) throw this;
                        const response = API.jsonCheck(this.response);
                        response.data && response.data.media_list && location.replace(`https://www.bilibili.com/video/av${response.data.media_list[0].id}`)
                    }
                });
            })
        } else toast.warning("抱歉！", `这不是一个固定的媒体播放列表，已禁用旧版模拟！`)
    }
    // 新版稍后再看跳转到旧版稍后再看
    if (API.path[5] && API.path[5].startsWith("watchlater") && config.watchlater) location.replace("https://www.bilibili.com/watchlater/#/");
    if (!/\/video\/[AaBb][Vv]/.test(location.href)) return;
    let mid = sessionStorage.getItem("medialist");
    sessionStorage.removeItem("medialist");
    try {
        toast("重构媒体页信息中...");
        let avs: any[] = [], value: any[] = [], promises: any[] = [], ids: any[] = [];
        xhr({
            url: `https://api.bilibili.com/x/v1/medialist/resource/ids4Player?media_id=${mid}`,
            credentials: true
        }).then(async (d: any) => {
            let data = API.jsonCheck(d).data;
            for (let i = 0; i < data.medias.length; i++) {
                ids[i] = data.medias[i].id;
                avs[i] = "av" + data.medias[i].id;
            }
            // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
            while (avs.length) {
                let i = avs.length > 20 ? 20 : avs.length;
                value = avs.splice(0, i);
                promises.push(xhr({
                    url: API.objUrl("https://api.bilibili.com/x/article/cards", { "ids": value.join("%2C") }),
                    credentials: true
                }));
            }
            value = [];
            data = await Promise.all(promises);
            // 格式化数据并排序
            for (let i = 0; i < data.length; i++) {
                data[i] = API.jsonCheck(data[i]);
                for (let key in data[i].data) avs.push(data[i].data[key]);
            }
            for (let i = 0; i < ids.length; i++) {
                for (let j = 0; j < avs.length; j++) {
                    if (avs[j].aid == ids[i]) {
                        value.push(avs[j]);
                        break;
                    }
                }

            }
            ids = value;
            API.runWhile(() => (<any>window).BilibiliPlayer, () => {
                // 将视频列表重构为稍后再看列表
                for (let i = 0; i < ids.length; i++) {
                    ids[i].progress = 0;
                    ids[i].add_at = ids[i].ctime;
                    ids[i].pages = [];
                    ids[i].pages[0] = {};
                    ids[i].pages[0].cid = ids[i].cid;
                    ids[i].pages[0].dimension = ids[i].dimension;
                    ids[i].pages[0].duration = ids[i].duration;
                    ids[i].pages[0].from = "vupload";
                    ids[i].pages[0].page = 1;
                    ids[i].pages[0].part = ids[i].title;
                    ids[i].pages[0].vid = "";
                    ids[i].pages[0].weblink = "";
                }
                let toview = { "code": 0, "message": "0", "ttl": 1, "data": { "count": ids.length, "list": ids } };
                let oid = ids[0].aid; // 保存当前aid以判断切p
                debug("收藏列表", toview);
                toast.success("重构成功！刷新播放器...");
                window.player.destroy();
                (<any>window).BilibiliPlayer({ "aid": ids[0].aid, "cid": ids[0].cid, "watchlater": encodeURIComponent(JSON.stringify(toview)) });
                API.runWhile(() => document.getElementsByClassName("bpui-button-text")[1], () => (<any>document.getElementsByClassName("bpui-button-text")[1].firstChild).innerText = "收藏列表");
                API.switchVideo(() => {
                    if (!API.aid) API.aid = (<any>window).aid || API.aid;
                    if (oid && oid != (<any>window).aid) {
                        API.aid = (<any>window).aid || API.aid;
                        toast("刷新页面信息...");
                        history.replaceState(null, "", "https://www.bilibili.com/video/av" + API.aid + location.search + location.hash);
                        for (let i = 0; i < ids.length; i++) if (ids[i].aid == API.aid) data = ids[i];
                        let video_info = <HTMLElement>document.getElementById("viewbox_report");
                        let up_info = <HTMLElement>document.getElementById("v_upinfo")
                        let arc_toolbar_report = <HTMLElement>document.getElementById("arc_toolbar_report");
                        document.title = data.title;
                        video_info.innerHTML = '<h1 title="' + data.title + '"><!----><span>' + data.title + '</span></h1>' +
                            '<div class="tm-info tminfo"><span class="crumb"><a href="//www.bilibili.com">主页</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/">动画</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/mad/">MAD·AMV</a></span><time>' + API.timeFormat(data.pubdate * 1000, true) + '</time><a class="btn-appeal">稿件投诉</a></div>' +
                            '<div class="number"><span title="总播放数' + data.stat.view + '" class="v play">' + API.unitFormat(data.stat.view) + '</span><span title="总弹幕数' + data.stat.danmaku + '" class="v dm">' + API.unitFormat(data.stat.danmaku) + '</span><span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出" class="v rank">最高全站日排行' + data.stat.like + '名</span><span class="line"></span><span class="u like" style="margin-right : 5px;" title="点赞人数' + data.stat.his_rank + '"><i class="l-icon-move" style="width : 22px;height : 22px;background-position : -660px -2068px;"></i><b class="l-icon-moved" style="width : 22px;height : 22px;background-position : -725px -2068px;display : none;"></b> 点赞 ' + API.unitFormat(data.stat.like) + '</span><span report-id="coinbtn1" title="投硬币枚数' + data.stat.coin + '" class="u coin"><i class="c-icon-move"></i><b class="c-icon-moved" style="background-position: -2340px -60px; display: none;"></b> 硬币 ' + API.unitFormat(data.stat.coin) + '</span> <span report-id="collect1" title="收藏人数' + data.stat.favorite + '" class="u fav"><i class="f-icon-move" style="background-position: 0px 0px;"></i><b class="f-icon-moved" style="background-position: -1740px -60px; display: none;"></b> 收藏 ' + API.unitFormat(data.stat.favorite) + '</span></div>';
                        up_info.innerHTML = '<div class="u-face fl"><!----><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="head" class="a"><img src="' + data.owner.face + '@68w_68h.webp" width="68" height="68" class="up-face" /><!----><!----><i title="企业/团体认证" class="auth o-auth"></i></a></div>' +
                            '<div class="info"><div class="user clearfix"><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="name" class="name is-vip">' + data.owner.name + '</a><a href="//message.bilibili.com/#whisper/mid' + data.owner.mid + '" target="_blank" report-id="message" class="message icon">发消息</a></div><div class="sign static"><span>up主简介</span><!----></div><div class="number clearfix"><span title="投稿数--">投稿：--</span><span title="粉丝数--">粉丝：--</span></div><div class="btn followe"><a report-id="follow1" class="bi-btn b-gz"><span class="gz">+ 关注</span><span class="ygz">已关注</span><span class="qxgz">取消关注</span></a><a report-id="charge" class="bi-btn b-cd elecrank-btn"><span class="cd">充电</span><span class="wtcd">为TA充电</span></a></div></div>';
                        (<any>arc_toolbar_report.children[0].children[0]).title = "分享人数" + data.stat.share;
                        arc_toolbar_report.children[0].children[0].innerHTML = '<span class="t">分享</span><span class="num">' + API.unitFormat(data.stat.share) + '</span><i class="icon"></i>';
                        (<any>arc_toolbar_report.children[2]).title = "收藏人数" + data.stat.favorite;
                        arc_toolbar_report.children[2].innerHTML = '<div class="btn-item"><i class="icon-move f-icon-moved" style="display: none;"></i><b class="icon-move f-icon-move"></b><span class="t">收藏</span><span class="num">' + API.unitFormat(data.stat.favorite) + '</span></div>';
                        (<any>arc_toolbar_report.children[3]).title = "投硬币枚数" + data.stat.coin;
                        arc_toolbar_report.children[3].innerHTML = '<div class="btn-item"><i class="icon-move c-icon-moved" style="display: none;"></i><b class="icon-move c-icon-move"></b><span class="t">硬币</span><span class="num">' + API.unitFormat(data.stat.coin) + '</span></div>';
                        (<HTMLElement>document.getElementById("v_tag")).children[0].setAttribute("hidden", "hidden");
                        (<any>(<HTMLElement>document.getElementById("v_desc")).children[1]).innerText = data.desc;
                        new (<any>window).bbComment(".comment", (<any>window).aid, 1, (<any>window).UserStatus.userInfo, "");
                        data.stat.like ? video_info.children[2].children[2].setAttribute("style", "display: inline-block;") : video_info.children[2].children[2].setAttribute("style", "display: none;");
                        API.runWhile(() => document.getElementsByClassName("bpui-button-text")[1], () => (<any>document.getElementsByClassName("bpui-button-text")[1].firstChild).innerText = "收藏列表");
                    }
                })
            })
        })
    } catch (e) { toast.error("mediaList.js", e) }
})();