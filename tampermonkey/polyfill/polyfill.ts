// Element.prototype.replaceChildren
if (typeof Element.prototype.replaceChildren === 'undefined') {
    Reflect.defineProperty(Element.prototype, 'replaceChildren', {
        configurable: true,
        enumerable: false,
        value: function (this: Element) {
            while (this.lastChild) this.removeChild(this.lastChild);
            this.append.call(this, ...arguments);
        }
    });
}