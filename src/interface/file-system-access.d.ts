/**
 * File System Access API 的全局类型和接口。
 * See: https://wicg.github.io/file-system-access/
 */

// =================================================================
// 1. 权限相关的枚举和字典 (Enums and Dictionaries for Permissions)
// =================================================================

/**
 * 文件系统权限模式：'read'（读取）或 'readwrite'（读写）。
 * @see https://wicg.github.io/file-system-access/#enumdef-filesystempermissionmode
 */
declare enum FileSystemPermissionMode {
    "read" = "read",
    "readwrite" = "readwrite",
}

/**
 * 用于查询或请求文件系统句柄权限的字典。
 * @see https://wicg.github.io/file-system-access/#dictdef-filesystemhandlepermissiondescriptor
 */
declare interface FileSystemHandlePermissionDescriptor {
    /**
     * 所需的权限模式。默认为 'read'。
     */
    mode?: FileSystemPermissionMode;
}

/**
 * 用于权限 API (Permissions API) 的描述符，用于查询文件系统权限的全局状态。
 * 通常与 `navigator.permissions.query()` 一起使用。
 * @see https://wicg.github.io/file-system-access/#dictdef-filesystempermissiondescriptor
 */
declare interface FileSystemPermissionDescriptor extends PermissionDescriptor {
    /**
     * 权限请求所关联的文件系统句柄。
     */
    handle: FileSystemHandle;
    /**
     * 所需的权限模式。默认为 'read'。
     */
    mode?: FileSystemPermissionMode;
}

// =================================================================
// 2. 句柄接口 (Handle Interfaces)
// =================================================================

/**
 * 所有文件系统句柄（File System Handles）的基类接口。
 * 它定义了所有文件和目录句柄共享的通用属性和权限管理方法。
 *
 * 注意：`name` 和 `kind` 属性是从 [FS] 规范中继承的。
 * @see https://wicg.github.io/file-system-access/#filesystemhandle
 */
declare interface FileSystemHandle {
    /**
     * 句柄的类型：'file'（文件）或 'directory'（目录）。
     */
    readonly kind: "file" | "directory";

    /**
     * 文件或目录的名称。
     */
    readonly name: string;

    /**
     * 检查当前句柄是否与另一个句柄指向相同的文件系统条目。
     * @param other 要比较的另一个句柄。
     * @returns 一个布尔值，表示两个句柄是否相等。
     */
    isSameEntry(other: FileSystemHandle): Promise<boolean>;

    /**
     * 查询此句柄的指定权限状态。
     * @param descriptor 权限描述符，指定 'read' 或 'readwrite' 模式。
     * @returns 包含权限状态（'granted'、'denied' 或 'prompt'）的 Promise。
     */
    queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;

    /**
     * 请求此句柄的指定权限。如果权限状态为 'prompt'，将向用户显示提示。
     * 此方法需要用户激活 (user activation) 才能显示提示。
     * @param descriptor 权限描述符，指定 'read' 或 'readwrite' 模式。
     * @returns 包含新权限状态的 Promise。
     */
    requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
}

/**
 * 表示文件系统中的一个文件。
 * @see https://wicg.github.io/file-system-access/#filesystemfilehandle
 */
declare interface FileSystemFileHandle extends FileSystemHandle {
    /**
     * 句柄的类型，固定为 'file'。
     */
    readonly kind: "file";

    /**
     * 获取与此文件句柄关联的 File 对象。
     * @returns 包含 File 对象的 Promise。
     */
    getFile(): Promise<File>;

    /**
     * 创建一个可用于写入文件内容的流写入器。
     * @param options 可选选项，例如是否截断文件 (`truncate: true`)。
     * @returns 包含 FileSystemWritableFileStream 对象的 Promise。
     */
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
}

/**
 * 表示文件系统中的一个目录。
 * @see https://wicg.github.io/file-system-access/#filesystemdirectoryhandle
 */
declare interface FileSystemDirectoryHandle extends FileSystemHandle {
    /**
     * 句柄的类型，固定为 'directory'。
     */
    readonly kind: "directory";

    /**
     * 获取给定名称的目录句柄。如果目录不存在，则创建它（如果 `create` 为 true）。
     * @param name 要获取的目录名称。
     * @param options 包含 `create` 选项，默认为 false。
     * @returns 包含 FileSystemDirectoryHandle 的 Promise。
     */
    getDirectoryHandle(
        name: string,
        options?: FileSystemGetFileHandleOptions
    ): Promise<FileSystemDirectoryHandle>;

