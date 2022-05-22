interface modules {
    readonly "message.js": string;
    readonly "message.css": string;
}
namespace API {
    addCss(getModule("message.css"));
}