interface ErrorConstructor {

    /**
     * 将堆栈跟踪信息作为stack属性安装到提供的对象上。
     */
    captureStackTrace(object: object, constructor?: object): void;
}