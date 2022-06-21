import("fs-extra").then(d => {
    d.emptyDir("./dist").then(() => {
        d.copy("./src", "./dist", { filter: d => !d.endsWith(".ts") })
    })
})