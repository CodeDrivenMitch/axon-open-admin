package com.insidion.axon.openadmin.processors

import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.StreamingEventProcessor
import org.axonframework.eventhandling.TrackingEventProcessor
import org.axonframework.eventsourcing.eventstore.EventStore
import org.axonframework.springboot.EventProcessorProperties
import org.springframework.stereotype.Service

@Service
class ProcessorStatusService(
    private val eventProcessingModule: EventProcessingModule,
    private val eventProcessingProperties: EventProcessorProperties,
    private val eventStore: EventStore,
) {
    fun getStatus(): List<ProcessorStatusDTO> {
        val headToken = eventStore.createHeadToken()
        val headPosition = headToken?.position()?.orElse(0) ?: 0

        return eventProcessingModule.eventProcessors().keys.mapNotNull { name ->
            val deadLetterQueue = eventProcessingModule.deadLetterQueue(name)
            eventProcessingModule.eventProcessor(name, StreamingEventProcessor::class.java).map { it ->
                val properties = eventProcessingProperties.processors[it.name]
                ProcessorStatusDTO(
                    name = name,
                    tokenStoreIdentifier = it.tokenStoreIdentifier,
                    running = it.isRunning,
                    error = it.isError,
                    resettable = it.supportsReset(),
                    activeProcessorThreads = if (it is TrackingEventProcessor) it.processingStatus().size else 1,
                    availableProcessorThreads = if (it is TrackingEventProcessor) it.maxCapacity() else 1,
                    batchSize = properties?.batchSize ?: 1,
                    type = it.javaClass.simpleName,
                    dlqConfigured = deadLetterQueue.isPresent,
                    segments = it.processingStatus().values.map { status ->
                        val currentIndex = status.currentPosition.orElse(0)
                        SegmentDTO(
                            currentIndex = currentIndex,
                            oneOf = status.segment.mask + 1,
                            tokenType = status.trackingToken?.javaClass?.simpleName,
                            segment = status.segment.segmentId,
                            replaying = status.isReplaying,
                            behind = headPosition - currentIndex,
                            mergeableSegment = status.segment.mergeableSegmentId(),
                            splitSegment = status.segment.splitSegmentId(),
                        )
                    }
                )
            }.orElse(null)
        }
    }
}
