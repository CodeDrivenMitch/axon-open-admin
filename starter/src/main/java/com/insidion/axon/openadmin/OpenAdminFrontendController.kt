package com.insidion.axon.openadmin

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Qualifier
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
    @Value("\${server.servlet.context-path:}")
    val contextPath: String,
    val properties: AxonAdminProperties,
    @Qualifier("axonOpenAdmin")
    val objectMapper: ObjectMapper,
) {
    @GetMapping(value = ["", "/", "/tokens"], produces = ["text/html"])
    @ResponseBody
    fun serveFrontend(): String {
        val stream = ResourceUtils.getURL("classpath:static/axon-admin/index.html").openStream()
        val axonAdminPath = properties.baseUrl
        return StreamUtils.copyToString(stream, Charset.defaultCharset())
            .replace("__APP_CONTEXT_PATH__", "$contextPath/$axonAdminPath")
            .replace("/static/css", "$contextPath/$axonAdminPath/static/css")
            .replace("/static/js", "$contextPath/$axonAdminPath/static/js")
            .replace("\"__APP_BACKEND_SERVERS__\"", objectMapper.writeValueAsString(properties.servers))

    }
}
