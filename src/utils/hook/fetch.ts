/**
 * @file fetch hook
 * @author kashin
 */

export class FetchHook {

    private static inited = false;

    private static rules = new Set<FetchHook>();

    private static init() {
        const fetch = self.fetch;
        self.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
            const url = input instanceof Request ? input.url : typeof input === 'string' ? input : input.toJSON();
            const obj: FetchInit = { input: url, init };
            let fetchHook: FetchHook;
            for (const rule of this.rules) {
                if (rule && rule.urls.every(d => url.includes(d))) {
                    rule.$request?.(obj);
                    rule.$response && (fetchHook = rule);
                }
            }
            if (fetchHook!) {
                return new Promise((resolve: (value: Response) => void, reject) => {
                    if (fetchHook.noRequest) {
                        fetchHook.$response!()
                            .then(d => {
                                d ? resolve(new Response(d, { status: 200, statusText: '' })) : reject();
                            })
                            .catch(reject);
                    } else {
                        fetch(obj.input, obj.init)
                            .then(async d => {
                                const res = await fetchHook.$response!(d.clone());
                                resolve(res ? new Response(res, { status: d.status, statusText: d.statusText, headers: d.headers }) : d);
                            })
                            .catch(reject);
                    }
                });
            }
            return fetch(obj.input, obj.init);
        }
        this.inited = true;
    }

    private urls: string[];

    /** 不发送原始请求 */
    private noRequest = false;

    /** 取消本次拦截 */
    noModify = false;

    constructor(...urls: string[]) {
        FetchHook.inited || FetchHook.init();
        this.urls = urls;
        FetchHook.rules.add(this);
    }

    private $request?: (req: FetchInit) => void;

    /**
     * 拦截修改fetch请求
     * 
     * @param callback 修改请求的回调函数，将fetch参数包裹为对象传入，修改对应属性即可。
     */
    request(callback: (req: FetchInit) => void) {
        this.$request = callback;
    }

    private $response?: (res?: Response) => Promise<BodyInit | void>

    /**
     * 拦截修改fetch返回值
     * 
     * @param callback 修改返回值的回调函数，将原Response传入，异步返回新返回值即可，也可以不反悔任何值，表示使用不修改原始值
     * @param noRequest 不发送原始请求，callback中将不会原Response。通常用于不依赖原始返回值便能构造新返回值的情形。此时callback必须返回值！
     */
    response(callback: (res: Response) => Promise<BodyInit | void>, noRequest = false) {
        this.$response = <any>callback;
        this.noRequest = noRequest;
    }
}

interface FetchInit {
    input: RequestInfo | URL;
    init?: RequestInit;
}