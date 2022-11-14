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
        return `{"inventory": ["http://localhost:8081/axon-admin"], "booking": ["http://localhost:8088/axon-admin", "http://localhost:8080/axon-admin", "/axon-admin"]}`
    }
    // @ts-ignore
    return window.backendServers
}


console.log("context-path is " + getContentPath())
export const contextPath = getContentPath()

console.log("services is", getBackendServers())
export const services = JSON.parse(getBackendServers()) as { [name: string]: string[] }

const pathname = window.location.pathname;
const realUrl = pathname.startsWith(contextPath) ? pathname.substr(contextPath.length + 1) : pathname

if (!realUrl) {
    window.history.pushState({}, `${contextPath}/tokens`)
}
