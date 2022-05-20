namespace API {
    /** aid */
    export let aid: number = <any>undefined;
    Object.defineProperty(API, "aid", {
        get: () => Reflect.get(window, "aid"),
        set: v => Reflect.set(window, "aid", v)
    })
}