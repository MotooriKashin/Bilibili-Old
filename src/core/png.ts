import { apiArticleUpcover } from "../io/api-article-upcover";
import { getCookies } from "../utils/cookie";
import { debug } from "../utils/debug";
import { fileRead } from "../utils/file";
import { sizeFormat } from "../utils/format/size";
import { toast } from "./toast";

export function uploadImg() {
    let name: string, size: number, type: string
    const msg = toast.list('上传图片 >>>');
    const bili_jct = getCookies().bili_jct;
    if (!bili_jct) {
        msg.push('> Error：请先登录！');
        msg.type = 'warning';
        msg.delay = 4;
        return;
    }
    msg.push('> 请选择图片文件');
    fileRead('.png')
        .then(d => {
            name = d.name;
            size = d.size;
            type = d.type;
            msg.push(`> 读取文件：${name}`, `> 类型：${type}`, `> 大小：${sizeFormat(size)}`, '> 正在上传~');
            return apiArticleUpcover(d, bili_jct);
        })
        .then(d => {
            msg.push('> 上传成功，请牢记图片地址！', d.url);
            msg.type = 'success';
            Object.assign(d, { name, type, size });
            return navigator.clipboard.writeText(d.url)
        })
        .then(() => {
            msg.push('> 已复制到剪切板！', 'fin <<<');
        })
        .catch(e => {
            msg.push(`> Error：上传失败！`, e, 'fin <<<');
            msg.type = 'error';
            debug.error('uploadImg', e);
        })
        .finally(() => {
            msg.delay = 4;
        });
}