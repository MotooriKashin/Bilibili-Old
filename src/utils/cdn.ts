export class Cdn {
    /**
     * 
     * @param host CDN名
     * @param hash 默认文件版本哈希值
     * @param protocol url协议
     */
    constructor(private host = "Github", private hash?: string, private protocol = "https") { }
    /**
     * 获取cdn链接
     * @param path 文件相对路径
     * @param hash 文件版本哈希值
     */
    encode(path: string, hash = this.hash) {
        switch (this.host) {
            case 'jsdelivr':
                return `${this.protocol}://fastly.jsdelivr.net/gh/MotooriKashin/Bilibili-Old${hash ? `@${hash}` : ''}${path}`;
            default:
                return `${this.protocol}://github.com/MotooriKashin/Bilibili-Old/raw/${hash || 'master'}${path}`;
        }
    }
    /** 更新默认值 */
    update(host: string, hash?: string, protocol?: string) {
        this.host = host;
        hash && (this.hash = hash);
        protocol && (this.protocol = protocol);
    }
}