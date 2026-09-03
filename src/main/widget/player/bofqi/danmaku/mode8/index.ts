import type { DanmakuElem } from "..";
import { log } from "../../../../../../utils/debug";
import { htmlUnescape } from "../../../../../../utils/url";
import { generate } from "./generate";
import { tokenize } from "./lexer";
import { parser } from "./parser";
import { Sandbox } from "./sandbox";
import { ScriptPlayer } from "./ScriptPlayer";
import { delay as timer, interval, clone, foreach } from "./ScriptUtils";
import * as Utils from './ScriptUtils';
import * as Global from './GlobalVariables';
import * as ScriptManager from './ScriptManager';
import * as TweenEasing from './flash/BetweenAS3TweenEasing';
import * as Tween from './flash/BetweenAS3';
import { ScriptDisplay } from "./ScriptDisplay";
import { ScriptBitmap } from "./ScriptBitmap";
import { Stage } from "./flash/display/Stage";

export class Mode8 {
    /** 动画实例缓存 */
    static animation = new Set<Animation>();
    constructor(
        parent: ParentNode,
        dm: IMode8,
        delay = 0,
        danmaku: HTMLElement,
        video: HTMLVideoElement,
    ) {

        if (dm.content) {
            if (!dm.mode8) {
                // 将弹幕脚本转译为js脚本
                // 其实原代码基本等于 es5 的子集，不转译也可以，不过：
                //  1. 弹幕语言有自定义关键字及语法，虽然官方教程未曾提及，也没见过有人使用。
                //  2. 弹幕作者存在手滑等导致的语法错误，此转译器尝试修复了一些。
                dm.mode8 = generate(parser(tokenize(htmlUnescape(dm.content))));
            }

            if (dm.mode8) {
                const stage = new Stage(danmaku, parent);
                const Display = new ScriptDisplay(stage, delay);
                const Bitmap = new ScriptBitmap(stage, delay);
                // TODO：自制的简陋沙箱实在称不上安全，好在代码弹幕已死，不会出现新的具备安全风险的弹幕
                // 考虑后续换为[ShadowRealm](https://github.com/tc39/proposal-shadowrealm)
                new Sandbox({
                    trace: (...rest: any[]) => { log('mode8', ...rest) },
                    clear: () => { console.clear() },
                    getTimer: () => { return performance.now(); },
                    interval,
                    timer,
                    clone,
                    foreach,
                    Utils,
                    Player: new ScriptPlayer(video),
                    Display,
                    $: Display,
                    Global,
                    $G: Global,
                    ScriptManager,
                    Tween,
                    TweenEasing,
                    Bitmap,
                    load: (lib: string, callback: () => void) => { log('importExtendLibrary : ', lib); setTimeout(callback); },
                    $nextFrame: () => new Promise(resolve => requestAnimationFrame(resolve)),
                }, ['clearTimeout', 'parseInt', 'parseFloat', 'Math', 'String']
                ).execute(dm.mode8);
            }
        }
    }
}

interface IMode8 extends DanmakuElem {
    mode8?: string;
}