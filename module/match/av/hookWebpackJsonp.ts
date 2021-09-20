/**
 * 本模块负责修复av页原生脚本中的错误代码
 */
(function () {
    try {
        let webpackJsonpFunction: any;
        Object.defineProperty(window, "webpackJsonp", {
            get() {
                if (webpackJsonpFunction) {
                    return (chunkIds: any, moreModules: any, executeModules: any) => {
                        function inject(index: any, replaceFn: any) {
                            let code = moreModules[index].toString();
                            moreModules[index] = new Function("t", "e", "i", "(" + replaceFn(code) + ")(t,e,i)");
                        }
                        // length == 716 -> vendor.js
                        //        == 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
                        if (moreModules.length == 717) {
                            // 暴露UI组件
                            // .onCoinSuccess(n)   页面变为已投币n枚的状态
                            // .onFollow()         变为已关注状态
                            // .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
                            inject(274, (code: string) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;"));
                            // 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
                            /* 报错原因示意：
                                jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
                                    let codeA = resultA[0].code; // Cannot read property 'code' of undefined
                                    let codeA = resultA.code;    // 本应该写成这样
                                })
                            */
                            inject(251, (code: string) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
                        }
                        return webpackJsonpFunction(chunkIds, moreModules, executeModules);
                    }
                }
            },
            set(func) {
                webpackJsonpFunction = func;
            }
        });
    } catch (e) { API.trace(e, "webpackJsonpFunction.js", true) }
})();