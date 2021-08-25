/**
 * 本模块负责实现原生脚本拦截模块  
 * 这里指的原生脚本是那些非直接写入原生HTML，而是后续由JavaScript添加进DOM的脚本  
 * 本模块导入优先级极高
 */
(function () {
    class NodeHook {
        static appendChild = Node.prototype.appendChild;
        static insertBefore = Node.prototype.insertBefore;
        static rules: [string[], string | undefined][] = [];
        constructor() {
            this.appendChild();
            this.insertBefore();
        }
        intercept(rule: string[], moduleName?: string) {
            NodeHook.rules.push([rule, moduleName]);
        }
        appendChild() {
            Node.prototype.appendChild = function <T extends Node>(newChild: T): T {
                newChild.nodeName == 'SCRIPT' && (<any>newChild).src && NodeHook.rules.forEach(d => {
                    d[0].every(d => (<any>newChild).src.includes(d)) && (
                        (d[1] && (newChild.textContent = GM.getResourceText(d[1])) && setTimeout(() => (<any>newChild).onload(), 500)),
                        (<any>newChild).removeAttribute("src")
                    );
                })
                return <T>NodeHook.appendChild.call(this, newChild);
            };
        }
        insertBefore() {
            Node.prototype.insertBefore = function <T extends Node>(newChild: T, refChild: Node | null): T {
                newChild.nodeName == 'SCRIPT' && (<any>newChild).src && NodeHook.rules.forEach(d => {
                    d[0].every(d => (<any>newChild).src.includes(d)) && (
                        (d[1] && (newChild.textContent = GM.getResourceText(d[1])) && setTimeout(() => (<any>newChild).onload(), 500)),
                        (<any>newChild).removeAttribute("src")
                    );
                })
                return <T>NodeHook.insertBefore.call(this, newChild, refChild);
            }
        }
    }
    const nodeHook = new NodeHook();
    API.scriptIntercept = (rule: string[], moduleName?: string) => nodeHook.intercept(rule, moduleName);
})();
declare namespace API {
    /**
     * 替换插入页面的外部脚本文件  
     * 注意本工具只能替换非直接写入HTML源文件的脚本
     * @param rule 外部脚本链接关键词组，必须全部满足
     * @param moduleName 替换用的模块文件名，未提供则只拦截原脚本不导入模块
     */
    function scriptIntercept(rule: string[], moduleName?: string): void;
}