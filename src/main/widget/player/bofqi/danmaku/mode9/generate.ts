import { log } from "../../../../../../utils/debug";
import type { ASTNode, ColorNode, CurserNode, DefNode, LetNode, NumberNode, ParamNode, PercentNode, StringNode, SubNode, TimeNode } from "./parser";

export function generate(asts: ASTNode[]) {
    const mode9: IMode9[] = [];
    const mode9Object: Record<string, DefNode> = {};
    for (const ast of asts) {
        switch (ast.type) {
            case 'def':
            case 'let': {
                switch ((<LetNode>ast).key) {
                    case 'text': case 'button': case 'path': {
                        const { value, params, properties } = (<LetNode>ast);
                        const param = (<ParamNode[]>params).reduce((s, { key, value }) => {
                            s[key] = value;
                            return s;
                        }, <Record<string, ASTNode>>{});
                        const res = (<ParamNode[]>properties).reduce((s, { key, value }) => {
                            switch (value.type) {
                                case 'curser': {
                                    // 解析参数
                                    const d = (<CurserNode>value).value;
                                    if (param[d]) {
                                        value = param[d];
                                    } else {
                                        log(`未知属性${key}，其值${d}也并非参数`);
                                    }
                                    break;
                                }
                                case 'sub': {
                                    // 解析嵌套对象
                                    value = (<SubNode>value).value.reduce((s, { key, value }) => {
                                        s[key] = value;
                                        return s;
                                    }, <any>{});
                                    break;
                                }
                            }
                            s[key] = value;
                            return s;
                        }, <Record<string, ASTNode> & { type: 'text' | 'button' | 'path' }>{ type: (<LetNode>ast).key });
                        mode9Object[value] = <DefNode>ast;
                        mode9.push(res);
                        break;
                    }
                    default: {
                        const module = mode9Object[(<LetNode>ast).key];
                        if (module) {
                            // 解析模板继承
                            // TODO：先继承，再优先处理匿名参数
                            const { key, params: p0, properties: s0 } = module;
                            const { value, params, properties } = (<LetNode>ast);
                            (<LetNode>ast).key = key; // 还原为原始类型
                            const param = params.reduce((s, d, i) => {
                                if (d.type === 'param') {
                                    const { key, value } = <ParamNode>d;
                                    s[key] = value;
                                } else {
                                    const d = (<ParamNode[]>p0)[i];
                                    if (d) {
                                        const { key } = d;
                                        s[key] = d;
                                    } else {
                                        log(`未知参数`)
                                    }
                                }
                                return s;
                            }, <Record<string, ASTNode>>{});
                            const res = (<ParamNode[]>[...s0, ...properties]).reduce((s, { key, value }) => {
                                switch (value.type) {
                                    case 'curser': {
                                        // 解析参数
                                        const d = (<CurserNode>value).value;
                                        if (param[d]) {
                                            value = param[d];
                                        } else {
                                            log(`未知属性${key}，其值${d}也并非参数`);
                                        }
                                        break;
                                    }
                                    case 'sub': {
                                        // 解析嵌套对象
                                        value = (<SubNode>value).value.reduce((s, { key, value }) => {
                                            s[key] = value;
                                            return s;
                                        }, <any>{});
                                        break;
                                    }
                                }
                                s[key] = value;
                                return s;
                            }, <Record<string, ASTNode> & { type: 'text' | 'button' | 'path' }>{ type: (<LetNode>ast).key });
                            mode9Object[value] = <DefNode>ast;
                            mode9.push(res);
                        } else {
                            log('未知对象', ast);
                        }
                        break;
                    }
                }
                break;
            }
            default: {
                log(`未知对象${ast.type}`, ast);
                break;
            }
        }
    }
    return mode9;
}

interface IMode9 {
    /** 对象类型 */
    type: 'text' | 'button' | 'path';
    /** x 坐标，可以为百分比值【渐变】【默认0】 */
    x?: NumberNode | PercentNode;
    /** y 坐标，可以为百分比值【渐变】【默认0】 */
    y?: NumberNode | PercentNode;
    /** 层次权重，值高的对象在上层【默认0】 */
    zIndex?: NumberNode;
    /** 缩放【渐变】【默认1】 */
    scale?: NumberNode;
    /** 元素生命周期，有动画时默认为动画总时间，无动画时默认4s */
    duration?: NumberNode;
}

