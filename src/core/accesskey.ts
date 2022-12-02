import { BLOD } from "../bilibili-old";
import { ApiLoginAppThird } from "../io/api-login-app-third";
import { uid } from "../utils/conf/uid";
import { debug } from "../utils/debug";
import { timeFormat } from "../utils/format/time";
import { urlObj } from "../utils/format/url";
import { alert } from "./ui/alert";

export class AccessKey {
    constructor(private BLOD: BLOD) {
        const button = [{
            text: '开始授权',
            callback: () => this.get()
        }];
        if (this.BLOD.status.accessKey.token) {
            button[0].text = '刷新授权';
            button.push(<any>{
                text: '取消授权',
                callback: () => this.remove()
            })
        }
        alert([
            '【账户授权】将授权脚本获取您的登录鉴权，允许脚本访问一些网页端无权访问的B站接口，以实现【解除播放限制】等功能。',
            '警告：如果您启用了脚本的【解除播放限制】功能，并且选择使用【自定义】服务器，请务必自行确认服务器的可信度！',
            '第三方服务器获得授权等于您在上面登录了B站，好比在网吧登录又忘了退出，第三方能用您的账户实现任何登录状态能进行的操作！',
            '个中风险请务必知悉！<strong>如无必要，切莫授权！</strong>'
        ], '授权确认', button);
    }
    get() {
        if (uid) {
            const data = ['正在申请账户授权~'];
            const toast = this.BLOD.toast.toast(0, 'info', ...data);
            new ApiLoginAppThird('https://www.mcbbs.net/template/mcbbs/image/special_photo_bg.png')
                .getData()
                .then(async d => {
                    data.push('成功获取到授权链接~');
                    toast.data = data;
                    return this.BLOD.GM.fetch(d.confirm_uri)
                })
                .then(d => {
                    const date = new Date().getTime();
                    const dateStr = timeFormat(date, true);
                    const obj = urlObj(d.url);
                    this.BLOD.status.accessKey.token = <string>obj.access_key;
                    this.BLOD.status.accessKey.date = date;
                    this.BLOD.status.accessKey.dateStr = dateStr;
                    data.push('------- 授权成功 -------', `鉴权: ${obj.access_key}`, `日期：${dateStr}`);
                    toast.data = data;
                    toast.type = 'success';
                    toast.delay = 4;
                })
                .catch(e => {
                    debug.error('授权出错！', e);
                    data.push('授权出错！', e);
                    toast.data = data;
                    toast.type = 'error';
                    toast.delay = 4;
                })
        } else {
            this.BLOD.toast.warning('请先登录B站账户！');
            this.BLOD.biliQuickLogin();
        }
    }
    remove() {
        this.BLOD.status.accessKey.token = '';
        this.BLOD.status.accessKey.date = 0;
        this.BLOD.status.accessKey.dateStr = '';
        this.BLOD.toast.warning('已清除账户鉴权', '如果您在【解除播放限制】功能中选择【自定义】服务器，那么第三方服务器中很可能依然有鉴权。', '为求保险，您可以修改一次密码，这会强制所有鉴权失效。')();
    }
}