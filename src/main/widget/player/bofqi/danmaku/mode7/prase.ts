import type { DanmakuElem } from "..";
import { error } from "../../../../../../utils/debug";

/** 解码高级弹幕（mode7） */
export function prase(dm: DanmakuElem) {
    try {
        if (dm.content) {
            // ["146","8","0-1","3","你所跑过的短暂的季节(Saison)","0","0","146","8","500","0","true","黑体","0"]
            const [
                startX = 0,
                startY = 0,
                opacity = [1, 1],
                duration = 4.5,
                text,
                zRotate = 0,
                yRotate = 0,
                endX = startX,
                endY = startY,
                aTime = 500,
                aDelay = 0,
                stroked = false,
                family,
                linearSpeedUp = false,
                path
            ] = <[number, number, [number, number], number, string, number, number, number, number, number, number, boolean, string?, boolean?, string?]>(<any[]>JSON.parse(dm.content, (key, value) => {
                switch (key) {
                    case '0':
                    case '1':
                    case '3':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '4': {
                        return typeof value === 'string' ? value.replace(/(?:\/n|\\n|\n|\r\n)/g, '\n') : value;
                    }
                    case '10': {
                        return Number(value) || 0;
                    }
                    case '2': {
                        return (<string>value).split('-').map((d: string) => Number(d));
                    }
                    case '11': {
                        return value === 'false' ? false : true;
                    }
                    case '13': {
                        return value === '0' ? false : true;
                    }
                    default: {
                        return value;
                    }
                }
            }));
            Reflect.set(dm, 'mode7', { startX, startY, opacity, duration, text, zRotate, yRotate, endX, endY, aTime, aDelay, stroked, family, linearSpeedUp, path });
        }
    } catch (e) { error('mode7', dm) }
}