    /**
     * 获取给定名称的文件句柄。如果文件不存在，则创建它（如果 `create` 为 true）。
     * @param name 要获取的文件名称。
     * @param options 包含 `create` 选项，默认为 false。
     * @returns 包含 FileSystemFileHandle 的 Promise。
     */
    getFileHandle(name: string, options?: FileSystemGetFileHandleOptions): Promise<FileSystemFileHandle>;

    /**
     * 删除目录中的文件或子目录。
     * @param name 要删除的文件或目录的名称。
     * @param options 包含 `recursive` 选项。如果删除非空目录，`recursive` 必须为 true。
     * @returns 一个 Promise，在操作完成后解析。
     */
    removeEntry(name: string, options?: FileSystemRemoveEntryOptions): Promise<void>;

    /**
     * 返回一个异步迭代器，用于遍历目录中的所有文件和目录条目。
     * @returns 异步迭代器，用于遍历子句柄。
     */
    [Symbol.asyncIterator](): AsyncIterableIterator<FileSystemHandle>;

    /**
     * 返回一个异步迭代器，用于遍历目录中的所有文件和目录条目。
     * （这是一个便利方法，与 `[Symbol.asyncIterator]()` 相同。）
     * @returns 异步迭代器，用于遍历子句柄。
     */
    values(): AsyncIterableIterator<FileSystemHandle>;
}

// =================================================================
// 3. 写入流接口 (Writable Stream Interface)
// =================================================================

/**
 * 表示一个可写入文件的流。
 * 它扩展了 WritableStream 并添加了文件操作方法。
 * @see https://wicg.github.io/file-system-access/#filesystemwritablefilestream
 */
declare interface FileSystemWritableFileStream extends WritableStream {
    /**
     * 将流的写入位置（指针）移动到文件中的指定偏移量。
     * @param position 文件中的字节偏移量。
     * @returns 一个 Promise，在操作完成后解析。
     */
    seek(position: number): Promise<void>;

    /**
     * 将文件大小调整为指定的长度（以字节为单位）。
     * @param size 文件的新长度。
     * @returns 一个 Promise，在操作完成后解析。
     */
    truncate(size: number): Promise<void>;

    /**
     * 将数据写入文件。
     * @param data 要写入的数据。可以是 ArrayBuffer、TypedArray、DataView、Blob 或 string。
     * @returns 一个 Promise，在操作完成后解析。
     */
    write(data: FileSystemWriteChunkType): Promise<void>;

    /**
     * 写入操作的便利类型。
     * @see https://wicg.github.io/file-system-access/#dictdef-filesystemwriteparams
     */
    write(data: FileSystemWriteParams): Promise<void>;
}

// =================================================================
// 4. 辅助类型和字典 (Helper Types and Dictionaries)
// =================================================================

/**
 * 写入文件流时接受的数据块类型。
 * @see https://wicg.github.io/file-system-access/#typedef-filesystemwritechuncktype
 */
declare type FileSystemWriteChunkType = ArrayBuffer | ArrayBufferView | Blob | string;

/**
 * 写入文件流时的详细操作参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-filesystemwriteparams
 */
declare interface FileSystemWriteParams {
    /**
     * 写入操作的类型：'write'（写入）、'seek'（移动指针）或 'truncate'（截断）。
     */
    type: 'write' | 'seek' | 'truncate';
    /**
     * 如果类型是 'write'，则为要写入的数据。
     */
    data?: FileSystemWriteChunkType;
    /**
     * 如果类型是 'seek' 或 'truncate'，则为文件中的偏移量或大小。
     */
    size?: number;
    /**
     * 如果类型是 'seek'，则为文件中的偏移量。
     */
    position?: number;
}

/**
 * 创建可写文件流时的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-filesystemcreatewritableoptions
 */
declare interface FileSystemCreateWritableOptions {
    /**
     * 是否在创建写入器时清空文件内容。默认为 false。
     */
    keepExistingData?: boolean;
}

/**
 * 获取文件或目录句柄时的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-filesystemgetfilehandleoptions
 */
declare interface FileSystemGetFileHandleOptions {
    /**
     * 如果文件或目录不存在，是否创建它。默认为 false。
     */
    create?: boolean;
}

/**
 * 移除目录条目时的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-filesystemremoveentryoptions
 */
declare interface FileSystemRemoveEntryOptions {
    /**
     * 如果要删除的是目录，是否递归删除其内容。默认为 false。
     */
    recursive?: boolean;
}

/**
 * 已知的系统目录名称，用于文件选择器的 `startIn` 选项。
 * @see https://wicg.github.io/file-system-access/#enumdef-wellknowndirectory
 */
type WellKnownDirectory = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';

/**
 * 文件选择器中接受的文件类型描述。
 * @see https://wicg.github.io/file-system-access/#dictdef-filepickeraccepttype
 */
