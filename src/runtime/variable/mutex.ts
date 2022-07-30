/** 互斥标记：生成一个固定长度的随机字符串，用于区分某些可能挤占互斥资源的标记符 */
export const mutex = Math.random().toString(36).substring(2);