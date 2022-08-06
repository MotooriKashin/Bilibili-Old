import { bezier } from "../runtime/lib/cubic_bezier";
import { debug } from "../runtime/debug";
import { doWhile } from "../runtime/do_while";
import { addCss } from "../runtime/element/add_element";
import { createElements } from "../runtime/element/create_element";
import { htmlVnode } from "../runtime/element/html_vnode";
import { subArray } from "../runtime/format/sub_array";
import { jsonphookasync } from "../runtime/hook/node";
import { setting } from "../runtime/setting";
import bannerStyle from "./animated_banner.html";

export const primaryMenu = () => {
    doWhile(() => document.querySelector("#primary_menu"), () => {
        const vue = (<any>document.querySelector("#primary_menu")).__vue__;
        vue.menuList.forEach((d: any, i: number, s: any) => {
            switch (d.name) {
                case "动画": s[i].sub = [{ "name": "MAD·AMV", "route": "mad", "tid": 24, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 151 }, "desc": "具有一定制作程度的动画或静画的二次创作视频", "url": "//www.bilibili.com/video/douga-mad-1.html" }, { "name": "MMD·3D", "route": "mmd", "tid": 25, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 152 }, "desc": "使用MMD（MikuMikuDance）和其他3D建模类软件制作的视频", "url": "//www.bilibili.com/video/douga-mmd-1.html" }, { "name": "短片·手书·配音", "route": "voice", "tid": 47, "ps": 15, "rps": 10, "desc": "追求创新并具有强烈特色的短片、手书（绘）及ACG相关配音", "url": "//www.bilibili.com/video/douga-voice-1.html" }, { "name": "手办·模玩", "route": "garage_kit", "tid": 210, "ps": 15, "rps": 10, "desc": "手办模玩的测评、改造或其他衍生内容", "url": "" }, { "name": "特摄", "route": "tokusatsu", "tid": 86, "ps": 15, "rps": 10, "desc": "特摄相关衍生视频", "url": "//www.bilibili.com/video/cinephile-tokusatsu.html" }, { "name": "综合", "route": "other", "tid": 27, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 153 }, "desc": "以动画及动画相关内容为素材，包括但不仅限于音频替换、杂谈、排行榜等内容", "url": "//www.bilibili.com/video/douga-else-1.html" }];
                    break;
                case "音乐": s[i].sub = [{ "name": "原创音乐", "route": "original", "tid": 28, "ps": 15, "rps": 10, "viewHotTag": true, "ad": { "active": true, "dataLocId": 243 }, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "原创歌曲及纯音乐，包括改编、重编曲及remix", "url": "//www.bilibili.com/video/music-original-1.html" }, { "name": "翻唱", "route": "cover", "tid": 31, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 245 }, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "对曲目的人声再演绎视频", "url": "//www.bilibili.com/video/music-Cover-1.html" }, { "name": "演奏", "route": "perform", "tid": 59, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "乐器和非传统乐器器材的演奏作品", "url": "//www.bilibili.com/video/music-perform-1.html" }, { "name": "VOCALOID·UTAU", "route": "vocaloid", "tid": 30, "ps": 15, "rps": 10, "viewHotTag": true, "ad": { "active": true, "dataLocId": 247 }, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "以VOCALOID等歌声合成引擎为基础，运用各类音源进行的创作", "url": "//www.bilibili.com/video/music-vocaloid-1.html" }, { "name": "音乐现场", "route": "live", "tid": 29, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "音乐表演的实况视频，包括官方/个人拍摄的综艺节目、音乐剧、音乐节、演唱会等", "url": "//www.bilibili.com/video/music-oped-1.html" }, { "name": "MV", "route": "mv", "tid": 193, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "为音乐作品配合拍摄或制作的音乐录影带（Music Video），以及自制拍摄、剪辑、翻拍MV", "url": "//www.bilibili.com/video/music-coordinate-1.html" }, { "name": "乐评盘点", "route": "commentary", "tid": 243, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "音乐类新闻、盘点、点评、reaction、榜单、采访、幕后故事、唱片开箱等", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音乐教学", "route": "tutorial", "tid": 244, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "以音乐教学为目的的内容", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音乐综合", "route": "other", "tid": 130, "ps": 15, "rps": 10, "viewHotTag": true, "dpConfig": [{ "name": "一日", "value": 1 }, { "name": "三日", "value": 3 }], "desc": "所有无法被收纳到其他音乐二级分区的音乐类视频", "url": "//www.bilibili.com/video/music-collection-1.html" }, { "name": "音频", "customZone": "Audio", "route": "audio", "url": "//www.bilibili.com/audio/home?musicType=music" }, { "name": "说唱", "url": "//www.bilibili.com/v/rap" }];
                    break;
                case "科技": s[i].name = "知识";
                    s[i].route = "knowledge";
                    s[i].sub = [{ "name": "科学科普", "route": "science", "tid": 201, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 261 }, "desc": "回答你的十万个为什么" }, { "name": "社科·法律·心理", "route": "social_science", "tid": 124, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 263 }, "desc": "基于社会科学、法学、心理学展开或个人观点输出的知识视频" }, { "name": "人文历史", "route": "humanity_history", "tid": 228, "ps": 15, "rps": 10, "desc": "看看古今人物，聊聊历史过往，品品文学典籍" }, { "name": "财经商业", "route": "business", "tid": 207, "ps": 15, "rps": 10, "desc": "说金融市场，谈宏观经济，一起畅聊商业故事" }, { "name": "校园学习", "route": "campus", "tid": 208, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 265 }, "desc": "老师很有趣，学生也有才，我们一起搞学习" }, { "name": "职业职场", "route": "career", "tid": 209, "ps": 15, "rps": 10, "desc": "职业分享、升级指南，一起成为最有料的职场人" }, { "name": "设计·创意", "route": "design", "tid": 229, "ps": 15, "rps": 10, "desc": "天马行空，创意设计，都在这里" }, { "name": "野生技能协会", "route": "skill", "tid": 122, "ps": 15, "rps": 10, "desc": "技能党集合，是时候展示真正的技术了" }];
                    break;
                case "数码": s[i].name = "科技";
                    s[i].route = "tech";
                    s[i].sub = [{ "name": "数码", "route": "digital", "tid": 95, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "科技数码产品大全，一起来做发烧友", "url": "#" }, { "name": "软件应用", "route": "application", "tid": 230, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "超全软件应用指南", "url": "#" }, { "name": "计算机技术", "route": "computer_tech", "tid": 231, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "研究分析、教学演示、经验分享......有关计算机技术的都在这里", "url": "#" }, { "name": "科工机械", "route": "industry", "tid": 232, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "从小芯片到大工程，一起见证科工力量", "url": "#" }, { "name": "极客DIY", "route": "diy", "tid": 233, "ps": 15, "rps": 10, "viewHotTag": true, "desc": "炫酷技能，极客文化，硬核技巧，准备好你的惊讶", "url": "#" }];
                    break;
                case "生活": s[i].sub = [{ "name": "搞笑", "route": "funny", "tid": 138, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 273 }, "desc": "各种沙雕有趣的搞笑剪辑，挑战，表演，配音等视频", "url": "//www.bilibili.com/video/ent_funny_1.html", "locid": 4204, "recommendId": 4210, "slider": { "width": 620, "height": 220 }, "customComponent": { "name": "Energy", "leftId": 4212, "rightId": 4218, "rightType": "slide" } }, { "name": "家居房产", "route": "home", "tid": 239, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 275 }, "desc": "与买房、装修、居家生活相关的分享", "url": "#" }, { "name": "手工", "route": "handmake", "tid": 161, "ps": 15, "rps": 10, "desc": "手工制品的制作过程或成品展示、教程、测评类视频", "url": "//www.bilibili.com/video/ent-handmake-1.html" }, { "name": "绘画", "route": "painting", "tid": 162, "ps": 15, "rps": 10, "desc": "绘画过程或绘画教程，以及绘画相关的所有视频", "url": "//www.bilibili.com/video/ent-painting-1.html" }, { "name": "日常", "route": "daily", "tid": 21, "ps": 15, "rps": 10, "desc": "记录日常生活，分享生活故事", "url": "//www.bilibili.com/video/ent-life-1.html" }];
                    break;
                case "鬼畜": s[i].sub = [{ "name": "鬼畜调教", "route": "guide", "tid": 22, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 285 }, "desc": "使用素材在音频、画面上做一定处理，达到与BGM一定的同步感", "url": "//www.bilibili.com/video/ent-Kichiku-1.html" }, { "name": "音MAD", "route": "mad", "tid": 26, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 287 }, "desc": "使用素材音频进行一定的二次创作来达到还原原曲的非商业性质稿件", "url": "//www.bilibili.com/video/douga-kichiku-1.html" }, { "name": "人力VOCALOID", "route": "manual_vocaloid", "tid": 126, "ps": 15, "rps": 10, "desc": "将人物或者角色的无伴奏素材进行人工调音，使其就像VOCALOID一样歌唱的技术", "url": "//www.bilibili.com/video/kichiku-manual_vocaloid-1.html" }, { "name": "鬼畜剧场", "route": "theatre", "tid": 216, "ps": 15, "rps": 10, "desc": "使用素材进行人工剪辑编排的有剧情的作品" }, { "name": "教程演示", "route": "course", "tid": 127, "ps": 10, "rps": 6, "rightComponent": { "name": "CmImgList", "id": 148 }, "ad": { "active": true, "dataLocId": 289 }, "hideDropdown": false, "desc": "鬼畜相关的教程演示", "url": "//www.bilibili.com/video/kichiku-course-1.html" }];
                    break;
                case "时尚": s[i].sub = [{ "name": "美妆护肤", "route": "makeup", "tid": 157, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 279 }, "desc": "彩妆护肤、美甲美发、仿妆、医美相关内容分享或产品测评", "url": "//www.bilibili.com/video/fashion-makeup-fitness-1.html" }, { "name": "穿搭", "route": "clothing", "tid": 158, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 281 }, "desc": "穿搭风格、穿搭技巧的展示分享，涵盖衣服、鞋靴、箱包配件、配饰（帽子、钟表、珠宝首饰）等", "url": "//www.bilibili.com/video/fashion-clothing-1.html" }, { "name": "时尚潮流", "route": "trend", "tid": 159, "ps": 15, "rps": 10, "desc": "时尚街拍、时装周、时尚大片，时尚品牌、潮流等行业相关记录及知识科普", "url": "#" }];
                    break;
                case "广告": s[i].name = "资讯";
                    s[i].route = "information";
                    s[i].tid = 202;
                    s[i].sub = [{ "name": "热点", "route": "hotspot", "tid": 203, "ps": 18, "rps": 10, "desc": "全民关注的时政热门资讯" }, { "name": "环球", "route": "global", "tid": 204, "ps": 18, "rps": 10, "desc": "全球范围内发生的具有重大影响力的事件动态" }, { "name": "社会", "route": "social", "tid": 205, "ps": 18, "rps": 10, "desc": "日常生活的社会事件、社会问题、社会风貌的报道" }, { "name": "综合", "route": "multiple", "tid": 206, "ps": 18, "rps": 10, "desc": "除上述领域外其它垂直领域的综合资讯" }];
                    break;
                case "娱乐": s[i].sub = [{ "name": "综艺", "route": "variety", "tid": 71, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 267 }, "desc": "所有综艺相关，全部一手掌握！", "url": "//www.bilibili.com/video/ent-variety-1.html" }, { "name": "娱乐杂谈", "route": "talker", "tid": 241, "ps": 15, "rps": 10, "ad": { "active": true, "dataLocId": 269 }, "desc": "娱乐人物解读、娱乐热点点评、娱乐行业分析" }, { "name": "粉丝创作", "route": "fans", "tid": 242, "ps": 15, "rps": 10, "desc": "粉丝向创作视频" }, { "name": "明星综合", "route": "celebrity", "tid": 137, "ps": 15, "rps": 10, "desc": "娱乐圈动态、明星资讯相关" }];
                    break;
            }
        });
    });
    // 顶栏广场
    jsonphookasync("api.bilibili.com/plaza/banner", () => true, async () => {
        return { "code": 0, "result": [{ "link": "https://www.bilibili.com/blackboard/x/act_list", "end": 1640966407, "begin": 1456709887, "title": "bilibili 活动", "cover": "http://i0.hdslb.com/bfs/square/6830d0e479eee8cc9a42c3e375ca99a5147390cd.jpg", "id": 9, "created_ts": 1491386053 }, { "link": "http://www.bilibili.com/blackboard/topic_list.html", "end": 1640966418, "begin": 1544258598, "title": "话题列表", "cover": "http://i0.hdslb.com/bfs/square/b1b00a0c3ce8570b48277ae07a2e55603a4a4ddf.jpg", "id": 17, "created_ts": 1491386030 }] }
    }, false);
    // 顶栏动图
    jsonphookasync("api.bilibili.com/x/web-interface/index/icon", undefined, async () => {
        const data = await fetch("https://www.bilibili.com/index/index-icon.json").then(d => d.json());
        return {
            code: 0,
            data: subArray(data.fix),
            message: "0",
            ttl: 1
        }
    }, false);
}

