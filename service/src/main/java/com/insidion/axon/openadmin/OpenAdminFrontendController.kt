package com.insidion.axon.openadmin

import org.apache.commons.io.FileUtils
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Controller
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
    @GetMapping("/", produces = ["text/html"])
    @ResponseBody
    fun serveFrontend(): String {
        val stream = ClassPathResource("/static/axon-admin/index.html")
        return FileUtils.readFileToString(stream.file, Charset.defaultCharset())
            .replace("/static/css", "$contextPath/$axonAdminPath/static/css")
            .replace("/static/js", "$contextPath/$axonAdminPath/static/js")

    }
}
