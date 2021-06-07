package com.insidion.axon.openadmin.demo.projections

import org.axonframework.config.ProcessingGroup
import org.axonframework.eventhandling.EventHandler
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.lang.Thread.sleep

@ProcessingGroup("slow")
@Component
class SlowProjection {
    private val log = LoggerFactory.getLogger(this::class.java)

    @EventHandler
    fun logEvent(event: Any) {
        sleep(800)
    }
}
