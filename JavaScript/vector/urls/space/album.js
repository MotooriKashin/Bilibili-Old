"use strict";
/**
 * 本模块负责将空间中相簿的链接从动态重定向回去
 */
(function () {
    API.xhrhook(["api.bilibili.com/x/dynamic/feed/draw/doc_list"], function (args) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                let response = JSON.parse(this.responseText);
                let data = response.data.items.reduce((s, d) => {
                    s.push(d.doc_id);
                    return s;
                }, []);
                setTimeout(() => {
                    document.querySelectorAll(".album-card").forEach((d, i) => {
                        d.firstChild.href = `//h.bilibili.com/${data[i]}`;
                        d.children[1].href = `//h.bilibili.com/${data[i]}`;
                    });
                }, 1000);
            }
        });
    });
})();
