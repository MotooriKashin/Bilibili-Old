interface modules {
    /**
     * 插入脚本拦截工具  
     * jsonp的实现基础就是插入脚本，所以jsonphook工具也在这里实现。
     */
    readonly "Node.js": string;
}
{
    class NodeHook {
        static appendChild = Node.prototype.appendChild;
        static insertBefore = Node.prototype.insertBefore;
        static jsonp: [string[], Function][] = [];
        constructor() {
            this.appendChild();
            this.insertBefore();
        }
        jsonphook(url: string | string[], redirect?: (url: string) => string, modifyResponse?: (response: any) => any, once = true) {
            let id: number;
            const one = Array.isArray(url) ? url : [url];
            const two = function (this: HTMLScriptElement) {
                once && id && delete NodeHook.jsonp[id - 1];
                if (redirect) try { this.src = redirect(this.src) || this.src } catch (e) { debug.error("redirect of jsonphook", one, e) }
                if (modifyResponse) {
                    const obj = Format.urlObj(this.src);
                    const callback = obj.callback;
                    const call = window[callback];
                    if (call) {
                        window[callback] = function (v: any) {
                            try { v = modifyResponse(v) || v } catch (e) { debug.error("modifyResponse of jsonphook", one, e) }
                            return call(v);
                        }
                    }
                }
            }
            return id = NodeHook.jsonp.push([one, two]);
        }
        jsonphookasync(url: string | string[], condition?: (url: string) => boolean, modifyResponse?: (url: string) => Promise<any>, once = true) {
            let id: number;
            const one = Array.isArray(url) ? url : [url];
            const two = function (this: HTMLScriptElement) {
                try {
                    once && id && delete NodeHook.jsonp[id - 1];
                    if (!condition || condition(this.src)) {
                        const obj = Format.urlObj(this.src);
                        const callback = obj.callback;
                        const call = window[callback];
                        if (call) {
                            modifyResponse && modifyResponse(this.src).then(d => {
                                window[callback](d);
                                this.dispatchEvent(new ProgressEvent("load"));
                            }).catch(e => {
                                this.dispatchEvent(new ProgressEvent("error"));
                                debug.error("modifyResponse of xhrhookasync", one, e);
                            })
                        }
                        this.removeAttribute("src");
                    }
                } catch (e) { debug.error("jsonphook", one, e) }
            }
            return id = NodeHook.jsonp.push([one, two]);
        }
        scriptBlock(url: string | string[]) {
            const one = Array.isArray(url) ? url : [url];
            const two = function (this: HTMLScriptElement) {
                try {
                    this.removeAttribute("src");
                    setTimeout(() => this.dispatchEvent(new ProgressEvent("load")), 100);
                } catch (e) { debug.error("脚本拦截失败！", one, e) }
            }
            NodeHook.jsonp.push([one, two]);
        }
        scriptIntercept(url: string | string[], redirect?: (url: string) => string, text?: (url: string) => string) {
            const one = Array.isArray(url) ? url : [url];
            const two = function (this: HTMLScriptElement) {
                try {
                    if (text) {
                        this.text = text(this.src);
                        this.removeAttribute("src");
                        setTimeout(() => {
                            this.dispatchEvent(new ProgressEvent("load"));
                            this?.remove();
                        }, 100);
                    } else if (redirect) {
                        this.src = redirect(this.src);
                    }
                } catch (e) { debug.error("scriptIntercept", one, e) }
            }
            return NodeHook.jsonp.push([one, two]);
        }
        removeJsonphook(id: number) {
            id >= 0 && delete NodeHook.jsonp[id - 1];
        }
        appendChild() {
            Node.prototype.appendChild = function <T extends Node>(newChild: T): T {
                newChild.nodeName == 'SCRIPT' && (<any>newChild).src && (NodeHook.jsonp.forEach(d => {
                    d[0].every(d => (<any>newChild).src.includes(d)) && d[1].call(newChild);
                }));
                return <T>NodeHook.appendChild.call(this, newChild);
            };
        }
        insertBefore() {
            Node.prototype.insertBefore = function <T extends Node>(newChild: T, refChild: Node | null): T {
                newChild.nodeName == 'SCRIPT' && (<any>newChild).src && (NodeHook.jsonp.forEach(d => {
                    d[0].every(d => (<any>newChild).src.includes(d)) && d[1].call(newChild);
                }));
                return <T>NodeHook.insertBefore.call(this, newChild, refChild);
            }
        }
    }
    const nodehook = new NodeHook();
    API.jsonphook = (url: string | string[], redirect?: (url: string) => string, modifyResponse?: (response: any) => any, once?: boolean) => nodehook.jsonphook(url, redirect, modifyResponse, once);
    API.jsonphookasync = (url: string | string[], condition?: (url: string) => boolean, modifyResponse?: (url: string) => Promise<any>, once?: boolean) => nodehook.jsonphookasync(url, condition, modifyResponse, once);
    API.scriptBlock = (url: string | string[]) => nodehook.scriptBlock(url);
    API.scriptIntercept = (url: string | string[], redirect?: (url: string) => string, text?: (url: string) => string) => nodehook.scriptIntercept(url, redirect, text);
    API.removeJsonphook = (id: number) => nodehook.removeJsonphook(id);
}
declare namespace API {
    /**
     * 注册拦截修改jsonp请求，本方法必须传入同步返回的回调函数，要使用异步回调请考虑左转`jsonphookasync`。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param redirect 重定向url的回调函数，将原url作为第一个参数传递，必须同步返回重定向后的url。
     * @param modifyResponse 修改jsonp返回值的回调函数，将原返回值(一般为json格式)作为第一个参数传递，必须同步返回修改后的返回值。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递`false`，然后自行在不再需要拦截后使用`removeJsonphook`注销。
     */
    export function jsonphook(url: string | string[], redirect?: (url: string) => string, modifyResponse?: (response: any) => any, once?: boolean): number;
    /**
     * `jsonphook`的异步版本，可以用异步方法获取到的返回值替换jsonp请求的返回值。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
     * @param modifyResponse 修改jsonp返回值的回调函数，将原url作为第一个参数传递，请将要设定的jsonp返回值返回，格式一般都是json。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递`false`，然后自行在不再需要拦截后使用`removeJsonphook`注销。
     */
    export function jsonphookasync(url: string | string[], condition?: (url: string) => boolean, modifyResponse?: (url: string) => Promise<any>, once?: boolean): number;
    /**
     * 禁止脚本注入运行。
     * @param url 要禁止运行的脚本src匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     */
    export function scriptBlock(url: string | string[]): void;
    /**
     * 注册拦截脚本注入，本方法只能拦截通过`appendChild`等方法传入页面的脚本。  
     * 若要接触拦截，可通过`removeJsonphook`取消拦截，参数为本方法返回的id。
     * @param url 需要拦截的脚本的src匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param redirect 替换src的回调函数，将原src作为第一个参数，必须同步返回重定向的src。
     * @param text 要以内联脚本形式替换的回调函数，将原src作为第一个参数，必须同步返回替换的代码文本。本参数的存在将导致`redirect`被忽略。
     */
    export function scriptIntercept(url: string | string[], redirect?: (url: string) => string, text?: (url: string) => string): number;
    /**
     * 取消jsonphook或脚本拦截，只在注册时设置了`once=false`时才需要使用本方法！
     * @param id 要取消注册的id，该值为注册时返回值，一个id只允许使用一次！
     */
    export function removeJsonphook(id: number): void;
}