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
/**
 * 弹出文件读取窗口
 * @param accept 文件类型：MMIE/拓展名，以逗号分隔
 * @link https://github.com/GoogleChromeLabs/browser-fs-access/blob/c4ce7f0313f9dde923a2220c798e4d5365cdcf32/src/legacy/file-open.mjs#L34-L50
 */
export function fileRead(accept?: string): Promise<File>;
/**
 * 弹出文件读取窗口
 * @param accept 文件类型：MMIE/拓展名，以逗号分隔
 * @param multiple 单选 
 * @link https://github.com/GoogleChromeLabs/browser-fs-access/blob/c4ce7f0313f9dde923a2220c798e4d5365cdcf32/src/legacy/file-open.mjs#L34-L50
 */
export function fileRead(accept: string | undefined, multiple: false): Promise<File>;
/**
 * 弹出文件读取窗口
 * @param accept 文件类型：MMIE/拓展名，以逗号分隔
 * @param multiple 多选
 * @link https://github.com/GoogleChromeLabs/browser-fs-access/blob/c4ce7f0313f9dde923a2220c798e4d5365cdcf32/src/legacy/file-open.mjs#L34-L50
 */
export function fileRead(accept: string | undefined, multiple: true): Promise<FileList>;
export function fileRead(accept?: string, multiple?: boolean) {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        accept && (input.accept = accept);
        multiple && (input.multiple = multiple);
        input.style.opacity = "0";

        // ToDo: Remove this workaround once
        // https://github.com/whatwg/html/issues/6376 is specified and supported.
        // > 2023-02-25 chromium Implement cancel event on <input type=file>
        // > https://bugs.chromium.org/p/chromium/issues/detail?id=1227424
        const rejectOnPageInteraction = () => {
            window.removeEventListener('pointermove', rejectOnPageInteraction);
            window.removeEventListener('pointerdown', rejectOnPageInteraction);
            window.removeEventListener('keydown', rejectOnPageInteraction);
            reject(new DOMException('The user aborted a request.', 'AbortError'));
        };

        window.addEventListener('pointermove', rejectOnPageInteraction);
        window.addEventListener('pointerdown', rejectOnPageInteraction);
        window.addEventListener('keydown', rejectOnPageInteraction);

        input.addEventListener('change', () => {
            window.removeEventListener('pointermove', rejectOnPageInteraction);
            window.removeEventListener('pointerdown', rejectOnPageInteraction);
            window.removeEventListener('keydown', rejectOnPageInteraction);
            resolve(input.multiple ? input.files : input.files![0]);
        });

        input.click();
    });
}