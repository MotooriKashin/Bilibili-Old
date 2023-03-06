// Element.prototype.replaceChildren
if (typeof Element.prototype.replaceChildren === 'undefined') {
    Reflect.defineProperty(Element.prototype, 'replaceChildren', {
        value: function (this: Element) {
            while (this.lastChild) this.removeChild(this.lastChild);
            this.append.call(this, ...arguments);
        },
        writable: true,
        enumerable: false,
        configurable: true
    });
}