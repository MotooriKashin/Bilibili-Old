/** DisplacementMapFilterMode 类为 DisplacementMapFilter 类的 mode 属性提供值。 */
export enum DisplacementMapFilterMode {
    /** 将置换值锁定在源图像的边缘。 */
    CLAMP = 'clamp',
    /** 如果置换值在图像之外，则替换 color 和 alpha 属性中的值。 */
    COLOR = 'color',
    /** 如果置换值超出了范围，则忽略置换并使用源像素。 */
    IGNORE = 'ignore',
    /** 将置换值折返到源图像的另一侧。 */
    WRAP = 'wrap',
}