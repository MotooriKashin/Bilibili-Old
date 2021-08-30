/**
 * 本模块负责模块的维护工作
 */
(function () {
    async function localModule(files: FileList) {
        if (files.length === 0) return;
        const data: { txt: File[], json: File[] } = { txt: [], json: [] };
        Array.from(files).forEach(d => {
            /\.json$/.test(d.name) ? data.json.push(d) : data.txt.push(d);
        });
        (await Promise.all(data.json.reduce((s: Promise<string | ArrayBuffer>[], d) => {
            s.push(readFile(d))
            return s;
        }, []))).forEach((d, i) => {
            try {
                GM.setValue(data.json[i].name.replace(".json", ""), JSON.parse(<string>d));
                toast.success(`成功本地安装模块 ${data.json[i]}`);
            } catch (e) { API.trace(e, "localModule") }
        });
        const module = GM.getValue("module", {});
        (await Promise.all(data.txt.reduce((s: Promise<string | ArrayBuffer>[], d) => {
            s.push(readFile(d))
            return s;
        }, []))).forEach((d, i) => {
            try {
                Reflect.set(module, data.json[i].name, d);
                toast.success(`成功本地安装模块 ${data.json[i]}`);
            } catch (e) { API.trace(e, "localModule") }
        });
        GM.setValue("module", module);
    }
    function readFile(file: File) {
        return new Promise((resolve: (value: string) => void, reject) => {
            if (!file) reject(toast.error('无效文件路径！'));
            const reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = () => {
                resolve(<string>reader.result);
            }
            reader.onerror = () => {
                reject(toast.error('读取文件出错，请重试！'));
            }
        })
    }
    API.localModule = (files: FileList) => localModule(files);
    API.readFile = (file: File) => readFile(file);
})();
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