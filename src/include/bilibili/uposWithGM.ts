namespace API {
    /** hook标记，防止重复操作 */
    let isHooking = false;
    /**
     * 修改xhr响应
     * @param target 目标XMLHttpRequest
     * @param res GM.xmlHttpRequest响应
     * @param v 目标XMLHttpRequest对应的回调
     */
    function defineRes(target: XMLHttpRequest, res: GMxhrResponse, v: () => void) {
        Object.defineProperties(target, {
            status: {
                configurable: true,
                writable: true,
                value: res.status
            },
            statusText: {
                configurable: true,
                writable: true,
                value: res.statusText
            },
            response: {
                configurable: true,
                writable: true,
                value: res.response
            },
            responseText: {
                configurable: true,
                writable: true,
                value: res.responseText
            },
            responseXML: {
                configurable: true,
                writable: true,
                value: res.responseXML
            },
            responseURL: {
                configurable: true,
                writable: true,
                value: res.finalUrl
            }
        });
        v();
    }
    /**
     * GM.xmlHttpRequest代理视频请求
     * @param url 视频流url关键词，若为数组，数组间是并的关系，即必须同时满足才会代理
     * @param UserAgent 指定UserAgent
     */
    export function uposWithGM(url: string | string[] = ".m4s", UserAgent = config.userAgent) {
        if (isHooking) return;
        xhrhookUltra(url, function (target, args) {
            const obj: GMxhrDetails = {
                method: <"GET" | "HEAD" | "POST">args[0],
                url: args[1],
                headers: {
                    "user-agent": UserAgent
                },
                onloadstart: (res) => {
                    defineRes(this, res, () => { });
                }
            }
            args[2] || (obj.anonymous = true);
            Object.defineProperties(this, {
                responseType: {
                    configurable: true,
                    set: v => {
                        obj.responseType = v;
                    },
                    get: () => obj.responseType
                },
                onload: {
                    configurable: true,
                    set: v => {
                        obj.onload = (res) => {
                            defineRes(this, res, v);
                        }
                    },
                    get: () => obj.onload
                },
                onerror: {
                    configurable: true,
                    set: v => {
                        obj.onerror = (res) => {
                            defineRes(this, res, v);
                        }
                    },
                    get: () => obj.onerror
                },
                timeout: {
                    configurable: true,
                    set: v => {
                        obj.timeout = v
                    },
                    get: () => obj.timeout
                },
                ontimeout: {
                    configurable: true,
                    set: v => {
                        obj.ontimeout = (res) => {
                            defineRes(this, res, v);
                        }
                    },
                    get: () => obj.ontimeout
                },
                onprogress: {
                    configurable: true,
                    set: v => {
                        obj.onprogress = (res) => {
                            defineRes(this, res, v.bind(this, new ProgressEvent("progress", {
                                lengthComputable: res.lengthComputable,
                                loaded: res.loaded,
                                total: res.total
                            })));
                        }
                    },
                    get: () => obj.onprogress
                },
                onabort: {
                    configurable: true,
                    set: v => {
                        obj.onabort = (res) => {
                            defineRes(this, res, v);
                        }
                    },
                    get: () => obj.onabort
                },
                onreadystatechange: {
                    configurable: true,
                    set: v => {
                        obj.onreadystatechange = (res) => {
                            defineRes(this, res, v);
                        }
                    },
                    get: () => obj.onreadystatechange
                },
                setRequestHeader: {
                    configurable: true,
                    value: (name: string, value: string) => {
                        obj.headers && (obj.headers[name] = value);
                    }
                },
                send: {
                    configurable: true,
                    value: (body?: GMxhrDetails["data"]) => {
                        obj.method === "POST" && body && (obj.data = body);
                        const tar = GM.xmlHttpRequest(obj);
                        this.abort = tar.abort.bind(tar);
                        return true;
                    }
                }
            })
        });
        isHooking = true;
    }
}