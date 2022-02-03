/**
 * 脚本主体，负责提供脚本与模块间沟通的桥梁
 */
(function () {
    GM.xmlHttpRequest = GM_xmlhttpRequest;
    GM.getValue = GM_getValue;
    GM.setValue = GM_setValue;
    GM.deleteValue = GM_deleteValue;
    GM.listValues = GM_listValues;
    GM.getResourceText = GM_getResourceText;
    GM.getResourceURL = GM_getResourceText;
    const modules: Record<string, any> = {};
    /* 模块占位 */
    class API {
        GM = GM;
        Name: string = GM.info.script.name;
        Virsion: string = GM.info.script.version;
        Handler: string = [GM.info.scriptHandler, GM.info.version].join(" ");
        document = document;
    }
    new Function("API", "GM", "MODULES", Reflect.get(modules, "modules.js"))(new API(), GM, modules);
})();
declare namespace GM {
    interface cookieDetails {
        /**
         * 域
         */
        domain: string,
        /**
         * 截止日期时间戳（10位）
         */
        expirationDate: number;
        /**
         * 客户端专用，不会发送给服务端
         */
        hostOnly: boolean;
        /**
         * 服务端专用，客户端js无法获取/修改
         */
        httpOnly: boolean;
        /**
         * 名称
         */
        name: string;
        /**
         * 子页面路径
         */
        path: string;
        /**
         * 同源策略
         */
        sameSite: string;
        /**
         * 是否允许通过非安全链接发送给服务器
         */
        secure: boolean;
        /**
         * 会话型cookie，临时有效，随页面一起销毁
         */
        session: boolean;
        /**
         * 值
         */
        value: string
    }
    let xmlHttpRequest: typeof GM_xmlhttpRequest;
    let getValue: typeof GM_getValue;
    let setValue: typeof GM_setValue;
    let deleteValue: typeof GM_deleteValue;
    let listValues: typeof GM_listValues;
    let getResourceText: typeof GM_getResourceText;
    let getResourceURL: typeof GM_getResourceURL;
    const info: {
        downloadMode: string;
        isFirstPartyIsolation: boolean;
        isIncognito: boolean;
        scriptHandler: string;
        scriptMetaStr: string;
        scriptSource: string;
        scriptUpdateURL: string;
        scriptWillUpdate: string;
        version: string;
        script: {
            antifeatures: {};
            author: string;
            blockers: [];
            copyright: string;
            description: string;
            description_i18n: {};
            evilness: number;
            excludes: [];
            grant: [];
            header: string;
            homepage: string;
            icon: string;
            icon64: string;
            includes: [];
            lastModified: number;
            matches: [];
            name: string;
            name_i18n: [];
            namespace: string;
            options: {
                check_for_updates: boolean;
                comment: string;
                compat_foreach: boolean;
                compat_metadata: boolean;
                compat_prototypes: boolean;
                compat_wrappedjsobject: boolean;
                compatopts_for_requires: boolean;
                noframes: boolean;
                override: {
                    merge_connects: boolean;
                    merge_excludes: boolean;
                    merge_includes: boolean;
                    merge_matches: boolean;
                    orig_connects: [];
                    orig_excludes: [];
                    orig_includes: [];
                    orig_matches: [];
                    orig_noframes: boolean;
                    orig_run_at: string;
                    use_blockers: [];
                    use_connects: [];
                    use_excludes: [];
                    use_includes: [];
                    use_matches: [];
                }
                run_at: string;
            }
            position: number;
            requires: [];
            resources: [{ [name: string]: string }];
            "run-at": string;
            supportURL: string;
            sync: { imported: string };
            unwrap: boolean;
            updateURL: string;
            uuid: string;
            version: string;
            webRequest: string;
        }
    }
    const cookie: {
        /**
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**  
         * 新版Tampermonkey Beta v4.14.615中已不可用，请直接调用用对应方法。
         */
        <T extends keyof typeof cookie>(method: T, ...args: Parameters<(typeof cookie)[T]>): ReturnType<(typeof cookie)[T]>;
        /**
         * 以数组形式返回所有cookie  
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**
         * @param details 筛选条件，无条件请使用空对象{}会返回所有cookie
         * @returns 符合条件的cookie对象数组
         */
        list(details: Partial<Record<"domain" | "name" | "path", string>>): Promise<cookieDetails[]>;
        /**
         * 修改/添加cookie  
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**
         * @param args cookie详细信息
         */
        set(details: Partial<cookieDetails>): Promise<void>;
        /**
         * 删除cookie  
         * **警告：此实验性特性仅在Tampermonkey Beta中可用，否则将抛出语法错误！**
         * @param args 删除条件
         */
        delete(details: Record<"name", string>): Promise<void>;
    }
}
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
declare function GM_getResourceText(name: string): string;
declare function GM_getResourceURL(name: string): string;
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
declare function GM_setValue<T>(name: string, value: T): void;
declare function GM_deleteValue(name: string): void;
declare function GM_listValues(): string[];