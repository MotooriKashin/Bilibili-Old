namespace API {
    /** upos服务器 */
    const UPOS = {
        "ks3（金山）": "upos-sz-mirrorks3.bilivideo.com",
        "ks3b（金山）": "upos-sz-mirrorks3b.bilivideo.com",
        "ks3c（金山）": "upos-sz-mirrorks3c.bilivideo.com",
        "ks32（金山）": "upos-sz-mirrorks32.bilivideo.com",
        "kodo（七牛）": "upos-sz-mirrorkodo.bilivideo.com",
        "kodob（七牛）": "upos-sz-mirrorkodob.bilivideo.com",
        "cos（腾讯）": "upos-sz-mirrorcos.bilivideo.com",
        "cosb（腾讯）": "upos-sz-mirrorcosb.bilivideo.com",
        "coso1（腾讯）": "upos-sz-mirrorcoso1.bilivideo.com",
        "coso2（腾讯）": "upos-sz-mirrorcoso2.bilivideo.com",
        "bos（腾讯）": "upos-sz-mirrorbos.bilivideo.com",
        "hw（华为）": "upos-sz-mirrorhw.bilivideo.com",
        "hwb（华为）": "upos-sz-mirrorhwb.bilivideo.com",
        "uphw（华为）": "upos-sz-upcdnhw.bilivideo.com",
        "js（华为）": "upos-tf-all-js.bilivideo.com",
        "hk（香港）": "cn-hk-eq-bcache-01.bilivideo.com",
        "akamai（海外）": "upos-hz-mirrorakam.akamaized.net",
    }
    /** 过滤短时间重复通知 */
    let dis = false, timer = 0;
    /**
     * 替换UPOS服务器
     * @param str playurl或包含视频URL的字符串
     * @param uposName 替换的代理服务器名 `∈ keyof typeof UPOS`
     */
    export function uposReplace(str: string, uposName: keyof typeof UPOS | "不替换") {
        if (uposName === "不替换") return str;
        !dis && toast.custom(10, "warning", "已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${uposName}`, `UPOS：${UPOS[uposName]}`);
        dis = true;
        clearTimeout(timer);
        timer = setTimeout(() => dis = false, 1e3);
        return str.replace(/:\\?\/\\?\/[^\/]+\\?\//g, () => `://${UPOS[uposName]}/`);
    }
}