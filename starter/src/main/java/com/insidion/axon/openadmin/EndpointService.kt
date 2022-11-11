package com.insidion.axon.openadmin

import com.fasterxml.jackson.databind.ObjectMapper
import com.insidion.toResponse
import org.axonframework.config.Configuration
import org.axonframework.config.LifecycleHandler
import org.axonframework.lifecycle.Phase
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import java.util.concurrent.CompletableFuture

@Component
class EndpointService(
    private val configuration: Configuration,
    @Qualifier("axonOpenAdmin")
    private val objectMapper: ObjectMapper,
) {
    private var ready = false

    init {
        // This enabled flag prevents concurrent modification exceptions in the configuration while starting.
        configuration.onStart(Phase.INSTRUCTION_COMPONENTS, LifecycleHandler {
            ready = true
            return@LifecycleHandler CompletableFuture.completedFuture(null)
        })
    }

    fun checkReady() {
        if (!ready) {
            throw IllegalStateException("Axon has not been started yet!")
        }
    }

    fun ifReady(block: () -> Any?): ResponseEntity<*> {
        checkReady()
        val result = block.invoke() ?: return ResponseEntity<Void>(HttpStatus.OK)
        return result.toResponse(objectMapper)
    }
}
