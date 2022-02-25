interface modules {
    /** 文件处理 */
    readonly "file.js": string;
}
namespace API {
    /**
     * 读取本地文件（utf-8字符串）
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @returns Promise托管的文件内容字符串
     */
    export function readAs(file: File): Promise<string>;
    /**
     * 读取本地文件（字符串）
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @param type 以字符串格式读取
     * @param encoding 文本格式，默认为utf-8
     * @returns Promise托管的文件内容字符串
     */
    export function readAs(file: File, type: "string", encoding?: string): Promise<string>;
    /**
     * 读取本地文件（DataURL）
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @param type 以DataURL格式读取
     * @returns Promise托管的文件内容DataURL
     */
    export function readAs(file: File, type: "DataURL"): Promise<string>;
    /**
     * 读取本地文件（ArrayBuffer）
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @param type 以ArrayBuffer格式读取
     */
    export function readAs(file: File, type: "ArrayBuffer"): Promise<ArrayBuffer>;
    export function readAs(file: File, type: "string" | "DataURL" | "ArrayBuffer" = "string", encoding: string = 'utf-8') {
        return new Promise((resolve: (value: ArrayBuffer | string) => void, reject) => {
            const reader = new FileReader();
            switch (type) {
                case "ArrayBuffer": reader.readAsArrayBuffer(file);
                    break;
                case "DataURL": reader.readAsDataURL(file);
                    break;
                case "string": reader.readAsText(file, encoding);
                    break;
            }
            reader.onload = () => resolve(<ArrayBuffer | string>reader.result);
            reader.onerror = e => reject(e);
        })
    }
    /**
     * 保存到文件
     * @param content 要保存的对象
     * @param fileName 文件名（含拓展名）
     * @param contentType 编码类型
     */
    export async function saveAs(content: BufferSource | Blob | string, fileName: string, contentType: string = "text/plain") {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.addEventListener("load", () => URL.revokeObjectURL(a.href));
        // document.body.appendChild(a);
        a.click();
    }
}