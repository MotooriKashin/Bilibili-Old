/** 屏蔽弹幕 */
export enum DANMAKU_FORBID {
    /** 所有弹幕 */
    VISIBLE = 1 << 0,
    /** 普通弹幕 */
    NORMAL = 1 << 1,
    /** 底部弹幕 */
    BOTTOM = 1 << 4,
    /** 顶部弹幕 */
    TOP = 1 << 5,
    /** 逆向弹幕 */
    REVERSE = 1 << 6,
    /** 高级弹幕 */
    ADVANCE = 1 << 7,
    /** 代码弹幕 */
    CODE = 1 << 8,
    /** BAS弹幕 */
    BAS = 1 << 9,
}