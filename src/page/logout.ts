/**
 * @file logout
 * @author kashin
 */

import { toast } from "../core/toast";
import { passportLoginExit } from "../io/passport-login-exit";
import { uid } from "../utils/conf/uid";

/** 退出登录 */
export function loginExit() {
    if (uid) {
        if (document.readyState === 'complete') {
            const tt = toast.list('正在退出登录 >>>');
            passportLoginExit()
                .then(d => {
                    tt.push('> 退出登录成功', '> 正在重定向 >');
                    tt.type = 'success';
                    location.replace(d);
                })
                .catch(e => {
                    tt.push('> 退出登录失败', e);
                    tt.type = 'error';
                })
                .finally(() => {
                    tt.delay = 4;
                });
        } else {
            window.addEventListener('load', loginExit, { once: true });
        }
    }
}