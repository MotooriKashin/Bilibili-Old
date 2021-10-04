/**
 * 本模块负责重新旧版专栏页面
 */
(function () {
    try {
        class Read {
            constructor() {
                this.bar = [
                    [0, "推荐", "home"],
                    [2, "动画", "douga"],
                    [1, "游戏", "game"],
                    [28, "影视", "cinephile"],
                    [3, "生活", "life"],
                    [29, "兴趣", "interest"],
                    [16, "轻小说", "lightnovel"],
                    [17, "科技", "technology"],
                    [41, "笔记", "note"]
                ];
                this.data = "";
                this.temp = "";
                API.path.name = "read";
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            prepareA() {
                xhr({ url: location.href, credentials: true }).then(d => { this.build(d); });
            }
            prepareB() {
                let data = xhr({ url: location.href, async: false });
                this.build(data);
            }
            build(d) {
                this.data = d.includes("__INITIAL_STATE__=") ? JSON.parse(d.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "")) : "";
                if (!this.data)
                    throw "获取专栏数据失败！";
                this.bars();
                this.upinfo();
                this.head();
                this.body();
                this.tag();
                this.write();
            }
            bars() {
                this.temp += this.bar.reduce((o, d) => {
                    o = o + `<a href="//www.bilibili.com/read/${d[2]}?from=articleDetail" target="_self" class="tab-item${this.data.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="${d[0]}"><span>${d[1]}</span></a>`;
                    return o;
                }, `<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>`) + "</div>";
            }
            upinfo() {
                this.temp += `<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
            <a class="up-face-holder" href="//space.bilibili.com/${this.data.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="${this.data.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
            <a class="up-name" href="//space.bilibili.com/${this.data.readInfo.author.mid}" target="_blank">${this.data.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
            </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>`;
            }
            head() {
                this.temp += `<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
            <h1 class="title">${this.data.readInfo.title}</h1><div class="info">
            <a class="category-link" href="//www.bilibili.com/read/${this.bar.find(d => {
                    if (d[0] == this.data.readInfo.category.parent_id)
                        return d;
                })[2]}#rid=${this.data.readInfo.category.id}" target="_blank"><span>${this.data.readInfo.category.name}</span></a> <span class="create-time" data-ts="${this.data.readInfo.ctime}"></span><div class="article-data"></div>
            </div></div><div style="display:none" class="author-container">
            <a class="author-face" href="//space.bilibili.com/${this.data.readInfo.author.mid}" target="_blank"><img data-face-src="${this.data.readInfo.author.face.replace("http:", "")}" src="${this.data.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/${this.data.readInfo.author.mid}" target="_blank">${this.data.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>`;
            }
            body() {
                this.temp += `<div class="article-holder">${this.data.readInfo.content}</div><p class="original">本文为我原创</p>`;
            }
            tag() {
                this.temp += (this.data.readInfo.tags || []).reduce((o, d) => {
                    o = o + `<li data-tag-id="${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">${d.name}</span></li>`;
                    return o;
                }, `<ul class="tag-container">`) + `</ul><div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>`;
            }
            write() {
                window.original = {
                    cvid: this.data.cvid,
                    author: {
                        name: this.data.readInfo.author.name,
                        mid: this.data.readInfo.author.mid,
                    },
                    banner_url: this.data.readInfo.banner_url || (this.data.readInfo && this.data.readInfo.image_urls[0]) || null,
                    reprint: this.data.readInfo.reprint,
                    summary: this.data.readInfo.summary,
                    media: "",
                    actId: this.data.readInfo.act_id,
                    dispute: {
                        dispute: "",
                        dispute_url: ""
                    },
                    spoiler: "0"
                };
                this.data = `<div class="page-container">${this.temp}</div>`;
                API.rewriteHTML(API.getModule("read.html").replace(`<div class="page-container"></div>`, this.data));
                API.runWhile(() => document.body, () => API.importModule("user-select.js"));
            }
        }
        new Read();
    }
    catch (e) {
        API.trace(e, "read.js", true);
    }
})();
