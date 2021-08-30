declare namespace API {
    /**
     * 安装本地模块文件，包括js、css和json
     * @param files input.files
     */
    function localModule(files: FileList): Promise<void>;
    /**
     * 以存文本形式读取本地文件
     * @param file input.files的元素
     */
    function readFile(file: File): Promise<string>;
}
