import { addCss, loadScript } from "../runtime/element/add_element";
import { jsonphook } from "../runtime/hook/node";

/** bbComment栈 */
let Feedback: any,
    /** 加载翻页评论中 */
    loading = false,
    /** 加载完成 */
    load = false;;
/** 替换评论区 */
export function loadComment() {
    // 评论组件捕获
    Reflect.defineProperty(window, "bbComment", {
        configurable: true,
        set: v => {
            if (!v.prototype._createNickNameDom) {
                return loadScript("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js").then(() => {
                    Array.from(document.styleSheets).forEach(d => {
                        d.href && d.href.includes("comment") && (d.disabled = true);
                    })
                })
            }
            Feedback = v;
            bbCommentModify();
            Reflect.defineProperty(window, "bbComment", { configurable: true, value: Feedback });
        },
        get: () => {
            return Feedback ? Feedback : class {
                constructor() {
                    if (!loading) {
                        loadScript("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js").then(() => {
                            Array.from(document.styleSheets).forEach(d => {
                                d.href && d.href.includes("comment") && (d.disabled = true);
                            })
                        });
                        loading = true;
                    }
                    setTimeout(() => new (<any>window).bbComment(...arguments))
                }
                on() { }
            }
        }
    });
    // 新版评论组件捕获
    Reflect.defineProperty(window, "initComment", {
        configurable: true,
        set: v => true,
        get: () => {
            if (load) {
                function initComment(tar: string, init: Record<"oid" | "pageType" | "userStatus", any>) {
                    new Feedback(tar, init.oid, init.pageType, init.userStatus);
                }
                Reflect.defineProperty(window, "initComment", { configurable: true, value: initComment });
                // 出栈
                return initComment;
            }
            return function () {
                if (!loading) {
                    loadScript(`//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js`).then(() => {
                        load = true;
                    })
                }
                loading = true;
                setTimeout(() => (<any>window).initComment(...arguments), 100);
            }
        }
    });
    // 修复按时间排序评论翻页数
    jsonphook(["api.bilibili.com/x/v2/reply?", "sort=2"], undefined, res => {
        if (0 === res.code && res.data?.page) {
            const page = res.page;
            page && jsonphook("api.bilibili.com/x/v2/reply?", undefined, res => {
                if (0 === res.code && res.data?.page) {
                    page.count && (res.data.page.count = page.count);
                    page.acount && (res.data.page.acount = page.acount);
                }
                return res;
            }, false);
        }
        return res;
    })
}
/** 修补评论组件 */
function bbCommentModify() {
    // 推出abtest，获取翻页评论区
    Feedback.prototype.initAbtest = function () {
        this.abtest = {};
        this.abtest.optimize = false; //abtest.web_reply_list

        if (this.jumpId || this.noPage) {
            this.abtest.optimize = false;
        } // TODO: 漫画独立处理他们的pc 端内容


        if (this.appMode === 'comic') {
            this.abtest.optimize = false;
        }

        this._registerEvent();

        this.init();
    };
    // 添加回小页码区
    Feedback.prototype._renderBottomPagination = function (pageInfo: any) {
        if (this.noPage) {
            var isLastPage = pageInfo.count <= this.pageSize;
            var html = '';

            if (isLastPage) {
                html = '没有更多了～';
            } else {
                html = '<a class="more-link" href="javascript:">查看更多评论</a>';
            }

            this.$root.find('.bottom-page').addClass('center').html(html);
            return;
        }

        const count = Math.ceil(pageInfo.count / pageInfo.size);

        if (count > 1) {
            this.$root.find(".header-interaction").addClass("paging-box").paging({
                pageCount: count,
                current: pageInfo.num,
                backFn: (p: any) => {
                    this.$root.trigger('replyPageChange', {
                        p: p,
                        isBottom: true
                    });
                    this.trigger('replyPageChange', {
                        p: p,
                        isBottom: true
                    });
                    this.currentPage = p;
                }
            })
            this.$root.find('.bottom-page').paging({
                pageCount: count,
                current: pageInfo.num,
                jump: true,
                smallSize: this.smallPager,
                backFn: (p: any) => {
                    this.$root.trigger('replyPageChange', {
                        p: p,
                        isBottom: true
                    });
                    this.trigger('replyPageChange', {
                        p: p,
                        isBottom: true
                    });
                    this.currentPage = p;
                }
            });
        } else {
            this.$root.find(".header-page").html("");
            this.$root.find('.bottom-page').html('');
        }
    };
    // 顶层评论ip属地
    Feedback.prototype._createListCon = function (item: any, i: any, pos: any) {
        //黑名单结构
        const blCon = this._parentBlacklistDom(item, i, pos); //正常结构


        const con = [
            '<div class="con ' + (pos == i ? 'no-border' : '') + '">',
            '<div class="user">' + this._createNickNameDom(item),
            this._createLevelLink(item),
            this._identity(item.mid, item.assist, item.member.fans_detail),
            this._createNameplate(item.member.nameplate) + this._createUserSailing(item) + '</div>',
            this._createMsgContent(item),
            this._createPerfectReply(item),
            '<div class="info">',
            item.floor ? '<span class="floor">#' + item.floor + "</span>" : "",
            this._createPlatformDom(item.content.plat),
            "<span class=\"time-location\">",
            "<span class=\"reply-time\">".concat(this._formateTime(item.ctime), "</span>"),
            item?.reply_control?.location ? `<span class="reply-location">${item?.reply_control?.location || ''}</span>` : '',
            "</span>",
            item.lottery_id ? '' : '<span class="like ' + (item.action == 1 ? 'liked' : '') + '"><i></i><span>' + (item.like ? item.like : '') + '</span></span>',
            item.lottery_id ? '' : '<span class="hate ' + (item.action == 2 ? 'hated' : '') + '"><i></i></span>', item.lottery_id ? '' : this._createReplyBtn(item.rcount),
            item.lottery_id && item.mid !== this.userStatus.mid ? '' : '<div class="operation more-operation"><div class="spot"></div><div class="opera-list"><ul>' + (this._canSetTop(item) ? '<li class="set-top">' + (item.isUpTop ? '取消置顶' : '设为置顶') + '</li>' : '') + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) && !item.isTop ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>',
            this._createLotteryContent(item.content),
            this._createVoteContent(item.content),
            this._createTags(item),
            '</div>', '<div class="reply-box">',
            this._createSubReplyList(item.replies, item.rcount, false, item.rpid, item.folder && item.folder.has_folded, item.reply_control),
            '</div>',
            '<div class="paging-box">',
            '</div>',
            '</div>'
        ].join('');

        return item.state === this.blacklistCode ? blCon : con;
    };
    // 楼中楼评论ip属地
    Feedback.prototype._createSubReplyItem = function (item: any, i: any) {
        if (item.invisible) {
            return '';
        }

        return [
            '<div class="reply-item reply-wrap" data-id="' + item.rpid + '" data-index="' + i + '">',
            this._createSubReplyUserFace(item),
            '<div class="reply-con">', '<div class="user">',
            this._createNickNameDom(item),
            this._createLevelLink(item),
            this._identity(item.mid, item.assist, item.member.fans_detail),
            this._createSubMsgContent(item),
            '</div>',
            '</div>',
            '<div class="info">',
            item.floor ? '<span class="floor">#' + item.floor + "</span>" : "",
            this._createPlatformDom(item.content.plat),
            "<span class=\"time-location\">",
            "<span class=\"reply-time\">".concat(this._formateTime(item.ctime), "</span>"),
            item?.reply_control?.location ? `<span class="reply-location">${item?.reply_control?.location || ''}</span>` : '',
            "</span>",
            '<span class="like ' + (item.action == 1 ? 'liked' : '') + '"><i></i><span>' + (item.like ? item.like : '') + '</span></span>',
            '<span class="hate ' + (item.action == 2 ? 'hated' : '') + '"><i></i></span>',
            '<span class="reply btn-hover">回复</span>',
            item.dialog != item.rpid ? '<span class="dialog btn-hover" dialog="' + item.dialog + '">查看对话</span>' : '',
            '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>',
            '</div>',
            '</div>'].join('');
    };
    // 加高评论区操作按钮
    addCss(`.bb-comment .comment-list .list-item .info .btn-hover, .comment-bilibili-fold .comment-list .list-item .info .btn-hover {
        line-height: 24px;
    }`, "comment-btn-24pxH");
    // 不让楼中楼操作菜单在非hover状态时消失
    addCss(`.operation.btn-hide-re .opera-list {visibility: visible}`, "keep-operalist-visible");
    // 楼中楼“查看对话按钮” & 让评论菜单可以通过再次点击按钮来关闭
    const _registerEvent: Function = Feedback.prototype._registerEvent;
    Feedback.prototype._registerEvent = function (e: any) {
        _registerEvent.call(this, e);
        let n = this.$root;
        let $ = (<any>window).$;
        if (e) n = $(e);
        let l = this;
        // 楼中楼“查看对话按钮”
        n.on("click.dialog", ".dialog", function (this: any) {
            let clickTarget = this;
            clickTarget.innerHTML = "正在载入……";
            let rootid = clickTarget.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id"); // 楼中楼所属的父级评论的id
            let dialogid = clickTarget.getAttribute("dialog");
            // 载入所需的样式
            addCss(`
            .comment-dialog .dialog{display:none!important}
            .comment-dialog > .comment-list{transform:translateY(-13px)}
            .comment-dialog{min-height:200px;max-height:70vh;overflow-y:auto}
            .comment-dialog-container{width:600px;z-index:100000;position:fixed;background:#fff;left:50%;top:50%;transform:translate(-50%,-50%);box-shadow:0 0 20px 3px #0000005c;border-radius:10px;padding:0 18px;opacity:1;transition:opacity 0.1s}
            .comment-dialog-container.hidden{opacity:0}`, "comment-dialog");
            let container = document.createElement("div");
            container.className = "comment-dialog-container hidden";
            // 为了利用已有的评论区样式、与样式的选择器匹配上，悬浮窗的dom树与评论区的相同
            container.innerHTML = `
            <div class="comment-dialog bb-comment">
            <div class="comment-list">
            <div class="list-item" data-id="${rootid}">
            <div class="con" style="border:none;margin:0;padding:0;">
            <div class="reply-box">
            </div></div></div></div></div>`;
            document.body.appendChild(container);
            let replyBox = container.getElementsByClassName("reply-box")[0];
            setTimeout(() => {
                let closeWindow = (e: Event) => {
                    // 点击了悬浮窗以外区域则关闭窗口
                    if (!container.contains(<HTMLElement>e.target) && e.target != container) {
                        container.className = "comment-dialog-container hidden";
                        setTimeout(() => container.remove(), 100);
                        clickTarget.innerHTML = "查看对话"
                        window.removeEventListener('click', closeWindow, false);
                    }
                };
                window.addEventListener('click', closeWindow);
            }, 0);
            /**
             * 从minFloor层开始，向后获取20条对话的数据
             * @param  {number} minFloor 起始楼层
             */
            function fetchDialog(minFloor: number) {
                // https://github.com/czp3009/bilibili-api/blob/master/src/main/kotlin/com/hiczp/bilibili/api/main/MainAPI.kt
                return $.ajax({
                    url: "//api.bilibili.com/x/v2/reply/dialog/cursor",
                    type: "GET",
                    data: {
                        type: l.pageType,
                        oid: l.oid,
                        root: rootid,
                        dialog: dialogid,
                        size: 20,
                        min_floor: minFloor
                    },
                    xhrFields: { withCredentials: true }
                });
            }
            /**
             * 修复当评论中含有大型表情图片时头像框的错位
             * @see l._fixEmojiPosition
             * @param  {HTMLElement} node
             */
            function fixEmojiPosition(node: any) {
                node = $(node);
                node.find(".reply-item").each(function (_: any, n: any) {
                    var t = $(n).find(".reply-face"),
                        r = $(n).find(".user"),
                        n = $(n).find(".name");
                    t && r && n && (10 < n.offset().top - r.offset().top ? t.css("top", "32px") : t.css("top", "0"))
                });
            }
            fetchDialog(0).done((resp: any) => {
                if (resp.code == 0 && resp.data.replies && resp.data.replies.length > 0) {
                    replyBox.innerHTML = l._createSubReplyList(resp.data.replies, resp.data.replies.length, true, rootid, null, false);
                    l._registerEvent(container);
                    container.className = "comment-dialog-container";
                    fixEmojiPosition(replyBox);
                    function nextPage(minFloor: number) {
                        if (minFloor < resp.data.dialog.max_floor) {
                            fetchDialog(minFloor + 1).done((resp: any) => {
                                if (resp.code == 0 && resp.data.replies && resp.data.replies.length > 0) {
                                    replyBox.insertAdjacentHTML("beforeend", l._createSubReplyList(resp.data.replies, resp.data.replies.length, true, rootid, null, false));
                                    nextPage(resp.data.cursor.max_floor);
                                }
                            });
                        } else fixEmojiPosition(replyBox);
                    }
                    nextPage(resp.data.cursor.max_floor);
                }
            });
        })
        // 让评论菜单可以通过再次点击按钮来关闭
        n.off("click.operation", ".spot");
        n.on("click.operation", ".spot", function (this: any, e: any) {
            let operalist = this.parentNode.getElementsByClassName("opera-list")[0];
            if (l.lastClickOperation != this || (operalist && operalist.style.display == "none")) {
                $(".opera-list").hide(),
                    $(this).siblings(".opera-list").show(),
                    e.stopPropagation(),
                    $(this).hasClass("more-operation") && (e = +$(this).parents(".reply-wrap:eq(0)").attr("data-id"));
                l.lastClickOperation = this;
            } else
                operalist && (operalist.style.display = "none");
        })
    }
}