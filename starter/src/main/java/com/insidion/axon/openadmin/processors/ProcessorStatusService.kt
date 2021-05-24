package com.insidion.axon.openadmin.processors

import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.TrackingEventProcessor
import org.springframework.stereotype.Service

@Service
class ProcessorStatusService(
    private val eventProcessingModule: EventProcessingModule
) {
    fun getStatus() = eventProcessingModule.eventProcessors().keys.mapNotNull { name ->
        eventProcessingModule.eventProcessor(name, TrackingEventProcessor::class.java).map {
            ProcessorStatusDTO(name, it.isRunning, it.isError, it.supportsReset())
        }.orElse(null)
    }
}
