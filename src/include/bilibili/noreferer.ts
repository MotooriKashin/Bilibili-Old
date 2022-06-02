namespace API {
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    /** 禁用referer 访问非网页端url时必须 */
    export function noreferer() {
        document.head.contains(meta) || document.head.appendChild(meta);
    }
    /** 启用referer 解除noreferer */
    export function enreferer() {
        document.head.contains(meta) && meta.remove()
    }
}