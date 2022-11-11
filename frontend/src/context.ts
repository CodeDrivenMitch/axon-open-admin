
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

const pathname = window.location.pathname;
const realUrl = pathname.startsWith(contextPath) ? pathname.substr(contextPath.length + 1) : pathname

if (!realUrl) {
    window.history.pushState({}, `${contextPath}/tokens`)
}
