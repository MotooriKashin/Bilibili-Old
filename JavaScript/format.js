"use strict";
class Format {
    /**
     * 格式化时间
     * @param time 时间戳
     * @param type 是否包含年月日
     * @returns 时:分:秒 | 年-月-日 时:分:秒
     */
    static timeFormat(time = new Date().getTime(), type) {
        let date = new Date(time), Y = date.getFullYear() + '-', M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-', D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ', h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':', m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':', s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return type ? Y + M + D + h + m + s : h + m + s;
    }
    /**
     * 格式化字节
     * @param size 字节/B
     * @returns n B | K | M | G
     */
    static sizeFormat(size = 0) {
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = Number((size / dex).toFixed(2));
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
        }
        return size ? size + unit[i] : "N/A";
    }
    /**
     * 格式化进位
     * @param num 实数
     * @returns n 万 | 亿
     */
    static unitFormat(num = 0) {
        num = 1 * num || 0;
        let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
        while (dex > 1) {
            if (num >= dex) {
                num = Number((num / dex).toFixed(1));
                break;
            }
            dex = dex / 10000;
            i--;
        }
        return num + unit[i];
    }
    /**
     * 冒泡排序
     * @param arr 待排序数组
     * @returns 排序结果
     */
    static bubbleSort(arr) {
        let temp;
        for (let i = 0; i < arr.length - 1; i++) {
            let bool = true;
            for (let j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    bool = false;
                }
            }
            if (bool)
                break;
        }
        return arr;
    }
    /**
     * 随机截取制定大小子数组
     * @param arr 母数组
     * @param num 子数组大小
     * @returns 子数组
     */
    static randomArray(arr, num) {
        let out = [];
        num = num || 1;
        num = num < arr.length ? num : arr.length;
        while (out.length < num) {
            var temp = (Math.random() * arr.length) >> 0;
            out.push(arr.splice(temp, 1)[0]);
        }
        return out;
    }
    /**
     * search参数对象拼合回URL
     * @param url URL主体，可含search参数
     * @param obj search参数对象
     * @returns 拼合的URL
     */
    static objUrl(url, obj) {
        let data = this.urlObj(url);
        obj = typeof obj === "object" ? obj : {};
        data = Object.assign(data, obj);
        let arr = [], i = 0;
        for (let key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                arr[i] = key + "=" + data[key];
                i++;
            }
        }
        if (url)
            url = url + "?" + arr.join("&");
        else
            url = arr.join("&");
        if (url.charAt(url.length - 1) == "?")
            url = url.split("?")[0];
        return url;
    }
    /**
     * 提取URL search参数对象
     * @param url 原URL
     * @returns search参数对象
     */
    static urlObj(url = "") {
        let arr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
        return arr.reduce((o, d) => {
            if (d.includes("#"))
                d = d.split("#")[0];
            if (d)
                o[d.split('=')[0]] = d.split('=')[1] || "";
            return o;
        }, {});
    }
}
API.timeFormat = (time, type) => Format.timeFormat(time, type);
API.sizeFormat = (size) => Format.sizeFormat(size);
API.unitFormat = (num) => Format.unitFormat(num);
API.bubbleSort = (arr) => Format.bubbleSort(arr);
API.randomArray = (arr, num) => Format.randomArray(arr, num);
API.objUrl = (url, obj) => Format.objUrl(url, obj);
API.urlObj = (url) => Format.urlObj(url);
