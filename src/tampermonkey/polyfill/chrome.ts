// 这里并不是实现chrome API，也实现不了，只是保证全局范围内有chrome这个变量，不至于出现致命错误
// 毕竟作为MV3项目，在代码中误引入这个关键词是再正常不过了
self.chrome || Reflect.defineProperty(self, "chrome", { value: {} })