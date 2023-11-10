package com.insidion.axon.openadmin

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import jakarta.annotation.PostConstruct
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ComponentScan("com.insidion.axon.openadmin")
@EnableConfigurationProperties(AxonAdminProperties::class)
class AxonAdminConfiguration(
    @Value("\${server.servlet.context-path:}")
    val contextPath: String,
    @Value("\${axon.admin.base-url:axon-admin}")
    val axonAdminPath: String,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostConstruct
    fun logInitialization() {
        logger.info("Thanks for using Axon Open Admin in your application. To get started, navigate to $contextPath/$axonAdminPath")
    }

    @Bean(name = ["axonOpenAdmin"])
    fun objectMapper() = ObjectMapper().findAndRegisterModules()
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
}

