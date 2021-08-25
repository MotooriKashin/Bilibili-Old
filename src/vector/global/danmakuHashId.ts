/**
 * 本模块负责实现反查弹幕发送者功能
 */
(function () {
    API.importModule("crc32.js"); // 启动引擎
    API.addCss(GM.getResourceText("danmakuHashId.css"));
    class DanmakuHashId {
        static count: number = 0; // 正在查询弹幕数
        static catch: { [name: string]: any } = {}; // 已查询弹幕缓存
        count: number = 0; // 当前查询弹幕序号
        hash: string; // 当前弹幕哈希值
        mid: number; // 当前弹幕mid
        node: any;
        dm: any;
        constructor(crc: string) {
            // 设置正在查询的弹幕数量
            DanmakuHashId.count = DanmakuHashId.count ? DanmakuHashId.count + 1 : 1;
            // 当前查询弹幕排序
            this.count = DanmakuHashId.count;
            // 临时缓存已查询的 mid
            DanmakuHashId.catch = DanmakuHashId.catch || {};
            this.hash = crc;
            this.mid = API.midcrc(this.hash);
            this.getInfo();
        }
        async getInfo() {
            try {
                this.node = document.querySelector(".bilibili-player-context-menu-container.active");
                if (!this.node) return setTimeout(() => { this.getInfo() }, 100);
                this.node = this.node.children[0];
                let j = 0; // 找到的节点序号
                for (let i = this.node.children.length - 1; i >= 0; i--) {
                    if (this.node.children[i].textContent.includes("mid")) {
                        this.dm = this.node.children[i];
                        j++;
                        if (this.count === j) break;
                    }
                }
                if (!this.dm) return setTimeout(() => { this.getInfo() }, 100);
                if (this.dm.tagName != "LI") return;
                DanmakuHashId.catch[this.mid] = DanmakuHashId.catch[this.mid] || API.jsonCheck(await API.xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/card", { mid: <any>this.mid }) }));
                this.dm.innerHTML = '<div style="min-height:0px;z-index:-5;background-color: unset;" class="bb-comment"><div style="padding-top: 0;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;vertical-align: middle;" data-usercard-mid="' +
                    this.mid + '" class="reply-face"><img src="' +
                    DanmakuHashId.catch[this.mid].data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user" style="padding-bottom: 0;top: 3px;"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                    this.mid + '" href="//space.bilibili.com/' +
                    this.mid + '" target="_blank" class="' +
                    (DanmakuHashId.catch[this.mid].data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + DanmakuHashId.catch[this.mid].data.card.name + '</a> ' +
                    DanmakuHashId.catch[this.mid].data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                    DanmakuHashId.catch[this.mid].data.card.level_info.current_level + '"></i></a></div></div></div></div></div></div></div>';
                DanmakuHashId.count--;
            } catch (e) { DanmakuHashId.count--; API.debug.trace(e, "danmakuHashId.js") }
        }
    }
    window.danmakuHashId = (crc: string) => {
        const check = new DanmakuHashId(crc);
        return `hash: ${check.hash} mid: ${check.mid}`
    }
})();
interface Window {
    /**
     * 反查弹幕发送者  
     * 请求依赖xhr，查询成功将自动修改占位消息
     * @param crc 弹幕CRC32哈希值
     * @returns 节点占位消息
     */
    danmakuHashId: (crc: string) => string;
}