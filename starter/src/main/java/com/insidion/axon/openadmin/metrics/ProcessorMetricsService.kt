package com.insidion.axon.openadmin.metrics

import com.insidion.axon.openadmin.model.ProcessorId
import com.insidion.axon.openadmin.model.toId
import com.insidion.axon.openadmin.tokens.TokenProvider
import io.micrometer.core.instrument.Gauge
import io.micrometer.core.instrument.MeterRegistry
import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry
import org.axonframework.eventsourcing.eventstore.EventStore
import org.axonframework.serialization.Serializer
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import kotlin.math.truncate

/**
 * We keep track here of the amount of events processed over a certain amount of time.
 * Axon has an axon-metrics module, which is great but does not include projections running on other nodes
 * Since we use the TokenStore to peek at the indices, we can do that more accurately.
 * While we're at it, we exposed it to the micrometer registry
 */
@Service
class ProcessorMetricsService(
    private val tokenProvider: TokenProvider,
    private val serializer: Serializer,
    private val meterRegistry: MeterRegistry?,
    private val eventStore: EventStore,
) {
    private val metricMap: MutableMap<ProcessorId, MutableList<Measurement>> = mutableMapOf()
    private val statisticMap: MutableMap<ProcessorId, Statistics> = mutableMapOf()
    private val headMeasurements: MutableList<Measurement> = mutableListOf()


    @Scheduled(fixedRate = 2000, initialDelay = 1000)
    fun updateMetrics() {
        val time = Instant.now()

        val headToken = eventStore.createHeadToken()
        val headPosition = headToken?.position()?.orElse(0) ?: 0
        headMeasurements.add(Measurement(time, headPosition))
        headMeasurements.removeIf { m -> m.time.isBefore(time.minus(5, ChronoUnit.MINUTES)) }

        tokenProvider.getProcessors().map {
            val token = it.getToken(serializer)
            val id = it.toId()
            val position = token?.position()?.orElse(0) ?: 0
            val lastKnownPosition: Long = metricMap[id]?.let { mm -> mm.maxByOrNull { mv -> mv.value }?.value ?: 0} ?: 0
            if(it.owner == null || position < lastKnownPosition) {
                metricMap.remove(id)
            }
            val metricList = metricMap.computeIfAbsent(id) { processorId ->
                registerTokenAsGauge(it, processorId)
                mutableListOf()
            }
            metricList.add(Measurement(time, position))
            metricList.removeIf { m -> m.time.isBefore(time.minus(5, ChronoUnit.MINUTES)) }
            statisticMap[id] = computeStatistics(id, position, headPosition)
        }
    }

    private fun registerTokenAsGauge(it: AbstractTokenEntry<*>, processorId: ProcessorId) {
        if (meterRegistry == null) {
            return
        }
        Gauge.builder("axon.openadmin.processor.${it.processorName}.${it.segment}.position.rate.1m") { getStatistics(processorId)?.seconds60?.positionRate }
            .baseUnit("position increase per minute")
            .description("Increase of the event processor position for the last minute. Note that this number is not necessarily the amount of events processed, since gaps can exist in the event-store or part of the events are processed by another thread.")

            .register(meterRegistry)


        Gauge.builder("axon.openadmin.processor.${it.processorName}.${it.segment}.position.rate.5m") { getStatistics(processorId)?.seconds300?.positionRate }
            .baseUnit("events per minute")
            .description("Increase of the event processor position for the last five minutes. Note that this number is not necessarily the amount of events processed, since gaps can exist in the event-store or part of the events are processed by another thread.")
            .register(meterRegistry)
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
