import wrench from "../../images/svg/wrench.svg";
import note from "../../images/svg/note.svg";
import dmset from "../../images/svg/dmset.svg";
import stethoscope from "../../images/svg/stethoscope.svg";
import play from "../../images/svg/play.svg";
import palette from "../../images/svg/palette.svg";
import bioscope from "../../images/svg/bioscope.svg";
import download from "../../images/svg/download.svg";
import { HTMLInputAttribudeMap } from "../element/input_area/input_area";
import DEFAULT_SETTING from "./setting.json";

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
export interface Menu<T extends keyof MenuName> {
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
export interface SettingList {
    /** 主键 */
    key: keyof typeof DEFAULT_SETTING;
    /** 设置项类型 */
    type: "list";
    /** 所属菜单 */
    menu: keyof MenuName;
    /** 设置列表 */
    list: (SettingL[keyof SettingL])[];
    /** 组合名称 */
    name: string;
}
export interface SettingO {
    /** 名称 */
    label: string;
    /** 图标 */
    svg?: string;
    /** 副标题 */
    sub?: string;
    /** 浮动信息 */
    float?: string;
}
/** 通用设置内容，用于继承 */
export interface SettingConfig extends SettingO {
    /** 主键 */
    key: keyof typeof DEFAULT_SETTING;
    /** 所属菜单 */
    menu: keyof MenuName;

}
export interface SettingN extends SettingO {
    /** 主键 */
    key: string;
}
/** 设置项配置 */
export interface Setting {
    /** 开关 */
    switch: SettingConfig & {
        /** 设置项类型 */
        type: "switch";
        /** 默认值 */
        value: boolean;
        callback?: (v: boolean) => void
    };
    /** 复选 */
    checkbox: SettingConfig & {
        /** 设置项类型 */
        type: "checkbox";
        /** 默认值 */
        value: string[];
        /** 候选值 */
        candidate: string[];
        callback?: (v: boolean) => void
    };
    /** 按钮 */
    button: SettingConfig & {
        /** 设置项类型 */
        type: "button";
        /** 点击回调 */
        func: () => void;
        /** 按钮标题 */
        button?: string;
    };
    /** 单选 */
    select: SettingConfig & {
        /** 设置项类型 */
        type: "select";
        /** 默认值 */
        value: string;
        /** 候选值 */
        candidate: string[];
        /** 候选值对应的样式 */
        styles?: Record<string, string>
        callback?: (v: string) => void
    };
    /** 滑动条 */
    slider: SettingConfig & {
        /** 设置项类型 */
        type: "slider";
        /** 默认值 ∈ [min, max] */
        value: number;
        /** 最小值 默认0 */
        min?: number;
        /** 最大值 默认100 */
        max?: number;
        /** 刻度数 默认100 */
        precision?: number;
        /** 变动时显示当前值 默认真 */
        hint?: boolean;
        callback?: (v: number) => void
    };
    /** 输入框 */
    input: SettingConfig & {
        /** 设置项类型 */
        type: "input";
        /** 默认值 */
        value?: string;
        /** 候选值 可作为提示 */
        candidate?: string[];
        /** 输入框（HTMLInputElement）属性 */
        props?: HTMLInputAttribudeMap;
        change?: (v: string | FileList) => void
    };
}
export interface SettingL {
    /** 开关 */
    switch: SettingN & {
        /** 设置项类型 */
        type: "switch";
        /** 默认值 */
        value: boolean
        callback?: (v: boolean) => void
    };
    /** 复选 */
    checkbox: SettingN & {
        /** 设置项类型 */
        type: "checkbox";
        /** 默认值 */
        value: string[];
        /** 候选值 */
        candidate: string[];
        callback?: (v: boolean) => void
    };
    /** 按钮 */
    button: SettingN & {
        /** 设置项类型 */
        type: "button";
        /** 点击回调 */
        func: () => void;
        /** 按钮标题 */
        button?: string;
    };
    /** 单选 */
    select: SettingN & {
        /** 设置项类型 */
        type: "select";
        /** 默认值 */
        value: string;
        /** 候选值 */
        candidate: string[];
        /** 候选值对应的样式 */
        styles?: Record<string, string>;
        callback?: (v: string) => void;
    };
    /** 滑动条 */
    slider: SettingN & {
        /** 设置项类型 */
        type: "slider";
        /** 默认值 ∈ [min, max] */
        value: number;
        /** 最小值 默认0 */
        min?: number;
        /** 最大值 默认100 */
        max?: number;
        /** 刻度数 默认100 */
        precision?: number;
        /** 变动时显示当前值 默认真 */
        hint?: boolean;
        callback?: (v: number) => void
    };
    /** 输入框 */
    input: SettingN & {
        /** 设置项类型 */
        type: "input";
        /** 默认值 */
        value?: string;
        /** 候选值 可作为提示 */
        candidate?: string[];
        /** 输入框（HTMLInputElement）属性 */
        props?: HTMLInputAttribudeMap;
        change?: (v: string | FileList) => void
    };
}