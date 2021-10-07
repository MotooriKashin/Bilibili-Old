/**
 * 本模块负责实现原生脚本拦截模块  
 * 这里指的原生脚本是那些非直接写入原生HTML，而是后续由JavaScript添加进DOM的脚本  
 * 本模块导入优先级极高
 */
(function () {
    try {
        class NodeHook {
            static appendChild = Node.prototype.appendChild;
            static insertBefore = Node.prototype.insertBefore;
            static rules: [string[], string | undefined][] = [];
            static jsonp: [string[], Function][] = [];
            jsonphook = (url: string[], callback: (this: any, xhr: any) => void) => NodeHook.jsonp.push([url, callback]);
            removeJsonphook = (id: number) => NodeHook.jsonp.splice(id - 1, 1);
            constructor() {
                this.appendChild();
                this.insertBefore();
            }
            intercept(rule: string[], replaceURL?: string) {
                NodeHook.rules.push([rule, replaceURL]);
            }
            appendChild() {
                Node.prototype.appendChild = function <T extends Node>(newChild: T): T {
                    newChild.nodeName == 'SCRIPT' && (<any>newChild).src && (NodeHook.rules.forEach(d => {
                        d[0].every(d => (<any>newChild).src.includes(d)) && (d[1] ?
                            ((<any>newChild).src = d[1]) :
                            (<any>newChild).removeAttribute("src")
                        );
                    }), NodeHook.jsonp.forEach(d => {
                        d[0].every(d => (<any>newChild).src.includes(d)) && d[1](new Proxy(new Object(), {
                            set: (t, p, v) => {
                                p == "url" && ((<any>newChild).src = v);
                                return true;
                            },
                            get: (t, p) => {
                                return p == "url" ? (<any>newChild).src : undefined;
                            }
                        }));
                    }))
                    return <T>NodeHook.appendChild.call(this, newChild);
                };
            }
            insertBefore() {
                Node.prototype.insertBefore = function <T extends Node>(newChild: T, refChild: Node | null): T {
                    newChild.nodeName == 'SCRIPT' && (<any>newChild).src && (NodeHook.rules.forEach(d => {
                        d[0].every(d => (<any>newChild).src.includes(d)) && (d[1] ?
                            ((<any>newChild).src = d[1]) :
                            (<any>newChild).removeAttribute("src")
                        );
                    }), NodeHook.jsonp.forEach(d => {
                        d[0].every(d => (<any>newChild).src.includes(d)) && d[1](new Proxy(new Object(), {
                            set: (t, p, v) => {
                                p == "url" && ((<any>newChild).src = v);
                                return true;
                            },
                            get: (t, p) => {
                                return p == "url" ? (<any>newChild).src : undefined;
                            }
                        }));
                    }))
                    return <T>NodeHook.insertBefore.call(this, newChild, refChild);
                }
            }
        }
        const nodeHook = new NodeHook();
        API.scriptIntercept = (rule: string[], replaceURL?: string) => nodeHook.intercept(rule, replaceURL);
        API.jsonphook = (url: string[], callback: (xhr: { url: string }) => void) => nodeHook.jsonphook(url, callback);
        API.removeJsonphook = (id: number) => nodeHook.removeJsonphook(id);
    } catch (e) { toast.error("Node.js", e) }
})();
declare namespace API {
    /**
     * 替换插入页面的外部脚本文件  
     * 注意本工具只能替换非直接写入HTML源文件的脚本
     * @param rule 外部脚本链接关键词组，必须全部满足
     * @param replaceURL 替换用的脚本URL，未提供则只进行**拦截**
     */
    function scriptIntercept(rule: string[], replaceURL?: string): void;
    /**
     * 注册jsonphook  
     * @param url 需要hook的URL符合的条件，URL包含的字符串构成的数组，必须都满足才会回调
     * @param callback hook到指定URL后执行的回调函数，url信息为参数属性
     * @returns 注册编号，用于使用`removeJsonphook`方法注销当前hook
     */
    function jsonphook(url: string[], callback: (xhr: { url: string }) => void): number;
    /**
     * 注销jsonphook
     * @param id 注册`jsonphook`时的返回值
     */
    function removeJsonphook(id: number): [string[], Function][];
}