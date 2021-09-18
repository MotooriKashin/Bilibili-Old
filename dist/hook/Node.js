/**
 * 本模块负责实现原生脚本拦截模块
 * 这里指的原生脚本是那些非直接写入原生HTML，而是后续由JavaScript添加进DOM的脚本
 * 本模块导入优先级极高
 */
try {
    class NodeHook {
        constructor() {
            this.jsonphook = (url, callback) => NodeHook.jsonp.push([url, callback]);
            this.removeJsonphook = (id) => NodeHook.jsonp.splice(id - 1, 1);
            this.appendChild();
            this.insertBefore();
        }
        intercept(rule, moduleName) {
            NodeHook.rules.push([rule, moduleName]);
        }
        appendChild() {
            Node.prototype.appendChild = function (newChild) {
                newChild.nodeName == 'SCRIPT' && newChild.src && (NodeHook.rules.forEach(d => {
                    d[0].every(d => newChild.src.includes(d)) && ((d[1] && (newChild.textContent = API.getModule(d[1])) && setTimeout(() => newChild.onload(), 500)),
                        newChild.removeAttribute("src"));
                }), NodeHook.jsonp.forEach(d => {
                    d[0].every(d => newChild.src.includes(d)) && d[1](new Proxy(new Object(), {
                        set: (t, p, v) => {
                            p == "url" && (newChild.src = v);
                            return true;
                        },
                        get: (t, p) => {
                            return p == "url" ? newChild.src : undefined;
                        }
                    }));
                }));
                return NodeHook.appendChild.call(this, newChild);
            };
        }
        insertBefore() {
            Node.prototype.insertBefore = function (newChild, refChild) {
                newChild.nodeName == 'SCRIPT' && newChild.src && (NodeHook.rules.forEach(d => {
                    d[0].every(d => newChild.src.includes(d)) && ((d[1] && (newChild.textContent = API.getModule(d[1])) && setTimeout(() => newChild.onload(), 500)),
                        newChild.removeAttribute("src"));
                }), NodeHook.jsonp.forEach(d => {
                    d[0].every(d => newChild.src.includes(d)) && d[1](new Proxy(new Object(), {
                        set: (t, p, v) => {
                            p == "url" && (newChild.src = v);
                            return true;
                        },
                        get: (t, p) => {
                            return p == "url" ? newChild.src : undefined;
                        }
                    }));
                }));
                return NodeHook.insertBefore.call(this, newChild, refChild);
            };
        }
    }
    NodeHook.appendChild = Node.prototype.appendChild;
    NodeHook.insertBefore = Node.prototype.insertBefore;
    NodeHook.rules = [];
    NodeHook.jsonp = [];
    const nodeHook = new NodeHook();
    API.scriptIntercept = (rule, moduleName) => nodeHook.intercept(rule, moduleName);
    API.jsonphook = (url, callback) => nodeHook.jsonphook(url, callback);
    API.removeJsonphook = (id) => nodeHook.removeJsonphook(id);
}
catch (e) {
    API.trace(e, "Node.js", true);
}
