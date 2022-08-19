import DEFALUTE_SETTIING from "./setting.json"; // 设置项默认值
import { ContentScriptFilter, registerContentScripts, RegisteredContentScript } from "./register_content_scripts";

/** 互斥标记，同一时间只运行一个实例 */
let changing = false;
/** 【后台脚本】初始化储存数据 */
export function initSetting() {
    chrome.storage.local.get({ setting: DEFALUTE_SETTIING }).then(d => {
        // 保存设置
        chrome.storage.local.set(d);
        chrome.storage.session.set({ ts: new Date().getTime() });
    });
}
/** 【后台脚本】设置变动，更新主脚本及网络规则集注册 */
export function changeSetting() {
    if (changing) return;
    changing = true;
    (<Promise<Record<"setting", typeof DEFALUTE_SETTIING>>>chrome.storage.local.get()).then(({ setting }) => {
        (<any>chrome).scripting.getRegisteredContentScripts(async (scripts: ReturnType<typeof registerContentScripts>[]) => {
            /** 已注册的主脚本id */
            const isRegisters = scripts.map((script) => script.id);
            /** 注册主脚本组 */
            const registers: RegisteredContentScript[] = [];
            /** 注销主脚本组（全部） */
            const unregisters: Required<ContentScriptFilter> = { ids: [] };
            /** 网络规则集 */
            const updateRulesetOptions: chrome.declarativeNetRequest.UpdateRulesetOptions = {};
            /** 全局不匹配网址 */
            let excludeMatches: string[] | undefined = undefined;
            // 取消所有已注册主脚本（后面重新注册）
            unregisters.ids.push(...isRegisters);
            // 更新网络规则集序列
            if (setting.logReport) {
                updateRulesetOptions.enableRulesetIds || (updateRulesetOptions.enableRulesetIds = []);
                updateRulesetOptions.enableRulesetIds.push("report");
            } else {
                updateRulesetOptions.disableRulesetIds || (updateRulesetOptions.disableRulesetIds = []);
                updateRulesetOptions.disableRulesetIds.push("report");
            }
            // 更新主脚本序列
            // 各主脚本中重复代码可能冲突，所以同一标签页原则上只能运行一个主脚本，所以务必保证匹配模式不重合！
            if (setting.index) { // 主页
                const matches = [
                    // 坑：末尾的斜杠不能少
                    "*://www.bilibili.com/",
                    "*://www.bilibili.com/?*",
                    "*://www.bilibili.com/index.*"
                ];
                registers.push(registerContentScripts("content/index/index.js", matches, "index"));
                // 专属主脚本不再启用全局，下同
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.av) { // av
                const matches = [
                    "*://www.bilibili.com/video/av*",
                    "*://www.bilibili.com/video/AV*",
                    "*://www.bilibili.com/video/bv*",
                    "*://www.bilibili.com/video/BV*",
                    "*://www.bilibili.com/s/video/av*",
                    "*://www.bilibili.com/s/video/AV*",
                    "*://www.bilibili.com/s/video/bv*",
                    "*://www.bilibili.com/s/video/BV*",
                ];
                registers.push(registerContentScripts("content/av/av.js", matches, "av"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.bangumi) { // bangumi
                const matches = [
                    "*://www.bilibili.com/bangumi/play/ss*",
                    "*://www.bilibili.com/bangumi/play/ep*"
                ];
                registers.push(registerContentScripts("content/bangumi/bangumi.js", matches, "bangumi"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.watchlater) { // 稍后再看
                const matches = [
                    "*://www.bilibili.com/*watchlater/*"
                ];
                registers.push(registerContentScripts("content/watchlater/watchlater.js", matches, "watchlater"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.player) { // player
                const matches = [
                    "*://www.bilibili.com/*player.*"
                ];
                registers.push(registerContentScripts("content/player/player.js", matches, "player", "*://www.bilibili.com/*ancient*"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.playlist) { // playlist
                const matches = [
                    "*://www.bilibili.com/medialist/play/*",
                    "*://www.bilibili.com/playlist/video/pl*"
                ];
                registers.push(registerContentScripts("content/playlist/playlist.js", matches, "playlist"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.ranking) { // 全站排行榜
                const matches = [
                    "*://www.bilibili.com/v/popular/*"
                ];
                registers.push(registerContentScripts("content/ranking/ranking.js", matches, "ranking"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.read) { // 专栏
                const matches = [
                    "*://www.bilibili.com/read/cv*"
                ];
                registers.push(registerContentScripts("content/read/read.js", matches, "read"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            if (setting.search) { // 搜索
                const matches = [
                    "*://search.bilibili.com/*"
                ];
                registers.push(registerContentScripts("content/search/search.js", matches, "search"));
                excludeMatches || (excludeMatches = []);
                excludeMatches.push(...matches);
            }
            // 全局
            registers.push(registerContentScripts("content/vector.js", [
                "*://*.bilibili.com/*"
            ], "vector", excludeMatches));
            // 更新网络规则集
            (updateRulesetOptions.enableRulesetIds || updateRulesetOptions.disableRulesetIds) && chrome.declarativeNetRequest.updateEnabledRulesets(updateRulesetOptions);
            // 坑：启动无痕模式窗口经常出现已注册的主脚本并不运行的情况必须先注销后重新注册🤣
            unregisters.ids.length && await (<any>chrome).scripting.unregisterContentScripts(unregisters);
            registers.length && await (<any>chrome).scripting.registerContentScripts(registers);
            changing = false;
        })
    })
}