export interface IMode9Text extends IMode9 {
    type: 'text';
    /** 文本内容 */
    content: StringNode;
    /** 透明度，取值范围 [0, 1]，0 完全透明, 1 完全不透明【渐变】【默认1】 */
    alpha?: NumberNode;
    /** 文本颜色【渐变】【默认0xffffff】 */
    color?: ColorNode;
    /** 锚点，位置为长度的百分比【默认0】 */
    anchorX?: NumberNode;
    /** 锚点，位置为宽度的百分比【默认0】 */
    anchorY?: NumberNode;
    /** 文本字体大小，可以为百分比（百分比字体大小为当前屏幕宽度*字体百分比px）【默认25】 */
    fontSize?: NumberNode;
    /** 文本字体，默认值为平台默认字体。如果字体不存在时，使用平台默认字体 */
    fontFamily?: StringNode;
    /** 是否加粗【默认1】 */
    bold?: NumberNode;
    /** 是否字体阴影【默认1】 */
    textShadow?: NumberNode;
    /** 描边宽度【默认0】 */
    strokeWidth?: NumberNode;
    /** 描边颜色【默认0xffffff】 */
    strokeColor?: ColorNode;
    /** X轴旋转【渐变】【默认0】 */
    rotateX?: NumberNode;
    /** Y轴旋转【渐变】【默认0】 */
    rotateY?: NumberNode;
    /** Z轴旋转【渐变】【默认0】 */
    rotateZ?: NumberNode;
    /** 所属层 */
    parent?: StringNode;
}

export interface IMode9Button extends IMode9 {
    type: 'button';
    /** 按钮标签 */
    text: StringNode;
    /** 按钮字体大小，可以为百分比（百分比字体大小为当前屏幕宽度*字体百分比px）【默认25】 */
    fontSize?: NumberNode;
    /** 按钮文字颜色【默认0x000000】 */
    textColor?: ColorNode;
    /** 按钮字体透明度【默认1】 */
    textAlpha?: NumberNode;
    /** 按钮填充颜色【默认0xffffff】 */
    fillColor?: ColorNode;
    /** 按钮填充透明度【默认1】 */
    fillAlpha?: NumberNode;
    /** 按钮功能 */
    target: IAv | IBvid | IBangumi | ISeek;
}

interface IAv {
    /** 视频av号 */
    av: NumberNode;
    /** 视频分P号【默认1】 */
    page?: NumberNode;
    /** 视频开始播放点 */
    time?: TimeNode;
}

interface IBvid {
    /** 视频bvid号 */
    bvid: StringNode;
    /** 视频分P号【默认1】 */
    page?: NumberNode;
    /** 视频开始播放点 */
    time?: TimeNode;
}

interface IBangumi {
    /** 番剧id */
    seasonId: NumberNode;
    /** 番剧分集id */
    episodeId: NumberNode;
    /** 视频开始播放点 */
    time?: TimeNode;
}

interface ISeek {
    /** seek目标时间 */
    time: TimeNode;
}

export interface IMode9Path extends IMode9 {
    type: 'path';
    /** svg 路径 */
    d: StringNode;
    /** 描边宽度【默认0】 */
    borderWidth?: NumberNode;
    /** 描边颜色【0x000000】 */
    borderColor?: ColorNode;
    /** 描边透明度【默认1】 */
    borderAlpha?: NumberNode;
    /** 填充颜色【默认0xffffff】 */
    fillColor?: ColorNode;
    /** 填充透明度【默认1】 */
    fillAlpha?: NumberNode;
    /** svg 画布大小，默认完整显示 */
    viewBox?: StringNode;
    /** 宽度，可以为百分比值，需要设置 viewBox 才可以生效 */
    width?: NumberNode | PercentNode;
    /** 宽度，可以为百分比值，需要设置 viewBox 才可以生效 */
    height?: NumberNode | PercentNode;
}