declare interface FilePickerAcceptType {
    /**
     * 向用户显示的可选描述文本（例如："图片文件"）。
     */
    description?: string;
    /**
     * 映射关系：MIME 类型字符串到扩展名序列或字符串。
     * 例如: `{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/*': [] }`
     */
    accept: Record<string, string | string[]>;
}

/**
 * 文件选择器通用的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-filepickeroptions
 */
declare interface FilePickerOptions {
    /**
     * 文件类型过滤器列表，用于限制用户可以选择的文件类型。
     */
    types?: FilePickerAcceptType[];
    /**
     * 是否排除“所有文件”的选项。默认为 false。
     */
    excludeAcceptAllOption?: boolean;
    /**
     * 开发者可选的 ID，用于记住用户上次选择的目录。
     */
    id?: string;
    /**
     * 文件选择器打开时默认开始的目录。
     */
    startIn?: WellKnownDirectory | FileSystemHandle;
}

/**
 * 打开文件选择器 (`showOpenFilePicker`) 的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-openfilepickeroptions
 */
declare interface OpenFilePickerOptions extends FilePickerOptions {
    /**
     * 是否允许用户选择多个文件。默认为 false。
     */
    multiple?: boolean;
}

/**
 * 保存文件选择器 (`showSaveFilePicker`) 的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-savefilepickeroptions
 */
declare interface SaveFilePickerOptions extends FilePickerOptions {
    /**
     * 建议的文件名（或相对路径）。
     */
    suggestedName?: string;
}

/**
 * 目录选择器 (`showDirectoryPicker`) 的可选参数。
 * @see https://wicg.github.io/file-system-access/#dictdef-directorypickeroptions
 */
declare interface DirectoryPickerOptions {
    /**
     * 开发者可选的 ID，用于记住用户上次选择的目录。
     */
    id?: string;
    /**
     * 目录选择器打开时默认开始的目录。
     */
    startIn?: WellKnownDirectory | FileSystemHandle;
    /**
     * 所请求的权限模式。默认为 'read'。
     * 注意：对于目录选择器，用户会授予所选模式的访问权限。
     */
    mode?: FileSystemPermissionMode;
}


// =================================================================
// 5. 全局可访问方法 (Global Access Methods)
// =================================================================

/**
 * 向用户显示一个文件选择器，用于打开一个或多个文件。
 * 此方法需要用户激活 (user activation)。
 * @param options 可选参数，用于配置选择器的行为。
 * @returns 包含用户选择的一个或多个 `FileSystemFileHandle` 的 Promise。
 * @see https://wicg.github.io/file-system-access/#api-showopenfilepicker
 */
declare function showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;

/**
 * 向用户显示一个保存文件选择器，用于指定一个文件保存位置。
 * 此方法需要用户激活 (user activation)。
 * @param options 可选参数，用于配置选择器的行为。
 * @returns 包含用户选择的 `FileSystemFileHandle` 的 Promise。
 * @see https://wicg.github.io/file-system-access/#api-showsavefilepicker
 */
declare function showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;

/**
 * 向用户显示一个目录选择器，用于选择一个目录。
 * 此方法需要用户激活 (user activation)。
 * @param options 可选参数，用于配置选择器的行为。
 * @returns 包含用户选择的 `FileSystemDirectoryHandle` 的 Promise。
 * @see https://wicg.github.io/file-system-access/#api-showdirectorypicker
 */
declare function showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;


// =================================================================
// 6. 其它全局扩展 (Other Global Extensions)
// =================================================================

/**
 * 扩展全局 `Navigator` 接口，以便通过 Permissions API 查询文件系统权限。
 */
declare interface Navigator {
    /**
     * 扩展 Permissions 接口，使其支持查询文件系统权限。
     */
    readonly permissions: Permissions;
}

/**
 * 扩展 Permissions 接口，使其支持查询文件系统权限。
 */
declare interface Permissions {
    /**
     * 重载 `query` 方法以支持文件系统权限描述符。
     * @param permissionDescriptor 文件系统权限描述符。
     * @returns 包含文件系统权限状态的 Promise。
     */
    query(permissionDescriptor: FileSystemPermissionDescriptor): Promise<PermissionStatus>;
}

/**
 * 扩展全局 `DataTransferItem` 接口，使其支持获取文件系统句柄（例如通过拖放操作）。
 * @see https://wicg.github.io/file-system-access/#extensions-to-the-datatransferitem-interface
 */
declare interface DataTransferItem {
    /**
     * 获取与此数据传输项关联的文件系统句柄。
     * @returns 包含 `FileSystemHandle` 的 Promise，如果项不是文件或目录，则为 null。
     */
    getAsFileSystemHandle(): Promise<FileSystemHandle | null>;
}