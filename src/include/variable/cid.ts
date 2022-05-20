namespace API {
    /** cid */
    export let cid: number = <any>undefined;
    Object.defineProperty(API, "cid", {
        get: () => Reflect.get(window, "cid"),
        set: v => Reflect.set(window, "cid", v)
    })
}