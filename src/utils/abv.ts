/**
 * BV↔av 算法
 * @see https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/bvid_desc.md
 */


const XOR_CODE = 23442827791579n;
const MASK_CODE = 2251799813685247n;
const MAX_AID = 1n << 51n;
const BASE = 58n;

const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

/** av->bv */
export function av2bv(aid: number) {
    const bytes: TArrayOfBvid = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    let bvIndex = bytes.length - 1;
    let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
    while (tmp > 0) {
        bytes[bvIndex] = data[Number(tmp % BigInt(BASE))]!;
        tmp = tmp / BASE;
        bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join('') as `BV1${string}`;
}

/** bv->av */
export function bv2av(bvid: string) {
    const bvidArr = <TArrayOfBvid>Array.from<string>(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
    return (tmp & MASK_CODE) ^ XOR_CODE;
}

/**
 * 替换文本内所有 bv 为 av
 * 
 * @param str 原始文本
 * @returns 替换后的文本
 */
export function bv2avAll(str: string) {
    return str.replace(/[BbVv]{2}1[FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf]{9}/g, bv => `av${bv2av(<any>bv)}`);
}

type TArrayOfBvid = [string, string, string, string, string, string, string, string, string, string, string, string];