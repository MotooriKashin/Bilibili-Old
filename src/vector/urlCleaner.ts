interface modules {
    /** URL清理 */
    readonly "urlCleaner.js": string;
}
namespace API {
    /** 垃圾参数 */
    const paramsSet = new Set([
        'spm_id_from',
        'from_source',
        'msource',
        'bsource',
        'seid',
        'source',
        'session_id',
        'visit_id',
        'sourceFrom',
        'from_spmid',
        'share_source',
        'share_medium',
        'share_plat',
        'share_session_id',
        'share_tag',
        'unique_k'
    ]);
    /** url处理栈 */
    const hookStack: [string[], (url: UrlFormat) => void][] = [];
    /** 垃圾参数操作 */
    export const urlCleaner = {
        /**
         * 添加垃圾参数
         * @param key 参数名
         */
        addParam: (key: string) => paramsSet.add(key),
        /**
         * 移除垃圾参数
         * @param key 参数名
         */
        removeParam: (key: string) => paramsSet.delete(key),
        /**
         * 添加url处理
         * @param param url匹配关键词，必须全部匹配
         * @param callback 处理匹配url的回调函数，参数为url格式化后的对象
         */
        hook: (param: string | string[], callback: (url: UrlFormat) => void) => {
            isString(param) ? hookStack.push([[param], callback]) : hookStack.push([param, callback]);
        }
    }
    /**
     * 清理url
     * @param str 原url
     * @returns 新url
     */
    function clean(str: string) {
        const url = new UrlFormat(str);
        hookStack.forEach(d => {
            d[0].every(d => str.includes(d)) && d[1](url);
        });
        const params = url.params();
        params.bvid && (params.aid = <string>abv(params.bvid), delete params.bvid); // 旧版页面一般不支持bvid，转化为aid
        params.aid && (!Number(params.aid)) && (params.aid = <string>abv(params.aid)); // 部分写作aid读作bvid也得转化
        paramsSet.forEach(d => {
            Reflect.deleteProperty(params, d);
        });
        // 非参数型bv号转化为av号;
        return url.toJSON().replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + abv(s));
    }
    /** 地址备份 */
    let locationBackup: string;
    /** 处理地址栏 */
    function cleanLocation() {
        const { href } = location;
        if (href === locationBackup) return;
        replaceUrl(locationBackup = clean(href));
    }
    /** 处理href属性 */
    function anchor(list: NodeListOf<HTMLAnchorElement>) {
        list.forEach(d => {
            if (!d.href) return;
            d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com")); // tv域名失效
            d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => loginExit()); // 修复退出页面
            d.href = clean(d.href);
        });
    }
    /** 检查a标签 */
    function click(e: MouseEvent) { // 代码copy自B站spm.js
        var f = <HTMLAnchorElement>e.target;
        for (; f && "A" !== f.tagName;) {
            f = <HTMLAnchorElement>f.parentNode
        }
        if ("A" !== (null == f ? void 0 : f.tagName)) {
            return
        }
        anchor(<any>[f]);
    }
    cleanLocation(); // 及时处理地址栏
    // 处理注入的节点
    let timer: number;
    observerAddedNodes((node) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            cleanLocation();
            node.querySelectorAll && anchor(node.querySelectorAll("a"));
            node.tagName == "A" && anchor(<any>[node]);
        }, 250);
    });
    loadAfterClear(() => {
        // 处理点击事件
        window.addEventListener("click", click, !1);
        // 处理右键菜单
        window.addEventListener("contextmenu", click, !1);
    });
}