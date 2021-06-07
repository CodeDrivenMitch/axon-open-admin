package com.insidion.axon.openadmin.processors

import com.insidion.axon.openadmin.tokens.TokenProvider
import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.TrackingEventProcessor
import org.axonframework.springboot.EventProcessorProperties
import org.springframework.stereotype.Service

@Service
class ProcessorStatusService(
    private val eventProcessingModule: EventProcessingModule,
    private val tokenProvider: TokenProvider,
    private val eventProcessingProperties: EventProcessorProperties
) {
    fun getStatus() = EventProcessorStatusDTO(tokenProvider.getNodeId(), eventProcessingModule.eventProcessors().keys.mapNotNull { name ->
        eventProcessingModule.eventProcessor(name, TrackingEventProcessor::class.java).map {
            val properties = eventProcessingProperties.processors[it.name]
            it.processingStatus()
            ProcessorStatusDTO(name, it.isRunning, it.isError, it.supportsReset(), it.activeProcessorThreads(), it.availableProcessorThreads(), properties?.batchSize ?: 1)
        }.orElse(null)
    })

    data class EventProcessorStatusDTO(
        val nodeId: String,
        val processorStatuses: List<ProcessorStatusDTO>,
    )
}
