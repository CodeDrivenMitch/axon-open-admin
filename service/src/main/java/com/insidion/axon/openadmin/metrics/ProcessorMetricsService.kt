package com.insidion.axon.openadmin.metrics

import com.insidion.axon.openadmin.model.ProcessorId
import com.insidion.axon.openadmin.model.toId
import com.insidion.axon.openadmin.tokens.TokenProvider
import io.micrometer.core.instrument.Gauge
import io.micrometer.core.instrument.MeterRegistry
import org.axonframework.eventhandling.tokenstore.GenericTokenEntry
import org.axonframework.serialization.Serializer
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import javax.annotation.PostConstruct

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
    private val meterRegistry: MeterRegistry?
) {
    private val metricMap: MutableMap<ProcessorId, MutableList<Measurement>> = mutableMapOf()
    private val statisticMap: MutableMap<ProcessorId, Statistics> = mutableMapOf()


    @Scheduled(fixedRate = 5000, initialDelay = 1000)
    @PostConstruct
    fun updateMetrics() {
        val time = Instant.now()
        tokenProvider.getProcessors().map {
            val position = it.getToken(serializer)?.position()?.orElse(0)
            val id = it.toId()
            val metricList = metricMap.computeIfAbsent(id) { processorId ->
                registerTokenAsGauge(it, processorId)
                mutableListOf()
            }
            metricList.add(Measurement(time, position ?: 0))
            metricList.removeIf { m -> m.time.isBefore(time.minus(5, ChronoUnit.MINUTES)) }
            statisticMap[id] = computeStatistics(id)
        }
    }

    private fun registerTokenAsGauge(it: GenericTokenEntry<*>, processorId: ProcessorId) {
        if (meterRegistry == null) {
            return
        }
        Gauge.builder("axon.openadmin.processor.${it.processorName}.${it.segment}.position.rate.1m") { getStatistics(processorId)?.positionRate1m }
            .baseUnit("position increase per second")
            .description("Increase of the event processor position for the last minute. Note that this number is not necessarily the amount of events processed, since gaps can exist in the event-store or part of the events are processed by another thread.")

            .register(meterRegistry)


        Gauge.builder("axon.openadmin.processor.${it.processorName}.${it.segment}.position.rate.5m") { getStatistics(processorId)?.positionRate5m }
            .baseUnit("events per second")
            .description("Increase of the event processor position for the last five minutes. Note that this number is not necessarily the amount of events processed, since gaps can exist in the event-store or part of the events are processed by another thread.")
            .register(meterRegistry)
    }

    fun getStatistics(id: ProcessorId): Statistics? {
        return statisticMap[id]
    }

    private fun computeStatistics(id: ProcessorId): Statistics {
        val values = metricMap[id]!!
        val time = Instant.now()

        return Statistics(
            getDiff(values.filter { it.time.isAfter(time.minus(60, ChronoUnit.SECONDS)) }),
            getDiff(values.filter { it.time.isAfter(time.minus(300, ChronoUnit.SECONDS)) }),
        )
    }

    private fun getDiff(values: List<Measurement>): Double {
        val last = values.maxByOrNull { it.time } ?: return 0.0
        val first = values.minByOrNull { it.time } ?: return 0.0
        val lastValue = last.value
        val firstValue = first.value
        if (lastValue < firstValue) {
            return firstValue / ChronoUnit.SECONDS.between(first.time, last.time).toDouble()
        }
        return (lastValue - firstValue) / ChronoUnit.SECONDS.between(first.time, last.time).toDouble()
    }

    data class Measurement(
        val time: Instant,
        val value: Long,
    )

}
