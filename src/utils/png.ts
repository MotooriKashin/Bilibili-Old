import { UPNG } from "@jsc/upng";
import { fileRead } from "./file";
import { sizeFormat } from "./format/size";
import { Toast, toast } from "../core/toast";
import { debug } from "./debug";
import { timeFormat } from "./format/time";
import { saveAs } from "./file";

export class PNG {
    /** 文件名 */
    private name?: string;
    /** 文件大小 */
    private size?: number;
    /** 文件类型 */
    private type?: string;
    /**
     * 任意文件 => PNG图片
     * @param file 文件数据
     * @param msg 通知组件
     * @returns PNG图片
     */
    encode(file: ArrayBufferLike, msg?: Toast) {
        msg?.push('> 预处理：');
        /** 计时起点 */
        const start = new Date().getTime();
        const buffer = new Uint8Array(file);
        /** 长宽 */
        const px = Math.ceil(Math.sqrt(buffer.length) / 2);
        /** 数据大小 */
        const total = px * px * 4;
        msg?.push(`> 宽高：${px}像素`, `> 缓冲：${total}`);
        /** 缓冲区对齐 */
        const res = new ArrayBuffer(total + (4 - total % 4) + 4);
        /** 缓冲区8位视图 */
        const u8f = new Uint8Array(res);
        new Uint32Array(res)[0] = buffer.length; // 写入原始文件大小（int）
        u8f.set(buffer, 4); // 写入原始数据
        const result = UPNG.encode([u8f.buffer], px, px, 0) // 编码为png文件
        msg?.push(`> 编码用时：${timeFormat(new Date().getTime() - start)}`, `> 编码成功！`, 'fin <<<');
        msg && (msg.type = 'success');
        return result;
    }
    /**
     * png file encoder
     * @param callback 处理回调
     */
    encodeFile(callback?: (png: IPNG) => void) {
        const msg = toast.list('任意文件 => png >>>')
        fileRead()
            .then(d => {
                if (d && d[0]) {
                    this.name = d[0].name;
                    this.size = d[0].size;
                    this.type = d[0].type;
                    msg.push(`> 读取文件：${this.name}`, `> 类型：${this.type}`, `> 大小：${sizeFormat(this.size)}`);
                    return d[0].arrayBuffer();
                } else {
                    msg.push('> Warning：未识别到任何文件~');
                    msg.type = 'warning';
                    throw new Error(`读取文件出错~`);
                }
            })
            .then(d => {
                debug(d);
                const file = this.encode(d, msg);
                callback
                    ? callback({ file, name: this.name!, size: this.size!, type: this.type! })
                    : saveAs(file, this.name!.split('.')[0] + '.png');
            })
            .catch(e => {
                msg.push(`> Error：`, e, 'fin <<<');
                msg.type = 'error';
                debug.error('PNG.encode', e);
            })
            .finally(() => {
                msg.delay = 4;
                this.destory();
            });
    }
    /**
     * png 还原
     * @param file png文件数据
     * @param msg 通知组件
     * @returns 原始文件数据
     */
    decode(file: ArrayBufferLike, msg?: Toast) {
        msg?.push('> 解码中：');
        /** 计时起点 */
        const start = new Date().getTime();
        const png = UPNG.decode(file);
        const buff = new ArrayBuffer(png.data.length);
        const u8f = new Uint8Array(buff);
        msg?.push(`> 解码用时：${timeFormat(new Date().getTime() - start)}`, `> 编码成功！`, 'fin <<<');
        u8f.set(png.data);
        const length = new Uint32Array(buff.slice(0, 4))[0];
        msg && (msg.type = 'success');
        return buff.slice(4, length + 4);
    }
    /**
     * png file decoder
     * @param file png 文件数据
     * @returns 原始文件数据
     */
    decodeFile(callback?: (png: IPNG) => void) {
        const msg = toast.list('解码 png >>>')
        fileRead('.png')
            .then(d => {
                if (d && d[0]) {
                    this.name = d[0].name;
                    this.size = d[0].size;
                    this.type = d[0].type;
                    msg.push(`> 读取文件：${this.name}`, `> 类型：${this.type}`, `> 大小：${sizeFormat(this.size)}`);
                    return d[0].arrayBuffer();
                } else {
                    msg.push('> Warning：未识别到任何文件~');
                    msg.type = 'warning';
                    throw new Error(`读取文件出错~`);
                }
            })
            .then(d => {
                debug(d);
                const file = this.decode(d, msg);
                callback ?
                    callback({ file, name: this.name!, size: this.size!, type: this.type! })
                    : saveAs(file, this.name!.split('.')[0] + '.txt');
            })
            .catch(e => {
                msg.push(`> Error：`, e, 'fin <<<');
                msg.type = 'error';
                debug.error('PNG.decode', e);
            })
            .finally(() => {
                msg.delay = 4;
                this.destory();
            });
    }
    private destory() {
        delete this.name;
        delete this.size;
        delete this.type;
    }
}
interface IPNG {
    /** png文件数据 */
    file: ArrayBufferLike;
    /** 原始文件名 */
    name: string;
    /** 原始文件大小 */
    size: number;
    /** 原始文件类型 */
    type: string;
}