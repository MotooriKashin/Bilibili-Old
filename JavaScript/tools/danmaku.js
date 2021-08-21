"use strict";
/**
 * 本模块提供各种弹幕相关工具，负责获取、转化等弹幕处理功能
 * `本模块按需加载，使用相关函数前请务必先载入本模块`
 * 新版弹幕相关功能调用了开源项目`protobufjs`，非常感谢，相关信息如下
 * @see protobufjs {@link https://github.com/protobufjs/protobuf.js}
 * @license BSD 3-Clause
 */
(function () {
    class Danmaku {
        static root;
        static protoSeg;
        static protoView;
        constructor() {
            API.importModule("protobuf");
            Danmaku.root = window.protobuf.Root.fromJSON(JSON.parse(GM.getResourceText("protobuf.json")));
            Danmaku.protoSeg = Danmaku.root.lookupType('bilibili.DmSegMobileReply');
            Danmaku.protoView = Danmaku.root.lookupType('bilibili.DmWebViewReply');
        }
        /**
         * 生成xml形式的弹幕
         * @param  danmaku protoSeg.decode(new Uint8Array(this.response)).elems
         * @returns 委托对象，表示生成的xml形式的弹幕字符串
         */
        toXml(danmaku) {
            return new Promise((resolve) => {
                this.sortDmById(danmaku, "idStr");
                let attr = [], xml = '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + API.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>\r\n';
                for (let i = 0; i < danmaku.length; i++) {
                    attr[0] = danmaku[i].progress / 1000;
                    attr[1] = danmaku[i].mode;
                    attr[2] = danmaku[i].fontsize;
                    attr[3] = danmaku[i].color;
                    attr[4] = danmaku[i].ctime;
                    attr[5] = danmaku[i].pool;
                    attr[6] = danmaku[i].midHash;
                    attr[7] = danmaku[i].idStr;
                    xml += '<d p="' + attr.join(",") + '">' + danmaku[i].content.replace(/[<">'&]/g, (a) => { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a]; }) + '</d>\r\n';
                }
                xml += "</i>";
                /**
                 * remove-invalid-xml-characters.js
                 * @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
                 * @license MIT
                 * @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
                 */
                var regex = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
                resolve(xml.replace(regex, ''));
            });
        }
        /**
         * 将弹幕数组按弹幕id升序排序
         * @param danmaku 要排序的弹幕数组
         * @param key 弹幕id的属性名，应为dmid或idStr
         */
        sortDmById(danmaku, key) {
            let egx = /^\d+$/;
            for (let i = 0, d; i < danmaku.length; i++) {
                d = danmaku[i];
                // 判断输入是否纯数字
                if (!egx.test(d[key]))
                    throw "请输入数字字符串";
                // 强制转化输入为字符串
                if (typeof d[key] !== "string")
                    d[key] = String(d[key]);
                // 去除数字开头占位的0
                d[key] = d[key].replace(/^0+/, "");
            }
            danmaku.sort((a, b) => this.bigInt(a[key], b[key]) ? 1 : -1);
        }
        /**
         * 比较大小，仅用于弹幕排序
         * @param num1 数字字符串 1
         * @param num2 数字字符串 2
         * @returns 前者大于后者返回真，否则返回假，相等也返回假
         */
        bigInt(num1, num2) {
            // 数位不同，前者大为真，否则为假
            if (num1.length > num2.length)
                return true;
            else if (num1.length < num2.length)
                return false;
            else {
                // 数位相同，逐位比较
                for (let i = 0; i < num1.length; i++) {
                    // 任意一位前者大为真
                    if (num1[i] > num2[i])
                        return true;
                    // 任意一位前者小为假
                    if (num1[i] < num2[i])
                        return false;
                    // 仅当位相等时继续比较下一位
                }
                // 包括相等情况返回假
                return false;
            }
        }
        /**
         * 获取 proto 弹幕
         * @param aid 弹幕所对应视频的 aid，当前视频请留空
         * @param cid 弹幕所对应视频的 cid，当前视频请留空
         * @param bas 是否只获取BAS/代码弹幕，默认请留空
         * @returns 弹幕数组：Promise
         */
        async getSegDanmaku(aid = API.aid, cid = API.cid, bas = false) {
            try {
                // 判断参数是否有效
                aid = aid || API.aid;
                cid = cid || API.cid;
                if (!aid || !cid)
                    throw ["弹幕参数错误！", "aid：" + aid, "cid：" + cid];
                // 首先获取弹幕分片总数
                let config = await API.xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/view", {
                        type: String(1),
                        oid: String(cid),
                        pid: String(aid)
                    }),
                    responseType: "arraybuffer"
                });
                config = Danmaku.protoView.decode(new Uint8Array(config));
                // dmSge.total代表的分片总数，有时错误地为100
                // 故需要按照 视频时长/分片时长(一般是360秒) 把分片总数计算出来
                let pageSize = config.dmSge.pageSize ? config.dmSge.pageSize / 1000 : 360;
                let total = (window.player && window.player.getDuration && (window.player.getDuration() / pageSize + 1)) || config.dmSge.total;
                let allrequset = [], allDanmaku = [];
                // 其他视频的分片总数已经不能从当前window下获取
                if (API.aid && (aid != API.aid))
                    total = config.dmSge.total;
                if (!bas) {
                    // 特殊情况下只需要BAS/高级弹幕时 bas为真
                    for (let index = 1; index <= total; index++) {
                        allrequset.push(API.xhr({
                            url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/seg.so", {
                                type: String(1),
                                oid: String(cid),
                                pid: String(aid),
                                segment_index: String(index)
                            }),
                            responseType: "arraybuffer"
                        }));
                    }
                }
                // BAS弹幕
                if (config.specialDms.length > 0) {
                    for (let index = 0; index < config.specialDms.length; index++) {
                        // 下发的是http链接，但会被chrome的安全措施拦掉，于是替换成https
                        allrequset.push(API.xhr({
                            url: config.specialDms[index].replace("http", "https"),
                            responseType: "arraybuffer",
                            credentials: false
                        }));
                    }
                }
                // 互动弹幕
                let upHighlightDm = []; // 带有蓝色“UP主”特殊标记的弹幕
                if (config.commandDms.length > 0) {
                    for (let i = 0; i < config.commandDms.length; i++) {
                        let cdm = config.commandDms[i];
                        if (cdm.command == "#UP#") {
                            cdm.styleClass = "danmaku-up-icon";
                            cdm.color = 16777215;
                            cdm.pool = 0;
                            cdm.fontsize = 25;
                            cdm.ctime = new Date(cdm.mtime).getTime() / 1000;
                            cdm.mode = 1;
                            API.importModule("crc32.js");
                            cdm.midHash = API.crc32 && API.crc32(cdm.mid);
                            upHighlightDm.push(cdm);
                            config.commandDms.splice(i, 1);
                        }
                    }
                    if (API.loadCommandDm)
                        API.loadCommandDm(config.commandDms, aid, cid);
                }
                // 解码弹幕
                (await Promise.all(allrequset)).forEach(d => {
                    if (d)
                        allDanmaku = allDanmaku.concat(Danmaku.protoSeg.decode(new Uint8Array(d)).elems);
                });
                return allDanmaku.concat(upHighlightDm);
            }
            catch (e) {
                API.debug.trace(e, "danmaku.js", true);
            }
        }
        /**
         * 获取历史弹幕
         * @param date 历史弹幕日期，yyyy-mm-dd格式：如 2009-06-24
         * @param cid 弹幕所在视频的 cid，不填则取当前视频的cid
         * @returns 解析好的弹幕数组
         */
        async getHistoryDanmaku(date, cid = API.cid) {
            if (!date || !API.uid)
                return;
            cid = cid || API.cid;
            let dm = await API.xhr({
                url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/history/seg.so", {
                    type: String(1),
                    oid: String(cid),
                    date: date
                }),
                responseType: "arraybuffer"
            });
            return this.segDmDecode(dm);
        }
        /**
         * 载入本地弹幕
         * @param xml 读取本地弹幕文件得到的字符串
         * @param append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
         */
        loadLocalDm(xml, append) {
            let doc = new DOMParser().parseFromString(xml, "application/xml");
            let dm = doc.querySelectorAll("d");
            if (dm.length == 0) {
                API.toast.warning("从弹幕文件中没有获取到任何弹幕！");
                return;
            }
            let danmaku = [];
            let attr, v, mode;
            for (let i = 0; i < dm.length; i++) {
                v = dm[i];
                attr = v.getAttribute('p').split(",");
                mode = parseInt(attr[1]);
                danmaku[i] = {
                    class: parseInt(attr[5]),
                    color: parseInt(attr[3]),
                    date: parseInt(attr[4]),
                    dmid: attr[7],
                    mode: mode,
                    size: parseInt(attr[2]),
                    stime: parseFloat(attr[0]),
                    text: ((mode != 8 && mode != 9) ? v.textContent.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.textContent),
                    uid: attr[6]
                };
            }
            this.specialEffects(danmaku);
            this.sortDmById(danmaku, "dmid");
            /**
             * bilibiliPlayer.js 21394行已经添加如下代码，用于设置弹幕池
             * @param  {Array} dm 弹幕数组
             * @param  {Boolean} append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
             */
            // setDanmaku = (dm) => {......}
            if (!window.setDanmaku)
                return API.toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
            window.setDanmaku(danmaku, append);
        }
        /**
         * 把有换行符的弹幕的zindex设为它的出现时间(progress)，并且打上“字幕弹幕”标记
         * @param dm 弹幕数组
         */
        specialEffects(dm) {
            let textData;
            for (let i = 0; i < dm.length; i++) {
                textData = dm[i];
                if (textData.text.includes('\n')) {
                    textData.class = 1;
                    textData.zIndex = textData.stime * 1000;
                    if (!(textData.text.includes("█") || textData.text.includes("▂")))
                        textData.zIndex = textData.zIndex + 1;
                }
            }
        }
        segDmDecode(response) {
            return Danmaku.protoSeg.decode(new Uint8Array(response)).elems;
        }
        /**
         * 将新版弹幕数组转化为旧版弹幕数组
         * @param dm 新版弹幕数组
         * @param aid 视频aid，默认取当前视频aid
         * @returns 旧版弹幕数组
         */
        danmakuFormat(dm, aid) {
            aid = aid || API.aid;
            let danmaku = dm.map(function (v) {
                let result = {
                    class: v.pool,
                    color: v.color,
                    date: v.ctime,
                    dmid: v.idStr,
                    mode: v.mode,
                    size: v.fontsize,
                    stime: v.progress / 1000,
                    text: (v.mode != 8 && v.mode != 9) ? v.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.content,
                    uid: v.midHash
                };
                // 添加图片弹幕信息
                if (v.action && v.action.startsWith("picture:"))
                    result.picture = "//" + v.action.split(":")[1];
                // 利用bilibiliPlayer.js的这行代码，可以添加指定的css类到弹幕上
                // b.AH && (e.className = e.className + " " + b.AH);
                if (v.styleClass !== undefined)
                    result.AH = v.styleClass;
                return result;
            });
            //对av400000(2012年11月)之前视频中含有"/n"的弹幕的进行专门处理
            if (aid && aid < 400000) {
                this.specialEffects(danmaku);
            }
            this.sortDmById(danmaku, "dmid");
            return danmaku;
        }
    }
    const DM = new Danmaku();
    API.getSegDanmaku = (aid = API.aid, cid = API.cid, bas = false) => DM.getSegDanmaku(aid, cid, bas);
    API.specialEffects = (dm) => DM.specialEffects(dm);
    API.sortDmById = (danmaku, key) => DM.sortDmById(danmaku, key);
    API.toXml = (danmaku) => DM.toXml(danmaku);
    API.getHistoryDanmaku = (date, cid) => DM.getHistoryDanmaku(date, cid);
    API.loadLocalDm = (xml, append) => DM.loadLocalDm(xml, append);
    API.segDmDecode = (response) => DM.segDmDecode(response);
    API.danmakuFormat = (dm, aid) => DM.danmakuFormat(dm, aid);
})();
