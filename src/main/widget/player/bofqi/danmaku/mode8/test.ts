import { tokenize } from "./lexer";

const example = `var a = ||||=`;

const tokens = tokenize(example);

console.dir(tokens, { depth: null })