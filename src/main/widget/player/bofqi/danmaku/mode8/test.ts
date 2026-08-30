import { tokenize } from "./lexer";
import { parser } from "./parser";

const example = `
// 基于 Parser.ts 规则解析的真实代码弹幕
coroutine animateDanmaku(element) {
    var count = 0;
    loop {
        element.x += 5;
        count++;

        if (count >= 60) {
            break;
        }

        suspend; // 挂起当前协程，交出控制权给下一帧
    }
}
`

const tokens = tokenize(example);
const ast = parser(tokens);

console.dir(ast, { depth: null })