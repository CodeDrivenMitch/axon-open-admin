package com.insidion.axon.openadmin.demo

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import javax.annotation.PostConstruct

@Configuration
@EnableScheduling
class CoreConfiguration {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostConstruct
    fun setup() {
        logger.info("CoreConfiguration of demo domain loaded")
    }
}
