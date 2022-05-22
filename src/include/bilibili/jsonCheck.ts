namespace API {
    /**
     * 检查B站json接口返回值并格式化为json  
     * 对于code异常将直接抛出错误！
     * @param data B站接口的response
     * @returns 格式化后的json
     */
    export function jsonCheck(data: string | Record<string, any>) {
        let result: Record<string, any> = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    }
}