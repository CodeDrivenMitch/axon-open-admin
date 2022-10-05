package com.insidion.axon.openadmin.processors

import com.insidion.axon.openadmin.tokens.TokenProvider
import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.StreamingEventProcessor
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
        val deadLetterQueue = eventProcessingModule.deadLetterQueue(name)
        eventProcessingModule.eventProcessor(name, StreamingEventProcessor::class.java).map {
            val properties = eventProcessingProperties.processors[it.name]
            ProcessorStatusDTO(
                name = name,
                running = it.isRunning,
                error = it.isError,
                resettable = it.supportsReset(),
                activeProcessorThreads = if (it is TrackingEventProcessor) it.activeProcessorThreads() else null,
                availableProcessorThreads = if (it is TrackingEventProcessor) it.availableProcessorThreads() else 0,
                batchSize = properties?.batchSize ?: 1,
                type = it.javaClass.simpleName,
                dlqConfigured = deadLetterQueue.isPresent,
            )
        }.orElse(null)
    })

    data class EventProcessorStatusDTO(
            val nodeId: String,
            val processorStatuses: List<ProcessorStatusDTO>,
    )
}
