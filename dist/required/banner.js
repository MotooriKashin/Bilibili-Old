/**
 * 本模块负责替换顶栏动图接口
 */
try {
    config.bannerGif && API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
        const obj = API.urlObj(xhr.url);
        let callback = obj.callback;
        let call = window[callback];
        if (call) {
            window[callback] = function (v) {
                v.data = API.randomArray(GM.getValue("index-icon").fix, 1)[0];
                return call(v);
            };
        }
    });
    API.jsonphook(["api.bilibili.com/x/web-show/res/locs", "ids=142"], function (jsonp) {
        const obj = API.urlObj(jsonp.url);
        let callback = obj.callback;
        let call = window[callback];
        if (call) {
            window[callback] = function (v) {
                const data = GM.getValue("banner");
                v.data[142][0].pic = (data && data.pic) || "";
                return call(v);
            };
        }
        xhr({
            url: "https://api.bilibili.com/x/web-show/page/header?resource_id=142",
            responseType: "json"
        }).then((d) => {
            GM.setValue("banner", d.data);
            new Animate(d.data);
        });
    });
    class Animate {
        constructor(v) {
            /**
             * 有在启用了动画banner的配置，且浏览器支持css filter时才加载动画banner的图片资源
             * safari浏览器在mac屏幕上模糊效果有性能问题，不开启
             */
            this.animatedBannerSupport = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('filter: blur(1px)')
                && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            this.resources = [];
            /**
             * container 元素上有其他元素，需使用全局事件判断鼠标位置
             */
            this.entered = false;
            this.extensions = [];
            if (this.animatedBannerSupport)
                this.mounted(v);
            API.addCss(API.getModule("animated-banner.css"), "animated-banner");
        }
        async mounted(v) {
            this.layerConfig = JSON.parse(v.split_layer);
            if (!this.layerConfig.layer)
                return;
            try {
                await Promise.all(this.layerConfig.layer.map(async (v) => {
                    return Promise.all(v.resources.map(async (i, index) => {
                        if (/\.(webm|mp4)$/.test(i.src)) {
                            const res = await xhr({ url: i.src, responseType: "blob" });
                            const url = URL.createObjectURL(res.data);
                            const video = document.createElement('video');
                            video.muted = true;
                            // video.autoplay = true
                            video.loop = true;
                            video.src = url;
                            video.playsInline = true;
                            video.style.objectFit = 'cover'; // 元素尺寸大于视频实际尺寸时放大
                            this.resources[index] = video;
                            // 视频需要添加到dom树才能获取宽高
                            video.width = 0;
                            video.height = 0;
                            document.body.appendChild(video);
                            await new Promise(resolve => {
                                const onMetaLoad = () => {
                                    resolve(true);
                                    video.removeEventListener('loadedmetadata', onMetaLoad);
                                };
                                video.addEventListener('loadedmetadata', onMetaLoad);
                            });
                        }
                        else {
                            const img = document.createElement('img');
                            img.src = i.src;
                            await new Promise(resolve => img.onload = resolve);
                            this.resources[index] = img;
                        }
                    }));
                }));
            }
            catch (e) {
                debug.error('load animated banner images error', e);
                return;
            }
            const container = document.querySelector("#banner_link");
            container.setAttribute("class", "animated-banner");
            let containerHeight = container.clientHeight;
            let containerWidth = container.clientWidth;
            let containerScale = containerHeight / 155;
            // 初始化资源尺寸
            this.layerConfig.layer.forEach(v => {
                var _a, _b, _c, _d;
                v._initState = {
                    scale: 1,
                    rotate: ((_a = v.rotate) === null || _a === void 0 ? void 0 : _a.initial) || 0,
                    translate: ((_b = v.translate) === null || _b === void 0 ? void 0 : _b.initial) || [0, 0],
                    blur: ((_c = v.blur) === null || _c === void 0 ? void 0 : _c.initial) || 0,
                    opacity: ((_d = v.opacity) === null || _d === void 0 ? void 0 : _d.initial) === undefined ? 1 : v.opacity.initial,
                };
                v.resources.forEach((i, index) => {
                    var _a, _b;
                    const el = this.resources[index];
                    if (el.tagName === 'VIDEO') {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                        el.dataset.height = el.videoHeight;
                        el.dataset.width = el.videoWidth;
                    }
                    else {
                        el.dataset.height = el.naturalHeight;
                        el.dataset.width = el.naturalWidth;
                    }
                    const initial = ((_a = v.scale) === null || _a === void 0 ? void 0 : _a.initial) === undefined ? 1 : (_b = v.scale) === null || _b === void 0 ? void 0 : _b.initial;
                    el.height = el.dataset.height * containerScale * initial;
                    el.width = el.dataset.width * containerScale * initial;
                });
            });
            // 初始化图层
            const layers = this.layerConfig.layer.map(v => {
                const layer = document.createElement('div');
                layer.classList.add('layer');
                container.appendChild(layer);
                return layer;
            });
            let displace = 0;
            let enterX = 0;
            let raf = 0;
            const curveParameterToFunc = (param) => {
                const o = API.bezier(...param);
                return v => v > 0 ? o(v) : -o(-v);
            };
            let lastDisplace = NaN;
            // 根据鼠标位置改变状态
            const af = t => {
                try {
                    if (lastDisplace === displace) {
                        return;
                    }
                    lastDisplace = displace;
                    layers.map((layer, i) => {
                        const v = this.layerConfig.layer[i];
                        const a = layer.firstChild;
                        if (!a) {
                            return;
                        }
                        const transform = {
                            scale: v._initState.scale,
                            rotate: v._initState.rotate,
                            translate: v._initState.translate,
                        };
                        if (v.scale) {
                            const x = v.scale.offset || 0;
                            const itp = v.scale.offsetCurve ? curveParameterToFunc(v.scale.offsetCurve) : (x => x);
                            const offset = x * itp(displace);
                            transform.scale = v._initState.scale + offset;
                        }
                        if (v.rotate) {
                            const x = v.rotate.offset || 0;
                            const itp = v.rotate.offsetCurve ? curveParameterToFunc(v.rotate.offsetCurve) : (x => x);
                            const offset = x * itp(displace);
                            transform.rotate = v._initState.rotate + offset;
                        }
                        if (v.translate) {
                            const x = v.translate.offset || [0, 0];
                            const itp = v.translate.offsetCurve ? curveParameterToFunc(v.translate.offsetCurve) : (x => x);
                            const offset = x.map(v => itp(displace) * v);
                            const translate = v._initState.translate.map((x, i) => { var _a; return (x + offset[i]) * containerScale * (((_a = v.scale) === null || _a === void 0 ? void 0 : _a.initial) || 1); });
                            transform.translate = translate;
                        }
                        a.style.transform = `scale(${transform.scale})` +
                            `translate(${transform.translate[0]}px, ${transform.translate[1]}px)` +
                            `rotate(${transform.rotate}deg)`;
                        if (v.blur) {
                            const x = v.blur.offset || 0;
                            const itp = v.blur.offsetCurve ? curveParameterToFunc(v.blur.offsetCurve) : (x => x);
                            const blurOffset = x * itp(displace);
                            let res = 0;
                            if (!v.blur.wrap || v.blur.wrap === 'clamp') {
                                res = Math.max(0, v._initState.blur + blurOffset);
                            }
                            else if (v.blur.wrap === 'alternate') {
                                res = Math.abs(v._initState.blur + blurOffset);
                            }
                            a.style.filter = res < 1e-4 ? '' : `blur(${res}px)`;
                        }
                        if (v.opacity) {
                            const x = v.opacity.offset || 0;
                            const itp = v.opacity.offsetCurve ? curveParameterToFunc(v.opacity.offsetCurve) : (x => x);
                            const opacityOffset = x * itp(displace);
                            const initial = v._initState.opacity;
                            if (!v.opacity.wrap || v.opacity.wrap === 'clamp') {
                                a.style.opacity = Math.max(0, Math.min(1, initial + opacityOffset));
                            }
                            else if (v.opacity.wrap === 'alternate') {
                                const x = initial + opacityOffset;
                                let y = Math.abs(x % 1);
                                if (Math.abs(x % 2) >= 1) {
                                    y = 1 - y;
                                }
                                a.style.opacity = y;
                            }
                        }
                    });
                }
                catch (e) {
                    debug.error(e);
                }
            };
            // 初始化图层内图片和帧动画
            this.layerConfig.layer.map((v, i) => {
                const a = this.resources[0];
                layers[i].appendChild(a);
                if (a.tagName === 'VIDEO') {
                    a.play();
                }
                requestAnimationFrame(af);
            });
            const handleLeave = () => {
                const now = performance.now();
                const timeout = 200;
                const tempDisplace = displace;
                cancelAnimationFrame(raf);
                const leaveAF = t => {
                    if (t - now < timeout) {
                        displace = tempDisplace * (1 - (t - now) / 200);
                        af(t);
                        requestAnimationFrame(leaveAF);
                    }
                    else {
                        displace = 0;
                        af(t);
                    }
                };
                raf = requestAnimationFrame(leaveAF);
            };
            this.handleMouseLeave = e => {
                this.entered = false;
                handleLeave();
            };
            this.handleMouseMove = e => {
                const offsetY = document.documentElement.scrollTop + e.clientY;
                if (offsetY < containerHeight) {
                    if (!this.entered) {
                        this.entered = true;
                        enterX = e.clientX;
                    }
                    displace = (e.clientX - enterX) / containerWidth;
                    cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(af);
                }
                else {
                    if (this.entered) {
                        this.entered = false;
                        handleLeave();
                    }
                }
                this.extensions.map(v => { var _a; return (_a = v.handleMouseMove) === null || _a === void 0 ? void 0 : _a.call(v, { e, displace }); });
            };
            this.handleResize = e => {
                containerHeight = container.clientHeight;
                containerWidth = container.clientWidth;
                containerScale = containerHeight / 155;
                this.layerConfig.layer.forEach(lc => {
                    lc.resources.forEach((d, i) => {
                        var _a, _b;
                        const el = this.resources[i];
                        el.height = el.dataset.height * containerScale * (((_a = lc.scale) === null || _a === void 0 ? void 0 : _a.initial) || 1);
                        el.width = el.dataset.width * containerScale * (((_b = lc.scale) === null || _b === void 0 ? void 0 : _b.initial) || 1);
                    });
                });
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(t => {
                    af(t);
                });
                this.extensions.map(v => { var _a; return (_a = v.handleResize) === null || _a === void 0 ? void 0 : _a.call(v, e); });
            };
            document.addEventListener('mouseleave', this.handleMouseLeave);
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('resize', this.handleResize);
        }
    }
}
catch (e) {
    API.trace(e, "banner.js");
}
