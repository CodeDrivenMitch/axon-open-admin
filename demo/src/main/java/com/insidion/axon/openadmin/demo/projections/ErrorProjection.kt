package com.insidion.axon.openadmin.demo.projections

import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.EventHandler
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@ProcessingGroup("error")
@Component
class ErrorProjection {
    private val log = LoggerFactory.getLogger(this::class.java)

    @EventHandler
    fun logEvent(event: Any) {
        Thread.sleep(1200)
    }
}