export const banner = () => {
    document.head.appendChild(createElements(htmlVnode(bannerStyle)));
    // 动态banner。移植自B站vue源码
    class Animate {
        static once = false;
        /** 缓存已请求内容 */
        static record: Record<string, any> = {};
        /** 资源id */
        static rid = this.resourceId();
        /** locs列表 */
        static locs = [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142];
        /**
         * 有在启用了动画banner的配置，且浏览器支持css filter时才加载动画banner的图片资源  
         * safari浏览器在mac屏幕上模糊效果有性能问题，不开启
         */
        animatedBannerSupport =
            typeof CSS !== 'undefined' && CSS.supports && CSS.supports('filter: blur(1px)')
            && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        layerConfig: {
            extensions: {
                time: any
            },
            layers: {
                blur: any,
                id: number,
                name: string,
                opacity: { wrap: string, initial?: any, offset?: any, offsetCurve?: any },
                resources: { id: number, src: string }[],
                rotate: any,
                scale: { initial: number, offset?: any, offsetCurve?: any },
                translate: { offset: number[], initial?: any, offsetCurve?: any },
                _initState: any;
            }[]
        } = <any>{};
        /** layer表单 */
        resources: (HTMLVideoElement | HTMLImageElement)[] = [];
        /** container 元素上有其他元素，需使用全局事件判断鼠标位置 */
        entered = false;
        extensions: any[] = [];
        handleMouseLeave: (e: any) => void = <any>undefined;
        handleMouseMove: (e: any) => void = <any>undefined;
        handleResize: (e: any) => void = <any>undefined;
        constructor(v: any) {
            if (this.animatedBannerSupport) this.mounted(v);
            if (v.is_split_layer !== 0) {
                addCss(".blur-bg {display:none}");
            } else
                addCss(".blur-bg {background:none !important;-webkit-backdrop-filter: blur(4px);backdrop-filter: blur(4px)}");
        }
        /**
         * 根据页面返回resourceId
         * @returns resourceId
         */
        static resourceId() {
            if (location.href.includes("v/douga")) return 1576;
            if (location.href.includes("/anime")) return 1612;
            if (location.href.includes("v/music")) return 1580;
            if (location.href.includes("/guochuang")) return 1920;
            if (location.href.includes("v/dance")) return 1584;
            if (location.href.includes("v/game")) return 1588;
            if (location.href.includes("v/knowledge")) return 1592;
            if (location.href.includes("v/tech")) return 3129;
            if (location.href.includes("v/life")) return 1600;
            if (location.href.includes("v/kichiku")) return 1608;
            if (location.href.includes("v/fashion")) return 1604;
            if (location.href.includes("v/ent")) return 1596;
            if (location.href.includes("v/cinephile")) return 2210;
            if (location.href.includes("/cinema")) return 1634;
            return 142;
        }
        async mounted(v: any) {
            this.layerConfig = JSON.parse(v.split_layer);
            if (!this.layerConfig.layers) return;
            try {
                if ("extensions" in this.layerConfig && "time" in this.layerConfig.extensions) {
                    let time: number = <any>undefined, now = (Date.now() - (new Date).setHours(0, 0, 0, 0)) / 1e3;
                    let timeCode = Object.keys(this.layerConfig.extensions.time).sort((a, b) => parseInt(a) - parseInt(b));
                    for (let t of timeCode) {
                        if (parseInt(t) < now) time = parseInt(t);
                        else break;
                    }
                    let timelayers = this.layerConfig.extensions.time[time];
                    this.layerConfig.layers = timelayers[Math.floor(Math.random() * timelayers.length)].layers;
                }
                await Promise.all(this.layerConfig.layers.map(async (v, index) => {
                    return Promise.all(v.resources.map(async (i) => {
                        if (/\.(webm|mp4)$/.test(i.src)) {
                            const res = await fetch(i.src).then(d => d.blob());
                            const url = URL.createObjectURL(res);
                            const video = document.createElement('video');
                            video.muted = true;
                            // video.autoplay = true
                            video.loop = true;
                            video.src = url;
                            video.playsInline = true;
                            video.style.objectFit = 'cover'; // 元素尺寸大于视频实际尺寸时放大
                            this.resources[index] = video;

                            // 视频需要添加到dom树才能获取宽高
                            video.width = 0
                            video.height = 0
                            document.body.appendChild(video)
                            await new Promise(resolve => {
                                const onMetaLoad = () => {
                                    resolve(true)
                                    video.removeEventListener('loadedmetadata', onMetaLoad)
                                }
                                video.addEventListener('loadedmetadata', onMetaLoad)
                            })
                        } else {
                            const img = document.createElement('img')
                            img.src = i.src
                            await new Promise(resolve => img.onload = resolve)
                            this.resources[index] = img
                        }
                    }))
                }))
            } catch (e) {
                debug.error('load animated banner images error', e)
                return
            }
            let container = <HTMLDivElement>document.querySelector("#banner_link");
            if (!container) {
                container = <HTMLDivElement>document.querySelector(".h-center");
                if (!container) return this.resources.forEach(d => d.remove());
                (<any>container.parentElement).removeAttribute("style");
                container.style.width = "100%";
                container.style.top = "-42px";
                container.style.marginBottom = "-42px";
                container.innerHTML = "";
                document.querySelector(".b-header-mask-wrp")?.remove();
            };
            container.classList.add("animated-banner");
            let containerHeight = container.clientHeight;
            let containerWidth = container.clientWidth;
            let containerScale = 180 / 155;

            // 初始化资源尺寸
            this.layerConfig.layers.forEach(v => {
                v._initState = {
                    scale: 1,
                    rotate: v.rotate?.initial || 0,
                    translate: v.translate?.initial || [0, 0],
                    blur: v.blur?.initial || 0,
                    opacity: v.opacity?.initial === undefined ? 1 : v.opacity.initial,
                }
                v.resources.forEach((i, index) => {
                    const el = this.resources[index]
                    if (el.tagName === 'VIDEO') {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el)
                        }
                        (<HTMLVideoElement>el).dataset.height = <any>(<HTMLVideoElement>el).videoHeight;
                        (<HTMLVideoElement>el).dataset.width = <any>(<HTMLVideoElement>el).videoWidth;
                    } else {
                        el.dataset.height = <any>(<HTMLImageElement>el).naturalHeight;
                        el.dataset.width = <any>(<HTMLImageElement>el).naturalWidth;
                    }
                    const initial = v.scale?.initial === undefined ? 1 : v.scale?.initial
                    el.height = (<any>el.dataset.height) * containerScale * initial
                    el.width = (<any>el.dataset.width) * containerScale * initial
                })
            })

            // 初始化图层
            const layers = this.layerConfig.layers.map(v => {
                const layer = document.createElement('div');
                layer.classList.add('layer');
                container.appendChild(layer);
                return layer;
            })

            let displace = 0;
            let enterX = 0;
            let raf = 0;

            const curveParameterToFunc = (param: [number, number, number, number]) => {
                const o = bezier(...param);
                return (v: any) => v > 0 ? o(v) : -o(-v);
            }
            let lastDisplace = NaN;

            // 根据鼠标位置改变状态
            const af = (t: any) => {
                try {
                    if (lastDisplace === displace) {
                        return
                    }
                    lastDisplace = displace;
                    layers.map((layer, i) => {
                        const v = this.layerConfig.layers[i];
                        const a = layer.firstChild;
                        if (!a) {
                            return
                        }

                        const transform = {
                            scale: v._initState.scale,
                            rotate: v._initState.rotate,
                            translate: v._initState.translate,
                        }
                        if (v.scale) {
                            const x = v.scale.offset || 0;
                            const itp = v.scale.offsetCurve ? curveParameterToFunc(v.scale.offsetCurve) : ((x: any) => x);
                            const offset = x * itp(displace);
                            transform.scale = v._initState.scale + offset;
                        }
                        if (v.rotate) {
                            const x = v.rotate.offset || 0;
                            const itp = v.rotate.offsetCurve ? curveParameterToFunc(v.rotate.offsetCurve) : ((x: any) => x);
                            const offset = x * itp(displace);
                            transform.rotate = v._initState.rotate + offset;
                        }
                        if (v.translate) {
                            const x = v.translate.offset || [0, 0];
                            const itp = v.translate.offsetCurve ? curveParameterToFunc(v.translate.offsetCurve) : ((x: any) => x);
                            const offset = x.map(v => itp(displace) * v);
                            const translate = v._initState.translate.map((x: any, i: any) => (x + offset[i]) * containerScale * (v.scale?.initial || 1));
                            transform.translate = translate;
                        }
                        (<HTMLElement>a).style.transform = `scale(${transform.scale})` +
                            `translate(${transform.translate[0]}px, ${transform.translate[1]}px)` +
                            `rotate(${transform.rotate}deg)`
                        if (v.blur) {
                            const x = v.blur.offset || 0;
                            const itp = v.blur.offsetCurve ? curveParameterToFunc(v.blur.offsetCurve) : ((x: any) => x);
                            const blurOffset = x * itp(displace);

                            let res = 0;
                            if (!v.blur.wrap || v.blur.wrap === 'clamp') {
                                res = Math.max(0, v._initState.blur + blurOffset)
                            } else if (v.blur.wrap === 'alternate') {
                                res = Math.abs(v._initState.blur + blurOffset)
                            }
                            (<HTMLElement>a).style.filter = res < 1e-4 ? '' : `blur(${res}px)`;
                        }

                        if (v.opacity) {
                            const x = v.opacity.offset || 0;
                            const itp = v.opacity.offsetCurve ? curveParameterToFunc(v.opacity.offsetCurve) : ((x: any) => x);
                            const opacityOffset = x * itp(displace);

                            const initial = v._initState.opacity;
                            if (!v.opacity.wrap || v.opacity.wrap === 'clamp') {
                                (<HTMLElement>a).style.opacity = <any>Math.max(0, Math.min(1, initial + opacityOffset))
                            } else if (v.opacity.wrap === 'alternate') {
                                const x = initial + opacityOffset;
                                let y = Math.abs(x % 1);
                                if (Math.abs(x % 2) >= 1) {
                                    y = 1 - y
                                }
                                (<HTMLElement>a).style.opacity = <any>y;
                            }
                        }
                    })
                } catch (e) {
                    debug.error(e)
                }
            }

            // 初始化图层内图片和帧动画
            this.layerConfig.layers.map((v, i) => {
                const a = this.resources[i];
                layers[i].appendChild(a);
                if (a.tagName === 'VIDEO') {
                    (<HTMLVideoElement>a).play();
                }
                requestAnimationFrame(af);
            })

            const handleLeave = () => {
                const now = performance.now();
                const timeout = 200;
                const tempDisplace = displace;
                cancelAnimationFrame(raf);
                const leaveAF = (t: number) => {
                    if (t - now < timeout) {
                        displace = tempDisplace * (1 - (t - now) / 200);
                        af(t);
                        requestAnimationFrame(leaveAF);
                    } else {
                        displace = 0;
                        af(t);
                    }
                }
                raf = requestAnimationFrame(leaveAF);
            }

            this.handleMouseLeave = e => {
                this.entered = false;
                handleLeave();
            }
            this.handleMouseMove = e => {
                const offsetY = document.documentElement.scrollTop + e.clientY;
                if (offsetY < containerHeight) {
                    if (!this.entered) {
                        this.entered = true;
                        enterX = e.clientX;
                    }
                    displace = (e.clientX - enterX) / containerWidth;
                    cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(af)
                } else {
                    if (this.entered) {
                        this.entered = false;
                        handleLeave();
                    }
                }

                this.extensions.map(v => v.handleMouseMove?.({ e, displace }))
            }
            this.handleResize = e => {
                containerHeight = container.clientHeight;
                containerWidth = container.clientWidth;
                containerScale = 180 / 155;
                this.layerConfig.layers.forEach(lc => {
                    lc.resources.forEach((d, i) => {
                        const el: any = this.resources[i];
                        el.height = el.dataset.height * containerScale * (lc.scale?.initial || 1);
                        el.width = el.dataset.width * containerScale * (lc.scale?.initial || 1);
                    })
                })
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(t => {
                    af(t)
                })
                this.extensions.map(v => v.handleResize?.(e));
            }
            document.addEventListener('mouseleave', this.handleMouseLeave);
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('resize', this.handleResize);
        }
    }
    // hook顶栏图片请求
    jsonphookasync("api.bilibili.com/x/web-show/res/loc", undefined, async url => {
        const obj = new URL(url);
        obj.searchParams.delete("callback");
        let loc = Animate.record[url];
        let header = Animate.record[Animate.rid];
        let rqs: any;
        if (!loc || !header) {
            rqs = await Promise.all([
                fetch(obj.toJSON()).then(d => d.json()),
                fetch(`https://api.bilibili.com/x/web-show/page/header?resource_id=${Animate.rid}`).then(d => d.json())
            ]);
            loc = Animate.record[url] = rqs[0];
            header = Animate.record[Animate.rid] = rqs[1];
        }
        loc.data && Animate.locs.forEach(d => {
            loc.data[d] && (loc.data[d][0].pic = (header && header.data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png",
                loc.data[d][0].litpic = (header && header.data.litpic),
                loc.data[d][0].url = (header && header.data.url) || "",
                loc.data[d][0].title = (header && header.data.name) || "");
            if (url.includes("loc?") && obj.searchParams.get("id") == String(d)) {
                loc.data[0].pic = (header && header.data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png";
                loc.data[0].litpic = (header && header.data.litpic) || "";
                loc.data[0].url = (header && header.data.url) || "";
                loc.data[0].title = (header && header.data.name) || "";
            }
        });
        setting.animatedBanner && !Animate.once && (Animate.once = true, setTimeout(() => new Animate(header.data)));
        return loc;
    }, false);
}