GM.xmlHttpRequest = GM_xmlhttpRequest;
GM.getResourceText = GM_getResourceText;
GM.getResourceURL = GM_getResourceURL;
GM.getValue = GM_getValue;
GM.setValue = GM_setValue;
GM.deleteValue = GM_deleteValue;
/**
 * Tampermonkey 提供的高级API的封装
 */
declare namespace GM {
    let xmlHttpRequest: typeof GM_xmlhttpRequest;
    let getResourceText: typeof GM_getResourceText;
    let getResourceURL: typeof GM_getResourceURL;
    let getValue: typeof GM_getValue;
    let setValue: typeof GM_setValue;
    let deleteValue: typeof GM_deleteValue;
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
}
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_xmlhttpRequest(details: GMxhrDetails): { abort: () => void };
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getResourceText(name: string): string;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getResourceURL(name: string): string;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_getValue<T>(name: string, defaultValue?: T): T;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_setValue<T>(name: string, value: T): void;
/**
 * **`GM_*`形式仅可在`index.js`中使用，模块中请使用`GM.*`形式的封装版本**
 */
declare function GM_deleteValue(name: string): void;