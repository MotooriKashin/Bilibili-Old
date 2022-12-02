/** 格式化字符串为对应数据类型 */
export function toObject(input: string): any {
    switch (input) {
        case "undefined":
            input = <any>undefined;
            break;
        case "null":
            input = <any>null;
            break;
        case "NaN":
            input = <any>NaN;
            break;
        default:
            if (!input) break;
            try {
                const temp = JSON.parse(input);
                if (typeof temp !== "number" || input === String(temp)) {
                    input = <any>temp;
                }
            } catch {
                try {
                    const temp = Number(input);
                    if (String(temp) !== 'NaN' && !input.startsWith('0')) {
                        input = <any>temp;
                    }
                } catch { }
                try {
                    if (/^\d+n$/.test(input)) input = <any>BigInt(input.slice(0, -1))
                } catch { }
            }
            break;
    }
    return input;
}
/**
 * 任意数据转转字符串
 * @param input 原始数据
 * @param space 格式话填空字符，默认为制表符
 */
export function toString(input: unknown, space = '\n') {
    let result;
    try {
        result = (<string>input).toString();
    } catch {
        result = String(input);
    }
    if (result.startsWith('[object') && result.endsWith(']')) {
        try {
            const str = JSON.stringify(input, undefined, space);
            str === '{}' || (result = str)
        } catch { }
    }
    return result;
}