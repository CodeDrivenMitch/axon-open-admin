package com.insidion.axon.openadmin.demo

import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.EventHandler
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@ProcessingGroup("some-fancy-group")
@Component
class EventLoggingProjection {
    private val log = LoggerFactory.getLogger(this::class.java)

    @EventHandler
    fun logEvent(event: Any) {
        log.info("Processing event: {}", event)
    }
}
