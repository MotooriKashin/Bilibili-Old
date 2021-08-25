"use strict";
/**
 * 本模块负责修复对于番剧出差(uid=11783021)空间的访问
 */
(function () {
    /**
     * 备份的uid信息，可能需要偶尔更新一下？
     */
    const response = {
        "code": 0,
        "data": {
            "birthday": "1980-01-01",
            "coins": 0,
            "face": "http://i2.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg",
            "fans_badge": false,
            "is_followed": true,
            "jointime": 1436351229,
            "level": 6,
            "mid": "11783021",
            "moral": 0,
            "name": "哔哩哔哩番剧出差",
            "official": {
                "type": 1,
                "desc": "哔哩哔哩番剧出差 官方账号"
            },
            "pendant": {
                "pid": 0,
                "name": "",
                "image": "",
                "expire": 0
            },
            "rank": "10000",
            "sex": "保密",
            "sign": "",
            "silence": 0,
            "sys_notice": {},
            "theme": {},
            "user_honour_info": {
                "colour": null,
                "mid": 0,
                "tags": null
            },
            "vip": {
                "avatar_subscript": 1,
                "avatar_subscript_url": "http://i0.hdslb.com/bfs/vip/icon_Certification_big_member_22_3x.png",
                "due_date": 1655740800000,
                "label": {
                    "bg_color": "#FB7299",
                    "bg_style": 1,
                    "border_color": "",
                    "label_theme": "annual_vip",
                    "path": "",
                    "text": "年度大会员",
                    "text_color": "#FFFFFF"
                },
                "nickname_color": "#FB7299",
                "role": 3,
                "status": 1,
                "theme_type": 0,
                "type": 2, "vip_pay_type": 1
            }
        },
        "message": "0",
        "ttl": 1
    };
    API.xhrhook(["api.bilibili.com/x/space/acc/info"], function (args) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                if (this.responseText && this.responseText.includes("-404")) {
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    this.response = this.responseText = JSON.stringify(response);
                    API.toast.warning("该用户被404，已使用缓存数据恢复访问！");
                }
            }
        });
    });
})();
