// proposal-relative-indexing-method
if (typeof Array.prototype.at === 'undefined') {
    function at<T extends Array<any>>(this: T, n: number) {
        // ToInteger() abstract op
        n = Math.trunc(n) || 0;
        // Allow negative indexing from the end
        if (n < 0) n += this.length;
        // OOB access is guaranteed to return undefined
        if (n < 0 || n >= this.length) return undefined;
        // Otherwise, this is just normal property access
        return this[n];
    }
    const TypedArray = Reflect.getPrototypeOf(Int8Array);
    for (const C of [Array, String, TypedArray]) {
        Reflect.defineProperty((<typeof Array>C).prototype, 'at',
            {
                value: at,
                writable: true,
                enumerable: false,
                configurable: true
            });
    }
}