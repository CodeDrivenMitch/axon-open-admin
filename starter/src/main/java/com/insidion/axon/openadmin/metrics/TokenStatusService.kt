package com.insidion.axon.openadmin.metrics

import com.insidion.axon.openadmin.model.*
import com.insidion.axon.openadmin.tokens.TokenProvider
import org.axonframework.eventhandling.ReplayToken
import org.axonframework.eventhandling.Segment
import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry
import org.axonframework.eventsourcing.eventstore.EventStore
import org.axonframework.serialization.Serializer
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import kotlin.math.truncate

/**
 * We keep track here of the tokens and the amount of events it processed over time.
 * It is updated every 2 seconds and cached in-memory to reduce load on the token stores.
 */
@Service
class TokenStatusService(
        private val tokenProvider: TokenProvider,
        private val serializer: Serializer,
        private val eventStore: EventStore,
) {
    private val metricMap: MutableMap<ProcessorId, MutableList<Measurement>> = mutableMapOf()
    private val statisticMap: MutableMap<ProcessorId, Statistics> = mutableMapOf()
    private val tokenInformationMap: MutableMap<String, ProcessorDTO> = mutableMapOf()
    private val headMeasurements: MutableList<Measurement> = mutableListOf()

    fun getNodeId() = tokenProvider.getNodeId()

    fun getTokenInformation() = TokenInformationDTO(
            tokenProvider.getNodeId(),
            headMeasurements.maxByOrNull { it.time }?.value ?: 0,
            tokenInformationMap.values.toList().sortedBy { it.name })


    @Scheduled(fixedRate = 2000, initialDelay = 1000)
    fun updateCachedInformation() {
        val time = Instant.now()

        val headToken = eventStore.createHeadToken()
        val headPosition = headToken?.position()?.orElse(0) ?: 0
        headMeasurements.add(Measurement(time, headPosition))
        headMeasurements.removeIf { m -> m.time.isBefore(time.minus(5, ChronoUnit.MINUTES)) }

        val processors = tokenProvider.getProcessors()
        updateStatistics(processors, time, headPosition)
        updateProcessorDtos(processors, headPosition)
    }

    private fun updateProcessorDtos(processors: List<AbstractTokenEntry<*>>, headPosition: Long) {
        processors.groupBy { it.processorName }
                .forEach { (processorName, segments) ->
                    val segmentDtos = segments.map {
                        val token = it.getToken(serializer)

                        val currentIndex = token?.position()?.orElse(0) ?: 0
                        val behind = headPosition - currentIndex
                        val statistics = statisticMap[ProcessorId(it.processorName, it.segment)]
                        val computedSegment = Segment.computeSegment(it.segment, *segments.map { s -> s.segment }.toTypedArray().toIntArray())
                        SegmentDTO(
                                currentIndex = currentIndex,
                                tokenType = token?.let { t -> t::class.java.simpleName },
                                owner = it.owner,
                                segment = it.segment,
                                replaying = ReplayToken.isReplay(token),
                                behind = behind,
                                statistics = statistics,
                                secondsToHead = statistics?.seconds10?.minutesToHead?.times(60),
                                mergeableSegment = computedSegment.mergeableSegmentId(),
                                splitSegment = computedSegment.splitSegmentId(),
                        )
                    }.sortedBy { it.segment }
                    tokenInformationMap[processorName] = ProcessorDTO(
                            name = processorName,
                            segments = segmentDtos,
                            replaying = segmentDtos.any { it.replaying == true },
                            currentIndex = segmentDtos.map { it.currentIndex }.minByOrNull { it ?: 0 }
                    )
                }
    }

    private fun updateStatistics(processors: List<AbstractTokenEntry<*>>, time: Instant, headPosition: Long) {
        processors.forEach {
            val token = it.getToken(serializer)
            val id = it.toId()
            val position = token?.position()?.orElse(0) ?: 0
            val lastKnownPosition: Long = metricMap[id]?.let { mm -> mm.maxByOrNull { mv -> mv.value }?.value ?: 0 }
                    ?: 0
            if (it.owner == null || position < lastKnownPosition) {
                metricMap.remove(id)
            }
            val metricList = metricMap.computeIfAbsent(id) { mutableListOf() }
            metricList.add(Measurement(time, position))
            metricList.removeIf { m -> m.time.isBefore(time.minus(5, ChronoUnit.MINUTES)) }
            statisticMap[id] = computeStatistics(id, position, headPosition)
        }
    }

    fun getStatistics(id: ProcessorId): Statistics? {
        return statisticMap[id]
    }

    private fun computeStatistics(id: ProcessorId, position: Long?, headPosition: Long): Statistics {
        val values = metricMap[id]!!
        val behind = headPosition - (position ?: 0)
        return Statistics(
                behind,
                calculateForTimeInSeconds(values, 10, behind),
                calculateForTimeInSeconds(values, 60, behind),
                calculateForTimeInSeconds(values, 300, behind),
        )
    }

    fun calculateForTimeInSeconds(measurements: MutableList<Measurement>, seconds: Long, behind: Long): StatisticForSeconds {
        val time = Instant.now()
        val positionRate = getDiff(measurements.filter { it.time.isAfter(time.minus(seconds, ChronoUnit.SECONDS)) })
        val ingestRate = getDiff(headMeasurements.filter { it.time.isAfter(time.minus(seconds, ChronoUnit.SECONDS)) })
        val effectiveRate = truncate((positionRate - ingestRate) * 100) / 100
        return StatisticForSeconds(
                seconds,
                ingestRate,
                positionRate,
                effectiveRate,
                if (behind > 0 && effectiveRate > 0) behind / effectiveRate else null
        )
    }

    private fun getDiff(values: List<Measurement>): Double {
        val last = values.maxByOrNull { it.time } ?: return 0.0
        val first = values.minByOrNull { it.time } ?: return 0.0
        val lastValue = last.value
        val firstValue = first.value
        val value = if (lastValue < firstValue) {
            firstValue / ChronoUnit.SECONDS.between(first.time, last.time).toDouble()
        } else {
            (lastValue - firstValue) / ChronoUnit.SECONDS.between(first.time, last.time).toDouble()
        }
        if (value.isNaN()) {
            return 0.0
        }
        return value.times(60)
    }

    data class Measurement(
            val time: Instant,
            val value: Long,
    )

}
