package com.insidion.axon.openadmin

import com.insidion.axon.openadmin.metrics.ProcessorMetricsService
import com.insidion.axon.openadmin.metrics.Statistics
import com.insidion.axon.openadmin.model.ProcessorId
import com.insidion.axon.openadmin.tokens.TokenProvider
import org.axonframework.eventhandling.ReplayToken
import org.axonframework.eventhandling.tokenstore.GenericTokenEntry
import org.axonframework.eventsourcing.eventstore.EventStore
import org.axonframework.serialization.Serializer
import org.springframework.stereotype.Service
import kotlin.math.roundToLong

@Service
class ProcessorInformationService(
    private val tokenProvider: TokenProvider,
    private val eventStore: EventStore,
    private val serializer: Serializer,
    private val processorMetricsService: ProcessorMetricsService,
) {
    fun getProcessors(): ProcessorInformationDTO {
        val headIndex = eventStore.createHeadToken().position().orElse(0)
        val processors = tokenProvider.getProcessors()
            .groupBy { it.processorName }
            .map { (processor, segments) ->
                val segmentDtos = segmentList(segments, headIndex)
                ProcessorDTO(
                    name = processor,
                    segments = segmentDtos,
                    replaying = segmentDtos.any { it.replaying == true },
                    currentIndex = segmentDtos.map { it.currentIndex }.minByOrNull { it ?: 0 }
                )
            }
            .sortedBy { it.name }

        return ProcessorInformationDTO(tokenProvider.getNodeId(), headIndex, processors)
    }

    private fun segmentList(
        segments: List<GenericTokenEntry<*>>,
        headIndex: Long
    ) = segments.map {
        val token = it.getToken(serializer)

        val currentIndex = token.position()?.orElse(0) ?: 0
        val behind = headIndex - currentIndex
        val statistics = processorMetricsService.getStatistics(ProcessorId(it.processorName, it.segment))
        SegmentDTO(
            currentIndex = currentIndex,
            tokenType = token::class.simpleName,
            owner = it.owner,
            segment = it.segment,
            replaying = ReplayToken.isReplay(token),
            behind = behind,
            statistics = statistics,
            secondsToHead = computeSecondsToHead(behind, statistics)
        )
    }.sortedBy { it.segment }

    private fun computeSecondsToHead(behind: Long, statistics: Statistics?) =
        if (behind == 0L || statistics?.positionRate5m == null) null else {
            (behind / statistics.positionRate5m).roundToLong()
        }
}
