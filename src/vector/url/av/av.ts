interface modules {
    /** av */
    readonly "av.js": string;
    readonly "av.html": string;
    readonly "av-script.html": string;
    readonly "menuConfig.txt": string;
}
namespace API {
    if (rebuildType != "重定向") windowClear();
    loadVideoScript();

    // 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
    // 暴露UI组件
    // .onCoinSuccess(n)   页面变为已投币n枚的状态
    // .onFollow()         变为已关注状态
    // .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
    webpackhook(717, 274, (code: string) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;").replace("this.getAdData()", "this.getAdData"));
    // 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
    /* 报错原因示意：
        jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
            let codeA = resultA[0].code; // Cannot read property 'code' of undefined
            let codeA = resultA.code;    // 本应该写成这样
        })
    */
    webpackhook(717, 251, (code: string) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
    // 修复：视频标签链接
    // tag -> topic
    webpackhook(717, 660, code => code.replace('tag/"+t.info.tag_id+"/?pagetype=videopage', 'topic/"+t.info.tag_id+"/?pagetype=videopage'));
    // 修复：视频分区
    webpackhook(717, 100, code => code.replace(/MenuConfig[\S\s]+?LiveMenuConfig/, `MenuConfig=${API.getModule("menuConfig.txt")},e.LiveMenuConfig`));
    // 修复：移除上古顶栏
    webpackhook(717, 609, () => `()=>{}`);
    // 修复：BV/cv -> 超链接
    webpackhook(717, 2, code => code.replace("av$1</a>')", `av$1</a>').replace(/(?!<a[^>]*>)cv([0-9]+)(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/read/cv$1/" target="_blank" data-view="$1">cv$1</a>').replace(/(?!<a[^>]*>)(bv1)(\\w{9})(?![^<]*<\\/a>)/ig, '<a href="//www.bilibili.com/video/bv1$2/" target="_blank">$1$2</a>')`));
    // 添加：播放器启动代码
    // 无`__INITIAL_STATE__`启动
    webpackhook(717, 286, code => code.replace('e("setVideoData",t)', `e("setVideoData",t);$("#bofqi").attr("id","__bofqi").html('<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>');new Function(t.embedPlayer)();`));

    if (rebuildType == "重定向") {
        document.documentElement.replaceChildren(createElements(htmlVnode(getModule("av.html"))));
        appendScripts(getModule("av-script.html")).then(() => loadendEvent());
    } else {
        documentWrite(getModule("av.html")
            .replace('<!-- <!DOCTYPE html> -->', '<!DOCTYPE html>')
            .replace('<!-- <html lang="zh-CN"> -->', '<html lang="zh-CN">')
            .replace('<!-- </html> -->', '</html>')
            .replace("</body>", `${getModule("av-script.html")}</body>`));
    }
    title && (document.title = title);
    config.enlike && new enLike(); // 点赞功能
    importModule("avLostCheck.js"); // av页深度审查
    importModule("primaryMenu.js"); // 顶栏分区修正
    importModule("banner.js"); // 顶栏banner修复
    importModule("loadByDmId.js"); // 弹幕ID跳转

    // 跳过充电鸣谢
    config.automate.electric && jsonphookasync("api.bilibili.com/x/web-interface/elec/show", undefined, async () => { return { code: -404 } }, false);
}