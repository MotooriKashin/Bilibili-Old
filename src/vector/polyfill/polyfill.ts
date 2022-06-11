interface modules {
    /** 
     * polyfill引导  
     * 尽管原则上不推荐使用polyfill，但……真香！
     */
    readonly "polyfill.js": string;
}
namespace API {
    importModule("replaceChildren.js"); //  Element.prototype.replaceChildren
}