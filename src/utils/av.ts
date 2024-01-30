/**
 * @file av号工具
 */

export namespace AV {
    const XOR_CODE = 23442827791579n;
    const MASK_CODE = 2251799813685247n;

    const MAX_AID = 1n << 51n;
    const MIN_AID = 1n;

    const BASE = 58n;
    const BYTES = ['B', 'V', 1, '', '', '', '', '', '', '', '', ''];
    const BV_LEN = BYTES.length;

    const ALPHABET = [
        'F', 'c', 'w', 'A', 'P', 'N', 'K', 'T', 'M', 'u', 'g', '3', 'G', 'V', '5', 'L',
        'j', '7', 'E', 'J', 'n', 'H', 'p', 'W', 's', 'x', '4', 't', 'b', '8', 'h', 'a',
        'Y', 'e', 'v', 'i', 'q', 'B', 'z', '6', 'r', 'k', 'C', 'y', '1', '2', 'm', 'U',
        'S', 'D', 'Q', 'X', '9', 'R', 'd', 'o', 'Z', 'f'
    ];
    const DIGIT_MAP = [0, 1, 2, 9, 7, 5, 6, 4, 8, 3, 10, 11];
    const REG_EXP = new RegExp(`^[bB][vV]1[${ALPHABET.join('')}]{9}$`, 'g');
    const REG_EXP_SHORT = new RegExp(`^1[${ALPHABET.join('')}]{9}$`, 'g');
    const REG_EXP_STR = new RegExp(`[bB][vV]1[${ALPHABET.join('')}]{9}`, 'g');

    /**
     * aid => BV
     * 
     * @example
     * toBV(170001) // BV17x411w7KC
     */
    export function toBV(avid: bigint | number) {
        typeof avid === "bigint" || (avid = BigInt(avid));

        if (avid < MIN_AID) {
            throw new RangeError(`Av ${avid} is smaller than ${MIN_AID}`);
        }
        if (avid >= MAX_AID) {
            throw new RangeError(`Av ${avid} is bigger than ${MAX_AID}`);
        }

        const bytes = Array.from(BYTES);

        let bv_idx = BV_LEN - 1;
        let tmp = (MAX_AID | avid) ^ XOR_CODE;
        while (tmp !== 0n) {
            let table_idx = tmp % BASE;
            bytes[DIGIT_MAP[Number(bv_idx)]] = ALPHABET[Number(table_idx)];
            tmp /= BASE;
            bv_idx -= 1;
        }

        return bytes.join('');
    }

    /**
     * BV => aid
     * 
     * @example
     * fromBV('BV17x411w7KC') // 170001
     * fromBV('17x411w7KC') // 170001
     */
    export function fromBV(bvid: string) {
        if (REG_EXP_SHORT.test(bvid)) {
            bvid = 'BV' + bvid;
        }
        // if (!REG_EXP.test(bvid)) {
        //     throw new TypeError(`${bvid} is illegal`);
        // }

        let r = 0n;
        for (let i = 3; i < BV_LEN; i++) {
            r = r * BASE + BigInt(ALPHABET.indexOf(bvid[DIGIT_MAP[i]]));
        }

        return `${(r & MASK_CODE) ^ XOR_CODE}`;
    }

    /**
     * 替换文本中所有BV号
     * 
     * @param str 含有BV号的文本
     * @returns 替换为av号的文本
     * @example
     * fromStr('***BV17x411w7KC***') // ***av170001***
     */
    export function fromStr(str: string) {
        return str.replace(REG_EXP_STR, (s: string) => "av" + fromBV(s));
    }
}