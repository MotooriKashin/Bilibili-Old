import { generate } from "./generate";
import { tokenize } from "./lexer";
import { parser } from "./parser";
// import { writeFile } from 'fs/promises'

const example = `// 定义一个模板 c
def text c(textColor = 0xff0000, alpha = 1) {
    content = "bilibili"
    fontSize = 10%
    x = 0
    y = 10%
    color = textColor
    alpha = alpha
}

// 生成实例
let d = c (
    0xffffff, 0.5
)

let d1 = c (
    textColor = 0xff0000,
    alpha = 0.5
)

let d2 = c (
    textColor = 0xff0000, 0.5
)

let d3 = c (
    0xff0000, alpha = 0.5
)

let d4 = c (
    alpha =1,
    textColor = 0xff0000
)`;

const tokens = tokenize(example);
// console.log(tokens);
const ast = parser(tokens);
// console.dir(ast, { depth: null, colors: true });
const mode9 = generate(ast);
console.dir(mode9, { depth: null, colors: true });
