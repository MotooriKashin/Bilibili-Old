function toUint8Array(input: string | ArrayBuffer | Uint8Array) {
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    return new TextEncoder().encode(input);
}


// MD5 算法定义的 64 个常数（每步使用一个）
const K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
];

// 64 步对应的循环左移位数
const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

function computeMD5(message: Uint8Array) {
    // 初始寄存器值（A、B、C、D）
    let [a, b, c, d] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    const bitLength = BigInt(message.length * 8);

    // 填充消息（标准 MD5 填充方式）
    const padLength = (56 - (message.length % 64) + 64) % 64;
    const padded = new Uint8Array(message.length + padLength + 8);
    padded.set(message);
    padded.set([0x80], message.length); // 填充起始位
    new DataView(padded.buffer).setBigUint64(padded.length - 8, bitLength, true); // 小端序存储长度

    // 处理每个 512 位块
    for (let i = 0; i < padded.length; i += 64) {
        const block = padded.subarray(i, i + 64);
        const M = new Uint32Array(block.buffer, block.byteOffset, 16); // 16 个 32 位字
        let [AA, BB, CC, DD] = [a, b, c, d]; // 备份当前寄存器值

        // 64 步运算（4 轮 × 16 步）
        for (let step = 0; step < 64; step++) {
            let F: number, g: number;

            // 第一轮：使用 F 函数，g = step
            if (step < 16) {
                F = (BB & CC) | (~BB & DD);
                g = step;
            }
            // 第二轮：使用 G 函数，g = (5×step + 1) mod 16
            else if (step < 32) {
                F = (BB & DD) | (CC & ~DD);
                g = (5 * step + 1) % 16;
            }
            // 第三轮：使用 H 函数，g = (3×step + 5) mod 16
            else if (step < 48) {
                F = BB ^ CC ^ DD;
                g = (3 * step + 5) % 16;
            }
            // 第四轮：使用 I 函数，g = (7×step) mod 16
            else {
                F = CC ^ (BB | ~DD);
                g = (7 * step) % 16;
            }

            // 核心运算：temp = DD，DD = CC，CC = BB，BB = BB + 循环左移(AA + F + K[step] + M[g], S[step])
            const temp = DD;
            DD = CC;
            CC = BB;
            BB = BB + ((AA + F + K[step]! + M[g]!) << S[step]! | (AA + F + K[step]! + M[g]!) >>> (32 - S[step]!));
            AA = temp;
        }

        // 累加当前块的结果到寄存器
        a += AA;
        b += BB;
        c += CC;
        d += DD;
    }

    // 将 4 个 32 位寄存器转换为 16 字节小端序数组
    const result = new Uint8Array(16);
    const view = new DataView(result.buffer);
    view.setUint32(0, a, true);
    view.setUint32(4, b, true);
    view.setUint32(8, c, true);
    view.setUint32(12, d, true);
    return result;
}

/** 计算 MD5 十六进制哈希 */
export function md5(input: string | ArrayBuffer | Uint8Array) {
    const bytes = toUint8Array(input);
    const hashBytes = computeMD5(bytes);
    return hashBytes.toHex();
}