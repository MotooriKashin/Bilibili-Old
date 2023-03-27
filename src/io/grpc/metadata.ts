import { Constructor, Field, IConversionOptions, IToJSONOptions, IType, Message, NamespaceBase, OneOf, Reader, ReflectionObject, Root, Writer } from "protobufjs/light";
import metadata from '../../json/metadata.json'
import { base64 } from "../../utils/base64";

export abstract class GrpcMetaData {
    /** 命名空间 */
    protected static Root: Root;
    /** Type<Metadata> */
    protected static metadata: Type<Metadata>;
    /** 初始化命名空间及Type */
    protected static RootInit() {
        this.Root = Root.fromJSON(metadata);
        this.metadata = <any>this.Root.lookupType('Metadata');
    }
    /** grpc app host */
    protected hostAPP = '//app.bilibili.com';
    /** grpc host */
    protected hostGrpc = '//grpc.biliapi.net';
    /** grpc package */
    protected abstract package: string;
    /** 默认metadata */
    private metadata: Metadata = {
        buvid: '5848738A7B27474C9C407F25701EFAC28527C',
        build: 7220300,
        // channel: 'bilibili',
        mobi_app: 'android',
        platform: 'android'
        // device: 'phone'
    };
    /** Base64化metadata */
    private get metadataBase64() {
        return base64.encodeFromUint8Array(GrpcMetaData.metadata.encode(GrpcMetaData.metadata.fromObject(this.metadata)).finish());
    }
    constructor(protected access_key?: string) {
        GrpcMetaData.Root || GrpcMetaData.RootInit();
        access_key && (this.metadata.access_key = access_key);
    }
    /**
     * 发起grpc请求
     * @param method 方法名
     * @param body grpc序列化二进制数据
     */
    protected async fetch(method: string, body: Uint8Array) {
        const buffer = new ArrayBuffer(body.length + 5);
        const dataview = new DataView(buffer);
        dataview.setUint32(1, body.length); // 写入grpc压缩及字节标记
        const uInt8 = new Uint8Array(buffer);
        uInt8.set(body, 5);
        const respnse = await GM.fetch(`${this.hostGrpc}/${this.package}/${method}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/grpc',
                // 'authorization': `identify_v1 ${this.access_key || ''}`,
                'x-bili-metadata-bin': this.metadataBase64,
                'user-agent': 'Bilibili Freedoooooom/MarkII',
                'referer': ''
            },
            body: uInt8
        });
        if (respnse.headers.has('grpc-status') && respnse.headers.has('grpc-message')) {
            // 抛出grpc错误
            throw new Error(respnse.headers.get('grpc-message')!);
        }
        return respnse;
    }
}
interface Metadata {
    /** 登录鉴权 */
    access_key?: string;
    /** 包类型 */
    mobi_app: 'android' | 'iphone' | 'ipad' | 'white';
    /** 运行设备 */
    device?: string;
    /** 构建号 */
    build: number;
    /** 渠道 */
    channel?: string;
    /** 设备buvid */
    buvid: string;
    /** 设备类型 */
    platform: 'android' | 'ios';
}
/**
 * protobuf.Type 的拓展，使用泛型进行数据类型约束。  
 * 泛型参数为要序列化(Type.fromObject)的数据的类型，
 * 同时也是反序列化(Type.toObject)的结果类型。
 * `lookupType`报错【不能将类型“Type”分配给类型“Type<T>”】可以通过断言解决。
 * @example
 * const type:Type<T> = <any>Root.lookupType('...'); // T为对应类型
 */
export interface Type<T extends object> extends NamespaceBase {
    /** Message fields. */
    fields: { [k: string]: Field };

    /** Oneofs declared within this namespace, if any. */
    oneofs: { [k: string]: OneOf };

    /** Extension ranges, if any. */
    extensions: number[][];

    /** Reserved ranges, if any. */
    reserved: (number[] | string)[];

    /** Message fields by id. */
    readonly fieldsById: { [k: number]: Field };

    /** Fields of this message as an array for iteration. */
    readonly fieldsArray: Field[];

    /** Oneofs of this message as an array for iteration. */
    readonly oneofsArray: OneOf[];

    /**
     * The registered constructor, if any registered, otherwise a generic constructor.
     * Assigning a function replaces the internal constructor. If the function does not extend {@link Message} yet, its prototype will be setup accordingly and static methods will be populated. If it already extends {@link Message}, it will just replace the internal constructor.
     */
    ctor: Constructor<{}>;

    /**
     * Converts this message type to a message type descriptor.
     * @param [toJSONOptions] JSON conversion options
     * @returns Message type descriptor
     */
    toJSON(toJSONOptions?: IToJSONOptions): IType;

    /**
     * Adds a nested object to this type.
     * @param object Nested object to add
     * @returns `this`
     * @throws {TypeError} If arguments are invalid
     * @throws {Error} If there is already a nested object with this name or, if a field, when there is already a field with this id
     */
    add(object: ReflectionObject): Type<T>;

    /**
     * Removes a nested object from this type.
     * @param object Nested object to remove
     * @returns `this`
     * @throws {TypeError} If arguments are invalid
     * @throws {Error} If `object` is not a member of this type
     */
    remove(object: ReflectionObject): Type<T>;

    /**
     * Tests if the specified id is reserved.
     * @param id Id to test
     * @returns `true` if reserved, otherwise `false`
     */
    isReservedId(id: number): boolean;

    /**
     * Tests if the specified name is reserved.
     * @param name Name to test
     * @returns `true` if reserved, otherwise `false`
     */
    isReservedName(name: string): boolean;

    /**
     * Creates a new message of this type using the specified properties.
     * @param [properties] Properties to set
     * @returns Message instance
     */
    create(properties?: { [k: string]: any }): Message<T>;

    /**
     * Sets up {@link Type#encode|encode}, {@link Type#decode|decode} and {@link Type#verify|verify}.
     * @returns `this`
     */
    setup(): Type<T>;

    /**
     * Encodes a message of this type. Does not implicitly {@link Type#verify|verify} messages.
     * @param message Message instance or plain object
     * @param [writer] Writer to encode to
     * @returns writer
     */
    encode(message: (Message<T>), writer?: Writer): Writer;

    /**
     * Encodes a message of this type preceeded by its byte length as a varint. Does not implicitly {@link Type#verify|verify} messages.
     * @param message Message instance or plain object
     * @param [writer] Writer to encode to
     * @returns writer
     */
    encodeDelimited(message: (Message<T>), writer?: Writer): Writer;

    /**
     * Decodes a message of this type.
     * @param reader Reader or buffer to decode from
     * @param [length] Length of the message, if known beforehand
     * @returns Decoded message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {util.ProtocolError<{}>} If required fields are missing
     */
    decode(reader: (Reader | Uint8Array), length?: number): Message<T>;

    /**
     * Decodes a message of this type preceeded by its byte length as a varint.
     * @param reader Reader or buffer to decode from
     * @returns Decoded message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {util.ProtocolError} If required fields are missing
     */
    decodeDelimited(reader: (Reader | Uint8Array)): Message<T>;

    /**
     * Verifies that field values are valid and that required fields are present.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    verify(message: T): (null | string);

    /**
     * Creates a new message of this type from a plain object. Also converts values to their respective internal types.
     * @param object Plain object to convert
     * @returns Message instance
     */
    fromObject(object: T): Message<T>;

    /**
     * Creates a plain object from a message of this type. Also converts values to other types if specified.
     * @param message Message instance
     * @param [options] Conversion options
     * @returns Plain object
     */
    toObject(message: Message<T>, options?: IConversionOptions): T;
}