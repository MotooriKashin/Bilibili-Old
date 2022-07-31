import wrench from "../../images/svg/wrench.svg";
import note from "../../images/svg/note.svg";
import dmset from "../../images/svg/dmset.svg";
import stethoscope from "../../images/svg/stethoscope.svg";
import play from "../../images/svg/play.svg";
import palette from "../../images/svg/palette.svg";
import bioscope from "../../images/svg/bioscope.svg";
import download from "../../images/svg/download.svg";

/** 设置项菜单名称，注册新设置菜单时请拓展本接口 */
export interface MenuName {
    common: "通用";
    danmaku: "弹幕";
    download: "下载";
    rewrite: "重构";
    live: "直播";
    restore: "修复";
    player: "播放";
    style: "样式";
}
/** 设置菜单 */
interface Menu<T extends keyof MenuName> {
    /** 主键 */
    key: T;
    /** 名称 */
    value: MenuName[T];
    /** 图标（svg格式） */
    svg?: string;
}
/** 【后台脚本】菜单配置 */
export const menu: Menu<keyof MenuName>[] = [
    {
        key: "common",
        value: "通用",
        svg: wrench
    },
    {
        key: "rewrite",
        value: "重构",
        svg: note
    },
    {
        key: "danmaku",
        value: "弹幕",
        svg: dmset
    },
    {
        key: "restore",
        value: "修复",
        svg: stethoscope
    },
    {
        key: "player",
        value: "播放",
        svg: play
    },
    {
        key: "style",
        value: "样式",
        svg: palette
    },
    {
        key: "live",
        value: "直播",
        svg: bioscope
    },
    {
        key: "download",
        value: "下载",
        svg: download
    }
];