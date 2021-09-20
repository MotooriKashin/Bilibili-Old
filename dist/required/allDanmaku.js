/**
 * 本模块负责提供全弹幕装填工具
 */
(function () {
    try {
        class AllDanmaku {
            constructor(callback) {
                this.danmaku = [];
                this.callback = callback;
                toast("正在尝试获取全部弹幕请耐心等待。。。", "冷却延时请尽量调大，以免短时间内大量请求被临时封端口！");
                this.pubdate = new Date(2009, 0);
                if (API.__INITIAL_STATE__) {
                    if (API.__INITIAL_STATE__.videoData && API.__INITIAL_STATE__.videoData.pubdate) {
                        this.pubdate = new Date(1E3 * API.__INITIAL_STATE__.videoData.pubdate);
                    }
                    else if (API.__INITIAL_STATE__.epInfo && API.__INITIAL_STATE__.epInfo.pub_real_time) {
                        this.pubdate = new Date(API.__INITIAL_STATE__.epInfo.pub_real_time);
                    }
                }
                else {
                    let time = document.querySelector("div.tm-info.tminfo > time");
                    time && (this.pubdate = new Date(time.innerHTML));
                }
                this.pubdate = API.timeFormat(this.pubdate, true).split(" ")[0]; // 视频上传日期
                this.today = API.timeFormat(undefined, true).split(" ")[0]; // 当天日期
                this.time = this.today;
                this.arrP = this.pubdate.split("-");
                this.danmaku = [];
                this.init();
            }
            /**
             * 按日期拉取弹幕
             * @returns 调用月份判断
             */
            async init() {
                if (!API.uid)
                    return toast.warning("本功能需要登录！");
                if (!this.pubdate)
                    return toast.warning("投稿日期获取失败！无法获取全部弹幕！");
                try {
                    // 获取当日日期
                    this.arrT = this.time.split("-");
                    // 如果年份小于投稿日，说明获取成功
                    if (this.arrT[0] < this.arrP[0])
                        return this.done(1);
                    // 年份相等但月份小于投稿日说明获取成功
                    if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
                        return this.done(1);
                    // 年月都相等，但日期小于投稿日说明获取成功
                    if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
                        return this.done(1);
                    // 日期未早于投稿日，正常请求日期数据
                    toast("正在获取 " + this.time + " 日的弹幕。。。");
                    let danmaku = await API.getHistoryDanmaku(this.time);
                    API.sortDmById(danmaku, "idStr");
                    danmaku.reverse();
                    // 取最早一条弹幕的时间
                    this.time = API.timeFormat(danmaku[danmaku.length - 1].ctime * 1000, true).split(" ")[0];
                    this.danmaku = this.danmaku.concat(danmaku);
                    toast("数据返回！已获取弹幕数：" + API.unitFormat(this.danmaku.length));
                    this.arrT = this.time.split("-");
                    // 如果当天不是投稿日，转入日期检查
                    if (this.pubdate != this.today)
                        return this.check();
                    // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
                    this.done(1);
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e];
                    toast.error("全弹幕装填", ...e);
                    // 弹幕获取出错，载入已获取的弹幕
                    if (this.danmaku[0]) {
                        toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                        this.done();
                    }
                    else {
                        this.callback && this.callback();
                        toast.error("弹幕获取出错！", "已退出！");
                    }
                }
            }
            /**
             * 按月份判断有弹幕时间
             * @returns 调用获取日期弹幕或者循环月份判断
             */
            async check() {
                try {
                    // 如果年份小于投稿日，说明获取成功
                    if (this.arrT[0] < this.arrP[0])
                        return this.done(1);
                    // 年份相等但月份小于投稿日说明获取成功
                    if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
                        return this.done(1);
                    // 年月都相等，但日期小于投稿日说明获取成功
                    if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
                        return this.done(1);
                    // 日期未早于投稿日，正常请求月份数据
                    let data = await xhr({
                        url: API.objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
                            type: 1,
                            oid: API.cid,
                            month: this.arrT.slice(0, 2).join("-")
                        })
                    });
                    data = API.jsonCheck(data).data;
                    if (data && data[0]) {
                        // 当月有弹幕，进入日期判断
                        for (let i = data.length - 1; i >= 0; i--) {
                            let date = data[i].split("-");
                            if (date[2] < this.arrT[2]) {
                                // 当日在已获取弹幕之前，记录并跳出循环
                                this.timeT = data[i];
                                break;
                            }
                        }
                        if (this.timeT) {
                            // 延时转入日期请求
                            this.time = this.timeT;
                            this.timeT = undefined;
                            toast(`技能冷却中。。。请稍待 ${config.allDanmakuDelay} 秒钟`);
                            return setTimeout(() => this.init(), config.allDanmakuDelay * 1000);
                        }
                        else {
                            // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                            if (this.arrT[1] > 1) {
                                this.arrT[1]--;
                                this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                            }
                            else
                                this.arrT = [this.arrT[0] - 1, 12, 31];
                            toast(`获取前一个月数据 ${this.arrT.slice(0, 2).join("-")} 请稍待 ${config.allDanmakuDelay} 秒钟`);
                            return setTimeout(() => this.check(), config.allDanmakuDelay * 1000);
                        }
                    }
                    else {
                        // 当月无弹幕直接月份 -1 重载，月份等于 1 则取上年最后一天
                        if (this.arrT[1] > 1) {
                            this.arrT[1]--;
                            if (this.arrT[1] < 10)
                                this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                        }
                        else
                            this.arrT = [this.arrT[0] - 1, 12, 31];
                        toast(`获取前一个月数据 ${this.arrT.slice(0, 2).join("-")} 请稍待 ${config.allDanmakuDelay} 秒钟`);
                        return setTimeout(() => this.check(), config.allDanmakuDelay * 1000);
                    }
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e];
                    toast.error("全弹幕装填", ...e);
                    // 弹幕获取出错，载入已获取的弹幕
                    if (this.danmaku[0]) {
                        toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                        this.done();
                    }
                    else {
                        this.callback && this.callback();
                        toast.error("弹幕获取出错！", "已退出！");
                    }
                }
            }
            /**
             * 载入弹幕
             * @param boolean 判断获取成功还是失败，成功请传入真值。
             */
            async done(boolean) {
                var _a;
                try {
                    // 历史弹幕里不包含代码弹幕必须额外处理
                    toast("正在获取BAS/代码弹幕专包。。。");
                    this.danmaku = this.danmaku.concat(await API.getSegDanmaku(undefined, undefined, true));
                    toast("数据返回！正在整合。。。");
                }
                catch (e) { }
                let danmaku = API.danmakuFormat(this.danmaku, API.aid);
                if (boolean)
                    toast.success("全弹幕获取成功，正在装填。。。", "总弹幕量：" + API.unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π");
                (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(danmaku);
                API.danmaku = danmaku;
                this.callback && this.callback();
            }
        }
        API.allDanmaku = (callback) => { new AllDanmaku(callback); };
    }
    catch (e) {
        API.trace(e, "allDanmaku.js", true);
    }
})();
