import { isArray } from "../lib/typeof";

/** The JavaScript world for a script to execute within. */
type ExecutionWorld = "ISOLATED" | "MAIN";
/** The soonest that the JavaScript or CSS will be injected into the tab. */
type RunAt = "document_start" | "document_end" | "document_idle";
export type ContentScriptFilter = {
    /** If specified, `getRegisteredContentScripts` will only return scripts with an id specified in this list. */
    ids?: string[];
};
declare namespace chrome.scripting {
    /**
     * Registers one or more content scripts for this extension.
     * @param scripts Contains a list of scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.
     * @param callback The callback parameter looks like: `() => void`.
     * @returns This only returns a Promise when the callback parameter is not specified, and with MV3+. The type inside the Promise is the same as the 1st argument to callback.
     */
    export function registerContentScripts(scripts: RegisteredContentScript[], callback?: () => void): Promise<void>;
    /**
     * Unregisters content scripts for this extension.
     * @param filter If specified, only unregisters dynamic content scripts which match the filter. Otherwise, all of the extension's dynamic content scripts are unregistered.
     * @param callback The callback parameter looks like: `() => void`.
     * @returns This only returns a Promise when the callback parameter is not specified, and with MV3+. The type inside the Promise is the same as the 1st argument to callback.
     */
    export function unregisterContentScripts(filter?: ContentScriptFilter, callback?: () => void): Promise<void>;
}
export interface RegisteredContentScript {
    /** If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched. */
    allFrames?: boolean;
    /** The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array, before any DOM is constructed or displayed for the page. */
    css?: string[];
    /** Excludes pages that this content script would otherwise be injected into. See `Match Patterns` for more details on the syntax of these strings. */
    excludeMatches?: string[];
    /** The id of the content script, specified in the API call. Must not start with a '_' as it's reserved as a prefix for generated script IDs. */
    id: string;
    /** The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array. */
    js?: string[];
    /** Specifies which pages this content script will be injected into. See `Match Patterns` for more details on the syntax of these strings. Must be specified for `registerContentScripts`. */
    matches?: string[];
    /** Specifies if this content script will persist into future sessions. The default is true. */
    persistAcrossSessions?: boolean;
    /** Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`. */
    runAt?: RunAt;
    /** The JavaScript "world" to run the script in. Defaults to `ISOLATED`. */
    world?: ExecutionWorld;
}
/**
 * 【后台脚本】注册内容脚本
 * @param js 内容脚本在扩展中的相对路径
 * @param matches 匹配的网址
 * @param excludeMatches 排除的网址
 */
export function registerContentScripts(js: string | string[], matches: string | string[], id: string, excludeMatches?: string | string[]): RegisteredContentScript {
    js = isArray(js) ? js : [js];
    matches = isArray(matches) ? matches : [matches];
    if (excludeMatches) {
        excludeMatches = isArray(excludeMatches) ? excludeMatches : [excludeMatches]
    } else {
        excludeMatches = undefined;
    }
    return {
        allFrames: true,
        js,
        id,
        matches,
        runAt: "document_start",
        world: "MAIN",
        excludeMatches
    }
}
