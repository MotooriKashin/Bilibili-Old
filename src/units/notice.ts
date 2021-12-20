/**
 * 本模块负责向用户发布脚本的公告
 */
(async function () {
    const content = {
        /**
         * 公告内容
         */
        text: "由于今天(2021/12/20)日，jsdelivr CDN国内节点崩溃，导致本脚本部分功能不可用。脚本已在添加在设置->通用中添加了一个选项“托管原生脚本”用于临时禁用这部分功能，等待CDN恢复时<strong>莫忘记</strong>打开以便正常使用这部分功能。给您带来的不便，敬请见谅！",
        /**
         * 公共编号，原则上每次修改公告后+1即可  
         * 用于唯一标记该公告，以免重复弹窗
         */
        num: 1
    };
    const virsion = GM.getValue<number>("notice");
    if (virsion == content.num) return;

    const box = API.element.popupbox({ maxWidth: "360px" }, true);
    API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, box, `<span>${API.Name}<span>`);
    API.addElement("div", { style: 'margin-bottom: 10px;line-height: 20px;' }, box, `<div>${content.text}</div>`);
    GM.setValue("notice", content.num);

})();