/**
 * 本模块负责向用户发布脚本的公告
 */
(async function () {
    const content = {
        /**
         * 公告内容
         */
        text: '<a href="https://www.jsdelivr.com">jsdelivr</a> CDN官方已于下午17：20分左右将国内节点由网宿切换到Fastly，经测试已能正常访问，先前关闭了“托管原生脚本”的可以重新启用了。不了解发生了什么的请忽视本消息即可。',
        /**
         * 公共编号，原则上每次修改公告后+1即可  
         * 用于唯一标记该公告，以免重复弹窗
         */
        num: 2
    };
    const virsion = GM.getValue<number>("notice");
    if (virsion == content.num) return;

    const box = API.element.popupbox({ maxWidth: "360px" }, true);
    API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, box, `<span>${API.Name}<span>`);
    API.addElement("div", { style: 'margin-bottom: 10px;line-height: 20px;' }, box, `<div>${content.text}</div>`);
    GM.setValue("notice", content.num);

})();