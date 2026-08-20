(() => {
    class bbComment {
        #comment = import('./widget/comment').then(({ Comment }) => new Comment());
        constructor(
            /** 父元素的 CSS 选择器字符串 */
            parent: string | HTMLElement,
            /** 视频aid或话题topic id */
            oid: number | IOid,
            /**
             * 评论所在页面类型
             * 
             * | 1 | 2 | 33 |
             * | - | - | - |
             * | 视频 | 话题 | 课程 |
             */
            pageType = 1,
            /** 用户信息 */
            userStatus?: unknown,
            /** 需要跳转到的评论的id */
            jumpId?: number | string,
            /** 预留参数 */
            ex?: unknown,
        ) {
            const target = typeof parent === 'string' ? document.querySelector<HTMLElement>(parent) : parent;
            if (target) {
                this.#comment.then(d => {
                    target.parentElement?.replaceChildren(d);

                    if (typeof oid === 'object') {
                        const { oid: id, pageType, jumpId } = oid;

                        jumpId && (d.seek_rpid = jumpId);
                        pageType && (d.type = Number(pageType));
                        id && (d.oid = BigInt(id));
                    } else {
                        jumpId && (d.seek_rpid = jumpId);
                        pageType && (d.type = Number(pageType));
                        oid && (d.oid = BigInt(oid));
                    }
                });
            }
        }
    }
    Reflect.defineProperty(globalThis, 'bbComment', { value: bbComment });
})();
interface IOid {
    /** 视频aid或话题topic id */
    oid: number;
    /**
     * 评论所在页面类型
     * 
     * | 1 | 2 | 33 |
     * | - | - | - |
     * | 视频 | 话题 | 课程 |
     */
    pageType?: number;
    /** 用户信息 */
    userState?: unknown;
    noLevelLimit?: boolean;
    /** 需要跳转到的评论的id */
    jumpId?: number | string;
    noPage?: boolean;
    pageSize?: number;
    dynamicRepost?: unknown;
    contentMaxLength?: number;
    smallPager?: boolean;
    disableText?: boolean;
    scroller?: unknown;
    domain?: string;
}