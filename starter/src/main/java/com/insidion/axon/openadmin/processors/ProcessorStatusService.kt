package com.insidion.axon.openadmin.processors

import com.insidion.axon.openadmin.tokens.TokenProvider
import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.TrackingEventProcessor
import org.springframework.stereotype.Service

@Service
class ProcessorStatusService(
    private val eventProcessingModule: EventProcessingModule,
    private val tokenProvider: TokenProvider,
) {
    fun getStatus() = EventProcessorStatusDTO(tokenProvider.getNodeId(), eventProcessingModule.eventProcessors().keys.mapNotNull { name ->
        eventProcessingModule.eventProcessor(name, TrackingEventProcessor::class.java).map {
            ProcessorStatusDTO(name, it.isRunning, it.isError, it.supportsReset(), it.activeProcessorThreads(), it.availableProcessorThreads())
        }.orElse(null)
    })

    data class EventProcessorStatusDTO(
        val nodeId: String,
        val processorStatuses: List<ProcessorStatusDTO>,
    )
}
