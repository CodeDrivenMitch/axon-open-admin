let cp = window.location.pathname.substr(1)
if (cp.length === 0) {
    cp = "/axon-admin"
}

export const contextPath = cp
