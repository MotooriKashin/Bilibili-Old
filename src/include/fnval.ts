interface modules {
    /**
     * 默认fnval标记
     */
    readonly "fnval.js": string;
}
{
    /**
     * fnval参数标志位
     */
    class Fnval {
        MP4 = 1;
        DASH_H265 = 16;
        HDR = 64;
        DASH_4K = 128;
        DOLBYAUDIO = 256;
        DOLBYVIDEO = 512;
        DASH_8K = 1024;
        DASH_AV1 = 2048;
    }
    const fnval = new Fnval();
    // 构造播放源请求参数fnval，取当前支持的最大值。
    API.fnval = Reflect.ownKeys(fnval).reduce((s, d) => {
        s += fnval[d];
        return s;
    }, -1);
}
declare namespace API {
    /**
     * 视频格式标志：fnval
     */
    export let fnval: number;
}