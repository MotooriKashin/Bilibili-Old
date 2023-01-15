import { DanmakuCmd, DanmakuElem } from "../io/grpc/api-dm-web";

export class DanmakuBase {
    /** 从小到大排序弹幕 */
    static sortDmById(dms: DanmakuElem[]) {
        dms.sort((a, b) => this.bigInt(a.idStr, b.idStr) ? 1 : -1);
    }
    /** 比较两个弹幕ID先后 */
    static bigInt(num1: string, num2: string) {
        String(num1).replace(/\d+/, d => num1 = d.replace(/^0+/, ""));
        String(num2).replace(/\d+/, d => num2 = d.replace(/^0+/, ""));
        // 数位不同，前者大为真，否则为假
        if (num1.length > num2.length) return true;
        else if (num1.length < num2.length) return false;
        else {
            // 数位相同，逐位比较
            for (let i = 0; i < num1.length; i++) {
                // 任意一位前者大为真
                if (num1[i] > num2[i]) return true;
                // 任意一位前者小为假
                if (num1[i] < num2[i]) return false;
                // 仅当位相等时继续比较下一位
            }
            // 包括相等情况返回假
            return false;
        }
    }
    /** 重构为旧版弹幕类型 */
    static parseCmd(dms: DanmakuElem[]) {
        return dms.map(d => {
            const dm: DanmakuCmd = {
                class: d.pool || 0,
                color: d.color || 0,
                date: d.ctime || 0,
                dmid: d.idStr || '',
                mode: +d.mode || 1,
                pool: d.pool || 0,
                size: d.fontsize || 25,
                stime: d.progress / 1000 || 0,
                text: (d.content && d.mode != 8 && d.mode != 9) ? d.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : d.content,
                uhash: d.midHash || '',
                uid: d.midHash || '',
                weight: d.weight,
                attr: d.attr,
            };
            d.action?.startsWith("picture:") && (dm.html = `<img src="${d.action.replace('http:', '')}" style="width:auto;height:56.25px;">`);
            return dm;
        })
    }
    /** 解析解码xml弹幕 */
    static decodeXml(xml: string | Document) {
        if (typeof xml === 'string') {
            // B站输出的xml可能包含不标准的字符,会引起浏览器自动解析失败
            // remove-invalid-xml-characters.js
            // @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
            // @license MIT
            // @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
            xml = xml.replace(/((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g, '');
            xml = new DOMParser().parseFromString(xml, 'application/xml');
        }
        const items = xml.querySelectorAll('d');
        const dms: DanmakuElem[] = [];
        items.forEach(d => {
            const json = d.getAttribute('p')!.split(',');
            const text = d.textContent || (<HTMLAnchorElement>d).text;
            if (text) {
                const dm: DanmakuElem = {
                    pool: Number(json[5]),
                    color: Number(json[3]),
                    ctime: Number(json[4]),
                    id: Number(json[7]),
                    idStr: String(json[7]),
                    mode: Number(json[1]),
                    fontsize: Number(json[2]),
                    progress: Number(json[0]) * 1000,
                    content: String(text),
                    midHash: json[6]
                }
                dms.push(dm);
            }
        });
        return dms;
    }
    /** 编码xml弹幕 */
    static encodeXml(dms: DanmakuCmd[], cid: number) {
        return dms.reduce((s, d) => {
            // 代码弹幕及BAS弹幕无须处理换行符
            const text = (d.mode === 8 || d.mode === 9) ? d.text : d.text.replace(/[<&]/g, (a: string) => { return <string>{ '<': '&lt;', '&': '&amp;' }[a] }).replace(/(\n|\r\n)/g, "/n");
            s += `<d p="${d.stime},${d.mode},${d.size},${d.color},${d.date},${d.class},${d.uid},${d.dmid}">${text}</d>\n`;
            return s;
        }, `<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.api.bilibili.com</chatserver><chatid>${cid}</chatid><mission>0</mission><maxlimit>${dms.length}</maxlimit><state>0</state><real_name>0</real_name><source>k-v</source>\n`) + '</i>';
    }
}