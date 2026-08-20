declare module 'fs/promises' {
    // 复制选项
    interface RmOptions {
        /** 忽略异常 */
        force?: boolean;
        /** 如果为true，则执行递归删除。在递归模式下，操作失败时会重试。默认值： false。 */
        recursive?: boolean;
        /** 如果遇到EBUSY、EMFILE、ENFILE、ENOTEMPTY或 错误，Node.js 将重试该操作，每次尝试的线性退避等待时间将增加 1 毫秒。此选项表示重试次数。如果 选项不是 ，则会忽略此选项。默认值：0。 */
        maxRetries?: number;
        /** 两次重试之间等待的时间（以毫秒为单位）。如果recursive选项不是 ，则忽略此选项true。 默认值： 100。 */
        retryDelay?: number;
    }

    /** 复制选项 */
    interface CpOptions {
        /** 覆盖现有文件或目录。如果将此值设置为 false 且目标文件存在，则复制操作将忽略错误。使用该errorOnExist选项可更改此行为。 默认值： true。 */
        force?: boolean;
        /** 递归复制目录默认值： false */
        recursive?: boolean;
        /** 取消引用符号链接。默认值： false。 */
        dereference?: boolean;
        /** 用于过滤已复制文件/目录的函数。返回 表示 true复制该项目，false返回 表示忽略该项目。忽略某个目录时，其所有内容也将被跳过。也可以返回Promise 解析为true或 的false 默认值： undefined。 */
        filter?: (src: string, dest: string) => boolean | Promise<boolean>;
    }

    /**
     * 删除文件或目录
     * 
     * @param path 要删除的路径
     * @param options 删除选项
     */
    export function rm(path: string, options?: RmOptions): Promise<void>;

    /**
     * 复制源文件或目录
     * 
     * @param source 要复制的源路径。
     * @param destination 要复制到的目标路径。
     * @param options 复制选项
     */
    export function cp(source: string, destination: string, options?: CpOptions): Promise<void>;

    /**
     * 写入文件内容
     * 
     * @param file 文件路径
     * @param data 要写入的数据
     * @param encoding 编码格式
     */
    export function writeFile(file: string | URL, data: string | BlobPart | ReadableStream<Uint8Array<ArrayBuffer>>, encoding?: string): Promise<void>;

    /**
     * 读取文件内容
     * 
     * @param path 文件路径
     * @param encoding 编码格式
     */
    export function readFile(path: string | URL, encoding: 'utf8'): Promise<string>;

    /**
     * 读取路径文件名
     * @param path 文件路径
     * @returns 文件序列
     */
    export function readdir(path: string | URL): Promise<string[]>;

    /**
     * 创建文件夹
     * 
     * @param path 文件路径
     * @param options 参数配置
     */
    export function mkdir(path: string | URL, options?: { recursive: boolean }): Promise<void>;
}
