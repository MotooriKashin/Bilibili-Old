/** 从url中获取dash sidx */
export class Sidx {
    /** range索引结束点 */
    protected end = 5999;
    /** range索引开始点 */
    protected start = 0;
    /** 结果hex字符串 */
    protected hex_data = '';
    /**
     * @param url 目标url
     * @param size 最大索引范围（不宜过大），默认6万字节
     */
    constructor(protected url: string, protected size: number = 6e4) { }
    getData() {
        return new Promise((resolve: (value: [string, string]) => void, reject) => {
            this.fetch(resolve, reject);
        });
    }
    /** 请求片段 */
    protected fetch(resolve: (value: [string, string]) => void, reject: (reason?: any) => void) {
        fetch(this.url.replace("http:", "https:"), {
            headers: {
                range: `bytes=${this.start}-${this.end}`
            }
        })
            .then(d => {
                if ((d.status >= 300 || d.status < 200) && d.status !== 304) throw new Error(`${d.status} ${d.statusText}`, { cause: d.status });
                return d.arrayBuffer()
            })
            .then(d => {
                const data = new Uint8Array(d);
                this.hex_data += Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                if (this.hex_data.indexOf('73696478') > -1 && this.hex_data.indexOf('6d6f6f66') > -1) {
                    // 首个“sidx”出现4字节之前的部分为索引起始点
                    const indexRangeStart = this.hex_data.indexOf('73696478') / 2 - 4;
                    // 首个“mooc”出现前5字节结束索引
                    const indexRagneEnd = this.hex_data.indexOf('6d6f6f66') / 2 - 5;
                    resolve(['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)]);
                } else {
                    // 当前片段没有sidx，请求下一个片段
                    this.start = this.end + 1;
                    if (this.size && this.start > this.size) {
                        reject('未能获取到sidx');
                    } else {
                        this.end += 6000;
                        this.size && (this.end = Math.min(this.end, this.size));
                        this.fetch(resolve, reject);
                    }
                }
            })
            .catch(e => reject(e));
    }
}