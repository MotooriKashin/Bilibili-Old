import { BLOD } from "../core/bilibili-old";
import { toast } from "../core/toast";
import { urlCleaner } from "../core/url";
import { cdn } from "../utils/cdn";
import { debug } from "../utils/debug";
import { https } from "../utils/format/http";
import { Page } from "./page";

export class PageWild extends Page {
    private toast = toast.list();
    /**
     * 使用远程网页框架重写页面
     * @param path 框架文件相对根目录路径（以`/`开头）
     * @param url 修改地址栏
     * @param comment 是否替换评论区
     */
    constructor(private path: string, private url?: string, comment = true) {
        super('');
        comment && new Comment();
        typeof this.path === 'string' && this.init();
    }
    private init() {
        this.toast.push(this.url, '已失效~', '请求远程备份>>>');
        GM.fetch(cdn.encode(this.path))
            .then(d => d.text())
            .then(d => {
                this.toast.push('成功获取网页框架，刷新页面~');
                this.url && urlCleaner.updateLocation(this.url);
                this.updateHtml(d);
                this.updateDom();
                BLOD.flushToast();
                this.toast.type = 'success';
            })
            .catch(e => {
                this.toast.push('重构页面错误', e);
                debug.error('重构页面错误', e);
                this.toast.type = 'error';
            })
            .finally(() => {
                this.toast.delay = 4;
            })
    }
}
export class PageHttps extends Page {
    private toast = toast.list();
    constructor(comment = true) {
        super('');
        comment && new Comment();
        this.init();
    }
    protected init() {
        this.toast.push('此页面混有部分不安全链接，即将替换为安全链接并刷新~');
        fetch(location.href)
            .then(d => d.text())
            .then(d => {
                this.toast.push('刷新中>>>');
                console.clear();
                this.updateHtml(https(d, true));
                this.updateDom();
                BLOD.flushToast();
                this.toast.push('> 刷新成功');
                this.toast.delay = 4;
            })
            .catch(e => {
                this.toast.push('重构页面错误', e);
                debug.error('重构页面错误', e);
                this.toast.type = 'error';
            })
            .finally(() => {
                this.toast.delay = 4;
            });
    }
}