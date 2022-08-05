import { Base64 } from "../lib/base_64";
import { objUrl } from "../format/url";
import { setting } from "../setting";
import { xhr } from "../xhr";

export interface Aria2Data {
    /** URL组，所有链接必须指向同一文件，或者只提供一条链接 */
    urls: string[];
    /** 文件名（含拓展名） */
    out?: string;
    /** user-agent */
    userAgent?: string;
    /** referer */
    referer?: string;
    /** 文件保存目录 */
    directory?: string;
    /** 链接数，一般指线程数 */
    split?: number;
    /** 附加的HTTP请求头组 */
    header?: { [name: string]: string };
    /** 令牌 */
    token?: string;
    /** 任务唯一GID，用于唯一标志任务。**请不要使用url中禁止的字符，可使用encodeURIComponent等标准方法或者本项目提供的md5、Base64、crc32等方法预处理一下！** */
    id?: string;
}
/** aria任务配置信息，类型信息有待进一步核实 */
export interface Aria2Option {
    "all-proxy"?: string;
    "all-proxy-passwd"?: string;
    "all-proxy-user"?: string;
    "allow-overwrite"?: string;
    "allow-piece-length-change"?: string;
    "always-resume"?: string;
    "async-dns"?: string;
    "auto-file-renaming"?: string;
    "bt-enable-hook-after-hash-check"?: string;
    "bt-enable-lpd"?: string;
    "bt-exclude-tracker"?: string;
    "bt-external-ip"?: string;
    "bt-force-encryption"?: string;
    "bt-hash-check-seed"?: string;
    "bt-load-saved-metadata"?: string;
    "bt-max-peers"?: string;
    "bt-metadata-only"?: string;
    "bt-min-crypto-level"?: string;
    "bt-prioritize-piece"?: string;
    "bt-remove-unselected-file"?: string;
    "bt-request-peer-speed-limit"?: string;
    "bt-require-crypto"?: string;
    "bt-save-metadata"?: string;
    "bt-seed-unverified"?: string;
    "bt-stop-timeout"?: string;
    "bt-tracker"?: string;
    "bt-tracker-connect-timeout"?: string;
    "bt-tracker-interval"?: string;
    "bt-tracker-timeout"?: string;
    "check-integrity"?: string;
    "checksum"?: string;
    "conditional-get"?: string;
    "connect-timeout"?: string;
    "content-disposition-default-utf8"?: string;
    "continue"?: string;
    "dir"?: string;
    "dry-run"?: string;
    "enable-http-keep-alive"?: string;
    "enable-http-pipelining"?: string;
    "enable-mmap"?: string;
    "enable-peer-exchange"?: string;
    "file-allocation"?: string;
    "follow-metalink"?: string;
    "follow-torrent"?: string;
    "force-save"?: string;
    "ftp-passwd"?: string;
    "ftp-pasv"?: string;
    "ftp-proxy"?: string;
    "ftp-proxy-passwd"?: string;
    "ftp-proxy-user"?: string;
    "ftp-reuse-connection"?: string;
    "ftp-type"?: string;
    "ftp-user"?: string;
    "gid"?: string;
    "hash-check-only"?: string;
    "header"?: { [name: string]: string };
    "http-accept-gzip"?: string;
    "http-auth-challenge"?: string;
    "http-no-cache"?: string;
    "http-passwd"?: string;
    "http-proxy"?: string;
    "http-proxy-passwd"?: string;
    "http-proxy-user"?: string;
    "http-user"?: string;
    "https-proxy"?: string;
    "https-proxy-passwd"?: string;
    "https-proxy-user"?: string;
    "index-out"?: string;
    "lowest-speed-limit"?: string;
    "max-connection-per-server"?: string;
    "max-download-limit"?: string;
    "max-file-not-found"?: string;
    "max-mmap-limit"?: string;
    "max-resume-failure-tries"?: string;
    "max-tries"?: string;
    "max-upload-limit"?: string;
    "metalink-base-uri"?: string;
    "metalink-enable-unique-protocol"?: string;
    "metalink-language"?: string;
    "metalink-location"?: string;
    "metalink-os"?: string;
    "metalink-preferred-protocol"?: string;
    "metalink-version"?: string;
    "min-split-size"?: string;
    "no-file-allocation-limit"?: string;
    "no-netrc"?: string;
    "no-proxy"?: string;
    "out"?: string;
    "parameterized-uri"?: string;
    "pause"?: string;
    "pause-metadata"?: string;
    "piece-length"?: string;
    "proxy-method"?: string;
    "realtime-chunk-checksum"?: string;
    "referer"?: string;
    "remote-time"?: string;
    "remove-control-file"?: string;
    "retry-wait"?: string;
    "reuse-uri"?: string;
    "rpc-save-upload-metadata"?: string;
    "seed-ratio"?: string;
    "seed-time"?: string;
    "select-file"?: string;
    "split"?: number;
    "ssh-host-key-md"?: string;
    "stream-piece-selector"?: string;
    "timeout"?: string;
    "uri-selector"?: string;
    "use-head"?: string;
    "user-agent"?: string;
}
/** 下载文件列表 */
export interface Aria2Files {
    /** 文件索引，从1开始 */
    index: number;
    /** 文件路径 */
    path: string;
    /** 文件大小，单位：字节 */
    length: number;
    /** 已下载文件大小，单位：字节 */
    completedLength: number;
    /** 标志此文件被--selecte-file选中 */
    selected: boolean;
    /** 此文件的url列表 */
    uris: string[];
}
/** aria任务状态信息 */
export interface Aria2Status {
    /** 任务唯一id */
    gid: string;
    /** 下载状态 */
    status: "active" | "waiting" | "paused" | "error" | "complete" | "removed";
    /** 任务总大小，单位：字节 */
    totalLength: number;
    /** 已下载大小，单位：字节 */
    completedLength: number;
    /** 上传大小，单位：字节 */
    uploadLength: number;
    /** 下载进度的十六进制数据1表示。最高位对应索引0，已设置位表示已下载的片段，未设置位表示未下载/丢失片段，溢出的位全为0，未开始下载时不会返回奔项 */
    bitfield?: string;
    /** 下载速度，单位：字节/秒 */
    downloadSpeed: number;
    /** 上传速度，单位：字节/秒 */
    uploadSpeed: number;
    /** 哈希信息，仅限BitTorrent */
    infoHash?: string;
    /** 已连接的主机数，仅限BitTorrent */
    numSeeders?: number;
    /** 是否做种中，仅限BitTorrent */
    seeder?: boolean;
    /** 片段长度，单位：字节 */
    pieceLength: number;
    /** 片段数 */
    numPieces: number;
    /** 已建立链接数 */
    connections: number;
    /** 最后一个错误码，只使用已完成/失败的下载 */
    errorCode?: string;
    /** 最后一个错误码，只使用已完成/失败的下载 */
    errorMessage?: string;
    /** 下载结果声成的gid表，用于跟踪自动生成的下载 */
    followedBy?: string[];
    /** followedBy的另一头，只是自动下载的源gid */
    following?: string;
    /** 父下载的gid，该下载附带了很多下载时 */
    belongsTo?: string;
    /** 保存目录 */
    dir: string;
    /** 文件列表 */
    files: Aria2Files;
    /** .torrent信息 */
    bittorrent: {
        /** 公告 URI 列表的列表 */
        announceList: string[];
        /** torrent评论 */
        comment: string[];
        /** torrent生成时间戳 */
        creationDate: number;
        /** torrent类别 */
        mode: "single" | "multi";
        /** torrent信息字典 */
        info: {
            /** torrent信息字典名 */
            name: string;
        }
    };
    /** 已哈希检验大小，只在启用了哈西校验时出现 */
    verifiedLength?: number;
    /** 等待哈希校验，只在启用了哈西校验时出现 */
    verifyIntegrityPending?: boolean;
}
/**
 * aria2 RPC 方法参数  
 * 按数组顺序传递，带问号的位可选参数  
 * 返回值在Aria2MethodResponse并一一对应
 */
