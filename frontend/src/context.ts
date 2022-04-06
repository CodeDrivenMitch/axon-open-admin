
function getContentPath() {
    // @ts-ignore
    if (window.appContextPath.startsWith("__")) {
        return "/axon-admin"
    }
    // @ts-ignore
    return window.appContextPath
}
console.log("context-path is " + getContentPath())
export const contextPath = getContentPath()
