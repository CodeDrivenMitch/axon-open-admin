package com.insidion.axon.openadmin.metrics

import com.insidion.axon.openadmin.model.ProcessorId
import io.micrometer.core.instrument.Gauge
import io.micrometer.core.instrument.MeterRegistry
import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import org.springframework.stereotype.Service

@Service
@ConditionalOnBean(type = ["io.micrometer.core.instrument.MeterRegistry"])
class MicrometerMetricProvider(
    private val processorMetricsService: ProcessorMetricsService,
    private val meterRegistry: MeterRegistry,
) {

    fun registerTokenAsGauge(it: AbstractTokenEntry<*>, processorId: ProcessorId) {
        Gauge.builder("axon.openadmin.processor.${it.processorName}.${it.segment}.position.rate.1m") { processorMetricsService.getStatistics(processorId)?.seconds60?.positionRate }
            .baseUnit("position increase per minute")
            .description("Increase of the event processor position for the last minute. Note that this number is not necessarily the amount of events processed, since gaps can exist in the event-store or part of the events are processed by another thread.")

            .register(meterRegistry)


        Gauge.builder("axon.openadmin.processor.${it.processorName}.${it.segment}.position.rate.5m") { processorMetricsService.getStatistics(processorId)?.seconds300?.positionRate }
            .baseUnit("events per minute")
            .description("Increase of the event processor position for the last five minutes. Note that this number is not necessarily the amount of events processed, since gaps can exist in the event-store or part of the events are processed by another thread.")
            .register(meterRegistry)
    }
}
