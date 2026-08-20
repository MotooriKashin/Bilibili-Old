const response = await fetch('https://api.bilibili.com/x/web-interface/nav', { credentials: 'include' });
const { data }: { code: number; message: string; data: INav; } = await response.json();
/** 获取用户本人数据 */
export { data };

interface INav {
    isLogin: boolean;
    face: string;
    mid: number;
    uname: string;
    vip_nickname_color: string;
    vip_label: { path: string; text: string };
    money: number;
    wallet: { bcoin_balance: number };
    email_verified: number;
    mobile_verified: number;
    level_info: {
        current_level: number;
        current_exp: number;
        next_exp: number;
    };
}