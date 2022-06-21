/** 404 怪异模式处理 */
export function backCompat() {
    if (document.compatMode === "BackCompat") {
        sessionStorage.setItem("404", location.href);
        sessionStorage.setItem("404t", document.title);
        location.replace(`${location.origin}/favicon.ico`);
    }
    const title = sessionStorage.getItem("404t");
    if (title) {
        sessionStorage.removeItem("404t");
        !title.includes("出错") && (document.title = title);
    }
}