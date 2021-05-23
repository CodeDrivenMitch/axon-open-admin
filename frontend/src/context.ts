let cp = window.location.pathname.substr(1)
if (cp.length === 0) {
    cp = "axon-admin"
}
if(cp.endsWith("/")) {
    cp = cp.substr(0, cp.length - 1)
}

export const contextPath = "/" + cp
