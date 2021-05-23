package com.insidion.axon.openadmin.demo

import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.EventHandler
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@ProcessingGroup("inifite")
@Component
class InfiniteProjectio {
    private val log = LoggerFactory.getLogger(this::class.java)

    @EventHandler
    fun logEvent(event: Any) {
        throw IllegalStateException("Error on purpose for testing!")
    }
}
