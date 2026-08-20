/**
 * 内部系统专用的 零依赖 TOTP 工具库 (使用原生 Web Crypto API & Base64/Base64URL)
 */

export interface TOTPOptions {
    /** 验证码位数，默认 6 */
    digits?: number;
    /** 时间步长（秒），默认 30 */
    step?: number;
    /** 哈希算法，默认 SHA-1 */
    algorithm?: 'SHA-1' | 'SHA-256' | 'SHA-512';
    /** 当前毫秒时间戳，默认 Date.now() */
    timestamp?: number;
}

export interface VerifyTOTPOptions extends TOTPOptions {
    /** 时间容错窗口（步数），默认 1 */
    window?: number;
}

/**
 * 1. 生成安全的随机密钥 (Base64/Base64URL 格式)
 * @param length 密钥字节长度，默认 20 字节 (160 比特)
 * @param urlSafe 是否生成 URL 安全的 Base64 格式 (默认 true)
 */
export function generateSecret(length = 20, urlSafe = true) {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return bytes.toBase64({ alphabet: urlSafe ? 'base64url' : 'base64' });
}

/**
 * 将时间戳转换为 8 字节 Big-Endian ArrayBuffer
 */
function getTimeBuffer(timestamp: number, step: number) {
    const seconds = Math.floor(timestamp / 1000);
    const counter = Math.floor(seconds / step);
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);

    const high = Math.floor(counter / 0x100000000);
    const low = counter & 0xffffffff;
    view.setUint32(0, high, false);
    view.setUint32(4, low, false);
    return buffer;
}

/**
 * 2. 生成 TOTP 动态验证码
 * @param secret 密钥，支持 Uint8Array 字节数组或 Base64/Base64URL 字符串
 * @param param1 TOTP 配置项
 */
export async function generateTOTP(
    secret: string | Uint8Array<ArrayBuffer>,
    { digits = 6, step = 30, algorithm = 'SHA-1', timestamp = Date.now() }: TOTPOptions = {}
) {

    // 提取二进制 Byte Buffer
    let keyBuffer: Uint8Array<ArrayBuffer>;
    if (secret instanceof Uint8Array) {
        keyBuffer = secret;
    } else {
        // 自动兼容判断 base64 还是 base64url
        const isUrlSafe = secret.includes('-') || secret.includes('_');
        keyBuffer = Uint8Array.fromBase64(secret, {
            alphabet: isUrlSafe ? 'base64url' : 'base64',
        });
    }

    // 使用 Web Crypto 导入 HMAC Key
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: { name: algorithm } },
        false,
        ['sign']
    );

    const timeBuffer = getTimeBuffer(timestamp, step);
    const hmac = await crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
    const hmacArray = new Uint8Array(hmac);

    // 动态截断 (Dynamic Truncation)
    const offset = hmacArray[hmacArray.length - 1]! & 0x0f;
    const code =
        ((hmacArray[offset]! & 0x7f) << 24) |
        ((hmacArray[offset + 1]! & 0xff) << 16) |
        ((hmacArray[offset + 2]! & 0xff) << 8) |
        (hmacArray[offset + 3]! & 0xff);

    const otp = code % Math.pow(10, digits);
    return otp.toString().padStart(digits, '0');
}

/**
 * 3. 校验用户输入的 TOTP 验证码
 * @param token 待校验的数字验证码
 * @param secret 密钥 (Base64/Base64URL 或 Uint8Array)
 * @param options 校验配置项（含容错窗口）
 */
export async function verifyTOTP(
    token: string,
    secret: string | Uint8Array<ArrayBuffer>,
    options: VerifyTOTPOptions = {}
) {
    const { window = 1, timestamp = Date.now(), ...rest } = options;
    const stepMs = (options.step || 30) * 1000;

    // 遍历前后 +/- window 步长，对冲网络延迟或服务器与客户端的时钟微小偏差
    for (let i = -window; i <= window; i++) {
        const checkTime = timestamp + i * stepMs;
        const generated = await generateTOTP(secret, { ...rest, timestamp: checkTime });
        if (generated === token) {
            return true;
        }
    }
    return false;
}