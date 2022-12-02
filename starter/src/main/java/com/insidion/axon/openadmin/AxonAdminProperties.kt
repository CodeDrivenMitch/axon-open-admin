package com.insidion.axon.openadmin

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.context.ApplicationContext
import java.util.Collections.singletonList

@ConstructorBinding
@ConfigurationProperties(prefix = "axon.admin")
class AxonAdminProperties(
    val baseUrl: String = "axon-admin",
    val servers: MutableMap<String, List<String>> = HashMap()
) {
    lateinit var component: String

    @Autowired
    fun setDefaultServerIfNone(
        applicationContext: ApplicationContext,
        @Value("\${server.servlet.context-path:}") contextPath: String
    ) {
        if (servers.isNotEmpty()) {
            return;
        }
        component = if (applicationContext.id == null) {
            "unnamed"
        } else {
            applicationContext.id!!.split(":")[0]
        }
        servers[component] = singletonList("$contextPath/$baseUrl")
    }
}
