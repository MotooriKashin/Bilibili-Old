import { loadScript } from "../runtime/element/add_element";
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
            '<div class="operation btn-hover btn-hide-re"><div class="spot"></div><div class="opera-list"><ul>' + (this._canBlackList(item.mid) ? '<li class="blacklist">加入黑名单</li>' : '') + (this._canReport(item.mid) ? '<li class="report">举报</li>' : '') + (this._canDel(item.mid) ? '<li class="del" data-mid="' + item.mid + '">删除</li>' : '') + '</ul></div></div>',
            '</div>',
            '</div>'].join('');
    };
}