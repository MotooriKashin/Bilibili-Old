interface modules {
    /** 默认fnval标记 */
    readonly "fnval.js": string;
}
namespace API {
    /** fnval参数标志位（二进制） */
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
    const _ = new Fnval();
    /** 视频格式标志`fnval`的默认值（最高值） */
    export const fnval = Reflect.ownKeys(_).reduce((s, d) => {
        s += (<any>_)[d];
        return s;
    }, -1);
}