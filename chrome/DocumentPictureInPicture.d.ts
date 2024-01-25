/**
 * 文档画中画 API可以打开一个始终位于顶部的窗口，
 * 该窗口可以填充任意 HTML 内容，
 * 例如带有自定义控件的视频或显示视频电话会议参与者的一组流。
 * 它扩展了早期的画中画 API<video>，
 * 该API专门支持将 HTML<video>元素放入始终位于顶部的窗口中。
 */
declare var documentPictureInPicture: DocumentPictureInPicture;

declare interface DocumentPictureInPicture extends EventTarget {
    /** 画中画窗口内的浏览上下文的实例。 */
    readonly window: Window | null;
    /**
     * 打开当前主浏览上下文的画中画窗口
     * 该requestWindow()方法需要瞬时激活，
     * 即必须响应用户操作（例如鼠标单击或按下按钮）来调用它。
     */
    requestWindow(options?: IDocumentPictureInPictureOptions): Promise<Window>;
}

declare interface IDocumentPictureInPictureOptions {
    /** 
     * 一个非负数，表示为画中画窗口视口设置的高度（以像素为单位）。
     * 如果options未指定，则使用默认值 0。
     */
    height: number;
    /**
     * 一个非负数，表示为画中画窗口视口设置的宽度（以像素为单位）。
     * 如果options未指定，则使用默认值 0。
     */
    width: number;
}