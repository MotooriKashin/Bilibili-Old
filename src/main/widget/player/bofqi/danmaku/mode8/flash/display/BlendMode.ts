/**
 * 提供混合模式可视效果的常量值的类。这些常量在以下项目中使用：  
 * - flash.display.DisplayObject 类的 blendMode 属性。
 * - flash.display.BitmapData 类的 draw() 方法的 blendMode 参数
 */
export enum BlendMode {
    /**
     * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。  
     * 例如，如果显示对象的某个像素的 RGB 值为 0xAAA633，背景像素的 RGB 值为 0xDD2200，则显示像素的结果 RGB 值为 0xFFC833（因为 0xAA + 0xDD > 0xFF，0xA6 + 0x22 = 0xC8，且 0x33 + 0x00 = 0x33）。
     */
    ADD = 'add',
    /** 将显示对象的每个像素的 Alpha 值应用于背景。这要求将父显示对象的 blendMode 属性设置为 flash.display.BlendMode.LAYER。 */
    ALPHA = 'alpha',
    /**
     * 在显示对象原色和背景颜色中选择相对较暗的颜色（具有较小值的颜色）。此设置通常用于叠加类型。  
     * 例如，如果显示对象的某个像素的 RGB 值为 0xFFCC33，背景像素的 RGB 值为 0xDDF800，则显示像素的结果 RGB 值为 0xDDCC00（因为 0xFF > 0xDD，0xCC < 0xF8，且 0x33 > 0x00 = 33）。
     */
    DARKEN = 'darken',
    /**
     * 将显示对象的原色与背景颜色进行比较，然后从较亮的原色值中减去较暗的原色值。此设置通常用于得到更明亮的颜色。  
     * 例如，如果显示对象的某个像素的 RGB 值为 0xFFCC33，背景像素的 RGB 值为 0xDDF800，则显示像素的结果 RGB 值为 0x222C33（因为 0xFF - 0xDD = 0x22，0xF8 - 0xCC = 0x2C，且 0x33 - 0x00 = 0x33）。
     */
    DIFFERENCE = 'difference',
    /** 根据显示对象的 Alpha 值擦除背景。此过程要求将父显示对象的 blendMode 属性设置为 flash.display.BlendMode.LAYER。 */
    ERASE = 'erase',
    /** 根据显示对象的暗度调整每个像素的颜色。如果显示对象灰度值高于 50%，则显示对象和背景颜色进行叠加，从而产生较亮的颜色。如果显示对象灰度值低于 50%，则颜色相乘，从而产生较暗的颜色。此设置通常用于获得阴影效果。 */
    HARDLIGHT = 'hardlight',
    /** 反转背景。 */
    INVERT = 'invert',
    /** 强制为该显示对象创建一个透明度组。这意味着在对显示对象进行进一步处理之前，该对象已在临时缓冲区中预先构成。在以下情况下将会自动完成预先构成操作：显示对象通过位图缓存进行预缓存，或者显示对象是一个显示对象容器，该容器至少具有一个带有 blendMode 设置（而不是 'normal'）的子对象。 */
    LAYER = 'layer',
    /**
     * 在显示对象原色和背景颜色中选择相对较亮的颜色（具有较大值的颜色）。此设置通常用于叠加类型。  
     * 例如，如果显示对象的某个像素的 RGB 值为 0xFFCC33，背景像素的 RGB 值为 0xDDF800，则显示像素的结果 RGB 值为 0xFFF833（因为 0xFF > 0xDD，0xCC < 0xF8，且 0x33 > 0x00 = 33）。
     */
    LIGHTEN = 'lighten',
    /**
     * 将显示对象的原色值与背景颜色的原色值相乘，然后除以 0xFF 进行标准化，从而得到较暗的颜色。此设置通常用于阴影和深度效果。  
     * 例如，如果显示对象中一个像素的某个原色（例如红色）与背景中对应的像素颜色的值均为 0x88，则相乘结果为 0x4840。除以 0xFF 将得到该原色的值 0x48，这是比显示对象或背景颜色暗的阴影。
     */
    MULTIPLY = 'multiply',
    /** 该显示对象出现在背景前面。显示对象的像素值会覆盖背景的像素值。在显示对象为透明的区域，背景是可见的。 */
    NORMAL = 'normal',
    /** 根据背景的暗度调整每个像素的颜色。如果背景灰度值高于 50%，则显示对象和背景颜色进行叠加，从而产生较亮的颜色。如果背景灰度值低于 50%，则颜色相乘，从而产生较暗的颜色。此设置通常用于获得阴影效果。 */
    OVERLAY = 'overlay',
    /** 将显示对象颜色的补色（反色）与背景颜色的补色相乘，会产生漂白效果。此设置通常用于产生加亮效果或用来删除显示对象的黑色区域。 */
    SCREEN = 'screen',
    /**
     * 使用着色器来定义对象之间的混合。  
     * 将 blendShader 属性设置为 Shader 实例时，会自动将显示对象的 blendMode 属性设置为 BlendMode.SHADER。如果在未首先设置 blendShader 属性的情况下将 blendMode 属性设置为 BlendMode.SHADER，则会改为将 blendMode 属性设置为 BlendMode.NORMAL。如果设置了 blendShader 属性（这会将 blendMode 属性设置为 BlendMode.SHADER），则随后 blendMode 属性的值发生更改，只需将 blendMode 属性设置为 BlendMode.SHADER 即可将混合模式重置为使用混合着色器。除非要更改用于定义混合模式的着色器，否则无需再次设置 blendShader 属性。
     */
    SHADER = 'shader',
}