package com.insidion.axon.openadmin

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Controller
import org.springframework.util.ResourceUtils
import org.springframework.util.StreamUtils
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import java.nio.charset.Charset

@Controller
@RequestMapping("\${axon.admin.base-url:axon-admin}")
class OpenAdminFrontendController(
    @Value("\${axon.admin.base-url:axon-admin}")
    val axonAdminPath: String,
    @Value("\${server.servlet.context-path:}")
    val contextPath: String,
) {
    @GetMapping(value = ["", "/", "/tokens", "/events"], produces = ["text/html"])
    @ResponseBody
    fun serveFrontend(): String {
        val stream = ResourceUtils.getURL("classpath:static/axon-admin/index.html").openStream()
        return StreamUtils.copyToString(stream, Charset.defaultCharset())
            .replace("__APP_CONTEXT_PATH__", "$contextPath/$axonAdminPath")
            .replace("/static/css", "$contextPath/$axonAdminPath/static/css")
            .replace("/static/js", "$contextPath/$axonAdminPath/static/js")

    }
}
