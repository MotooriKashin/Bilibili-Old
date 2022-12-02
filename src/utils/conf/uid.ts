import { getCookies } from "../cookie";

/** 用户mid（判断用户是否登录） */
export const uid = Number(getCookies().DedeUserID);