export interface Aria2Method {
    /**
     * 添加下载链接
     * @param secret RPC令牌token
     * @param urls url数组
     * @param options 额外参数
     * @param position 下载次序，忽略默认添加到最末尾
     * @returns 任务GID
     */
    "aria2.addUri"(secret: string, urls: string, options?: Aria2Option, position?: number): string;
    /**
     * 添加torrent，磁力链接请使用addUri方法
     * @param secret RPC令牌token
     * @param torrent .torrent文档的Base64值
     * @param urls 补充url源
     * @param options 额外参数
     * @param position 下载次序，忽略默认添加到最末尾
     * @returns 任务GID
     */
    "aria2.addTorrent"(secret: string, torrent: string, options?: Aria2Option, position?: number): string;
    /**
     * 添加metalink
     * @param secret RPC令牌token
     * @param metalink .metalink文档的Base64值
     * @param options 额外参数
     * @param position 下载次序，忽略默认添加到最末尾
     * @returns 任务GID
     */
    "aria2.addMetalink"(secret: string, metalink: string, options?: Aria2Option, position?: number): string;
    /**
     * 移除一个任务
     * @param secret RPC令牌token
     * @param gid 任务GID
     * @returns 任务GID
     */
    "aria2.remove"(secret: string, gid: string): string;
    /**
     * 强制移除一个任务，remove的无等待版
     * @param secret RPC令牌token
     * @param gid 任务GID
     * @returns 任务GID
     */
    "aria2.forceRemove"(secret: string, gid: string): string;
    /**
     * 暂停任务
     * @param secret RPC令牌token
     * @param gid 任务GID
     * @returns 任务GID
     */
    "aria2.pause"(secret: string, gid: string): string;
    /**
     * 暂停全部任务
     * @param secret RPC令牌token
     */
    "aria2.pauseAll"(secret?: string): "OK";
    /**
     * 强制暂停任务
     * @param secret RPC令牌token
     * @param gid 任务GID
     * @returns 任务GID
     */
    "aria2.forcePause"(secret: string, gid: string): string;
    /**
     * 强制暂停全部任务
     * @param secret RPC令牌token
     */
    "aria2.forcePauseAll"(secret?: string): "OK";
    /**
     * 继续任务
     * @param secret RPC令牌token
     * @param gid 任务GID
     * @returns 任务GID
     */
    "aria2.unpause"(secret: string, gid: string): string;
    /**
     * 全部继续
     * @param secret RPC令牌token
     */
    "aria2.unpauseAll"(secret?: string): "OK";
    /**
     * 查询下载进度
     * @param secret RPC令牌token
     * @param gid 任务GID
     * @param keys 查询键值，置空则返回所有
     */
    "aria2.tellStatus"(secret: string, gid: string, keys?: keyof Aria2Status): Aria2Status;
    /**
     * 查询url使用情况
     * @param secret RPC令牌token
     * @param gid 任务GID
     */
    "aria2.getUris"(secret: string, gid: string): { uri: string, status: "used" | "waiting" }[];
    /**
     * 查询文件列表
     * @param secret RPC令牌token
     * @param gid 任务GID
     */
    "aria2.getFiles"(secret: string, gid: string): Aria2Files[];
    /**
     * 查询p2p主机
     * @param secret RPC令牌token
     * @param gid 任务GID
     */
    "aria2.getPeers"(secret: string, gid: string): { peerId: string, ip: string, port: string, bitfield: string, amChoking: boolean, peerChoking: boolean, downloadSpeed: number, uploadSpeed: number, seeder: boolean }[];
    /**
     * 查询链接服务器信息
     * @param secret RPC令牌token
     * @param gid 任务GID
     */
    "aria2.getServers"(secret: string, gid: string): { index: number, servers: { uri: string, currentUri: string, downloadSpeed: number } }[];
    /**
     * 查询全部正在下载
     * @param secret PC令牌token
     * @param keys 查询键值，置空则返回所有
     */
    "aria2.tellActive"(secret?: string, keys?: keyof Aria2Status): Aria2Status[];
    /**
     * 查询等待下载表
     * @param secret PC令牌token
     * @param offset 查询起始索引
     * @param num 查询范围介绍索引
     * @param keys 查询键值，置空则返回所有
     */
    "aria2.tellWaiting"(secret: string, offset: number, num: number, keys?: keyof Aria2Status): Aria2Status[];
    /**
     * 查询停止下载表
     * @param secret PC令牌token
     * @param offset 查询起始索引
     * @param num 查询范围介绍索引
     * @param keys 查询键值，置空则返回所有
     */
    "aria2.tellStopped"(secret: string, offset: number, num: number, keys?: keyof Aria2Status): Aria2Status[];
    /**
     * 修改下载顺序
     * @param secret PC令牌token
     * @param gid 任务GID
     * @param pos 索引改变量，相对how
     * @param how 变动参考系
     * @returns 变动后的位置索引
     */
    "aria2.changePosition"(secret: string, gid: string, pos: number, how: 'POS_SET' | 'POS_CUR' | 'POS_END'): number;
    /**
     * 添加或移除url源
     * @param secret PC令牌token
     * @param gid 任务GID
     * @param fileIndex url索引，从1开始
     * @param delUris 要移除的url表
     * @param addUris 要添加的url表
     * @param position 下载顺序索引
     * @returns [删除的url数，添加的url数]
     */
    "aria2.changeUri"(secret: string, gid: string, fileIndex: number, delUris: string[], addUris: string[], position?: number): [number, number];
    /**
     * 获取任务配置信息
     * @param secret PC令牌token
     * @param gid 任务GID
     */
    "aria2.getOption"(secret: string, gid: string): Aria2Option;
    /**
     * 修改任务配置信息
     * @param secret PC令牌token
     * @param gid 任务GID
     * @param options 任务配置信息，其中部分无法修改
     */
    "aria2.changeOption"(secret: string, gid: string, options: Aria2Option): "OK";
    /**
     * 获取全局配置信息
     * @param secret PC令牌token
     */
    "aria2.getGlobalOption"(secret?: string): Aria2Option;
    /**
     * 修改全局配置信息
     * @param secret PC令牌token
     * @param options 任务配置信息，只有部分可用
     */
    "aria2.changeGlobalOption"(secret: string, options: Aria2Option): "OK";
    /**
     * 获取全局下载状态
     * @param secret PC令牌token
     * @returns 全局下载状态
     */
    "aria2.getGlobalStat"(secret?: string): { downloadSpeed: number, uploadSpeed: number, numActive: number, numWaiting: number, numStopped: number, numStoppedTotal: number };
    /**
     * 清除已完成/错误/已删除的下载以释放内存
     * @param secret PC令牌token
     */
    "aria2.purgeDownloadResult"(secret?: string): "OK";
    /**
     * 删除由gid表示的已完成/错误/已删除下载
     * @param secret PC令牌token
     * @param gid 任务GID
     */
    "aria2.removeDownloadResult"(secret: string, gid: string): "OK";
    /**
     * 获取aria2版本信息及启用功能列表
     * @param secret PC令牌token
     * @returns 版本信息及启用功能列表
     */
    "aria2.getVersion"(secret?: string): { version: string, enabledFeatures: string[] };
    /**
     * 获取aria2当前会话信息
     * @param secret PC令牌token
     * @returns 当前会话信息
     */
    "aria2.getSessionInfo"(secret?: string): { sessionId: string };
    /**
     * 关闭aria2
     * @param secret PC令牌token
     */
    "aria2.shutdown"(secret?: string): "OK";
    /**
     * 强制关闭aria2
     * @param secret PC令牌token
     */
    "aria2.forceShutdown"(secret?: string): "OK";
    /**
     * 保存当前会话保存到--save-session选项指定的文件
     * @param secret PC令牌token
     */
    "aria2.saveSession"(secret?: string): "OK";
    /**
     * 一次发送多个其他方法  
     * @param methods 其他方法调用组成的数组
     * @returns  所有方法返回值组成的数组
     */
    "system.multicall"(): any[];
    /**
     * 查询所有可用方法（上行）
     * @returns 所有可用方法名组成的数组
     */
    "system.listMethods"(): string[];
    /**
     * 查询所有可用通知（下行）  
     * @returns 所有可用通知名组成的数组
     */
    "system.listNotifications"(): string[];
}
class Aria2 {
    setting: Partial<Aria2Data> = {};
    constructor() {
        if (!setting) return;
        setting.userAgent && (this.setting.userAgent = setting.userAgent);
        setting.referer && (this.setting.referer = setting.referer);
        setting.filepath && (this.setting.directory = setting.filepath);
        setting.aria2.token && (this.setting.token = setting.aria2.token);
    }
    /**
     * 生成aria2命令行参数并赋值到剪切板
     * @param obj 下载配置数据
     */
    shell(obj: Aria2Data) {
        return new Promise((r: (v: void) => void, j) => {
            let result = "aria2c";
            obj = { ...this.setting, ...obj };
            obj.urls.forEach(d => result += ` "${d}"`);
            obj.out && (result += ` --out="${obj.out}"`);
            obj.userAgent && (result += ` --user-agent="${obj.userAgent}"`);
            obj.referer && (result += ` --referer="${obj.referer}"`);
            obj.directory && (result += ` --dir="${obj.directory}"`);
            obj.split && (result += ` --split="${obj.split}"`);
            obj.header && Object.entries(obj.header).forEach(d => result += ` --header="${d[0]}: ${d[1]}"`);
            navigator.clipboard.writeText(result).then(r, e => j(e));
        })
    }
    /**
     * 以rpc方式发送aria2下载数据
     * @param obj 下载配置数据
     */
    rpc(obj: Aria2Data) {
        obj = { ...this.setting, ...obj };
        const options: Aria2Option = {};
        obj.out && (options.out = obj.out);
        obj.userAgent && (options["user-agent"] = obj.userAgent);
        obj.referer && (options["referer"] = obj.referer);
        obj.directory && (options["dir"] = obj.directory);
        obj.split && (options["split"] = obj.split);
        obj.header && (options["header"] = obj.header);
        return this.postMessage("aria2.addUri", obj.id || <any>new Date().getTime(), [obj.urls, options]);
    }
    /**
     * rpc发送接口
     * @param method 请求类型
     * @param id 请求唯一标志
     * @param params 请求参数
     * @returns Promise托管的请求结果
     */
    postMessage<T extends keyof Aria2Method>(method: T, id: string, params: any[] = []): Promise<ReturnType<Aria2Method[T]>> {
        const url = `${setting.aria2.server}:${setting.aria2.port}/jsonrpc`;
        setting.aria2.token && params.unshift(`token:${setting.aria2.token}`);
        return new Promise((r, j) => {
            xhr({
                url: url,
                method: "POST",
                responseType: "json",
                data: JSON.stringify({ method, id, params })
            }).then(d => {
                d.error && j(d.error);
                d.result && r(d.result);
            }).catch(e => {
                xhr({
                    url: objUrl(url, { method, id, params: Base64.encode(JSON.stringify(params)) }),
                    method: "GET",
                    responseType: "json"
                }).then(d => {
                    d.error && j(d.error);
                    d.result && r(d.result);
                }).catch(() => j(e))
            })
        })
    }
    /**
     * 查询aria2版本，用于测试aria2 rpc链接情况
     * @returns Promise托管的aria2版本信息
     */
    getVersion() {
        return this.postMessage("aria2.getVersion", <any>new Date().getTime())
    }
}
/**
 * aria2工具
 */
export const aria2 = new Aria2();