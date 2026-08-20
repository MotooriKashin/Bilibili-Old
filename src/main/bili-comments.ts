(() => {
    import('../utils/debug').then(({ log }) => {
        log('s1.hdslb.com/bfs/seed/jinkela/commentpc/bili-comments.js')
    });
    class BiliComments {
        #oid = 0n;
        #type = 1;
        #seekId: number;
        #comment = import('./widget/comment').then(({ Comment }) => new Comment());
        methods = {
            reload: ({ params, seekId }: IBiliComments) => {
                const [type, oid] = params.split(",");
                this.#comment.then(d => {
                    seekId && (d.seek_rpid = seekId)
                    type && (d.type = Number(type));
                    oid && (d.oid = BigInt(oid));
                });
            }
        };
        constructor({ params, seekId }: IBiliComments) {
            const [type, oid] = params.split(',');
            this.#seekId = seekId;
            oid && (this.#oid = BigInt(oid));
            type && (this.#type = Number(type));
        }
        mount(parrent: HTMLElement) {
            this.#comment.then(d => {
                parrent.append(d);
                this.#seekId && (d.seek_rpid = this.#seekId);
                d.type = this.#type;
                d.oid = this.#oid;
            })
            return this;
        }
        async unmount() {
            const comment = await this.#comment;
            comment.identify();
            comment.remove();
        }
        async dispatchAction({ type, args, callback }: IDispatchAction) {
            // 理论上此方法可以代理任何内部方法，只要知道调用约定。
            // 但其实只用模拟那些必需的方法就行了
            switch (type) {
                // 重新加载评论
                case 'reload': {
                    const { params, seekId } = args[0];
                    const [type, oid] = params.split(",");
                    this.#comment.then(d => {
                        seekId && (d.seek_rpid = seekId)
                        type && (d.type = Number(type));
                        oid && (d.oid = BigInt(oid));
                        callback?.();
                    });
                    break;
                }
            }
        }
        engine() {
            return {
                core: "custom",
            };
        }
        async addEventListener(type: IBiliCommentsEvent, listener: (value?: { detail: unknown }) => void) {
            // 只模拟一些必需事件
            const comment = await this.#comment;
            switch (type) {
                // 更新评论总数
                case 'count': {
                    comment.addEventListener(type, <any>listener);
                    break;
                }
            }
        }
        renderToString() {
            return '';
        }
        async renderAsync() { }
        update({ params, seekId }: IBiliComments) {
            const [type, oid] = params.split(',');
            this.#comment.then(d => {
                seekId && (d.seek_rpid = seekId);
                type && (d.type = Number(type));
                oid && (d.oid = BigInt(oid));
            });
            return this;
        }
    }
    Reflect.set(globalThis, 'BiliComments', BiliComments);
})();
interface IBiliComments {
    params: `${number},${number}`;
    seekId: number;
}
/** 代理执行参数 */
interface IDispatchAction {
    /** 要执行的方法名 */
    type: string;
    /** 要传递给执行函数的参数数组 */
    args: any[];
    /** 接收执行结果的回调函数 */
    callback?: Function;
}
type IBiliCommentsEvent = 'count' | 'view-more';