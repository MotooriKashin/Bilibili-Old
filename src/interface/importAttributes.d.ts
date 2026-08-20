// CSS Modules
// declare module '*.css' with { type: 'css' } {
declare module '*.css' {
    const stylesheet: CSSStyleSheet;
    export default stylesheet;
}

// JSON imports
// declare module '*.json' with { type: 'json' } {
declare module '*.json' {
    const data: any;
    export default data;
}

// WebAssembly modules
// declare module '*.wasm' with { type: 'module' } {
declare module '*.wasm' {
    const module: WebAssembly.Module;
    export default module;
}

// Text imports
// declare module '*.html' with { type: 'text' } {
declare module '*.html' {
    const module: string;
    export default module;
}

declare module '*.xml' {
    const module: string;
    export default module;
}