function getContentPath() {
    // @ts-ignore
    if (window.appContextPath.startsWith("__")) {
        return "/axon-admin"
    }
    // @ts-ignore
    return window.appContextPath
}

function getBackendServers() {
    // @ts-ignore
    if (window.backendServers.startsWith("__")) {
        return `{"local": "/axon-admin", "8080": "http://localhost:8080/axon-admin", "8081": "http://localhost:8081/axon-admin"}`
    }
    // @ts-ignore
    return window.backendServers
}


console.log("context-path is " + getContentPath())
export const contextPath = getContentPath()
// @ts-ignore
export const backendServers = JSON.parse(getBackendServers()) as { [name: string]: string }

const pathname = window.location.pathname;
const realUrl = pathname.startsWith(contextPath) ? pathname.substr(contextPath.length + 1) : pathname

if (!realUrl) {
    window.history.pushState({}, `${contextPath}/tokens`)
}
