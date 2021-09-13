/**
 * 本模块负责实现原生脚本拦截模块
 * 这里指的原生脚本是那些非直接写入原生HTML，而是后续由JavaScript添加进DOM的脚本
 * 本模块导入优先级极高
 */
(function () {
    class NodeHook {
        constructor() {
            this.appendChild();
            this.insertBefore();
        }
        intercept(rule, moduleName) {
            NodeHook.rules.push([rule, moduleName]);
        }
        appendChild() {
            Node.prototype.appendChild = function (newChild) {
                newChild.nodeName == 'SCRIPT' && newChild.src && NodeHook.rules.forEach(d => {
                    d[0].every(d => newChild.src.includes(d)) && ((d[1] && (newChild.textContent = API.getModule(d[1])) && setTimeout(() => newChild.onload(), 500)),
                        newChild.removeAttribute("src"));
                });
                return NodeHook.appendChild.call(this, newChild);
            };
        }
        insertBefore() {
            Node.prototype.insertBefore = function (newChild, refChild) {
                newChild.nodeName == 'SCRIPT' && newChild.src && NodeHook.rules.forEach(d => {
                    d[0].every(d => newChild.src.includes(d)) && ((d[1] && (newChild.textContent = API.getModule(d[1])) && setTimeout(() => newChild.onload(), 500)),
                        newChild.removeAttribute("src"));
                });
                return NodeHook.insertBefore.call(this, newChild, refChild);
            };
        }
    }
    NodeHook.appendChild = Node.prototype.appendChild;
    NodeHook.insertBefore = Node.prototype.insertBefore;
    NodeHook.rules = [];
    const nodeHook = new NodeHook();
    API.scriptIntercept = (rule, moduleName) => nodeHook.intercept(rule, moduleName);
})();
