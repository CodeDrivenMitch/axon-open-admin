package com.insidion.axon.openadmin.metrics

import io.micrometer.core.instrument.MeterRegistry
import org.axonframework.config.EventProcessingConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.stereotype.Service

@ConditionalOnBean(MeterRegistry::class)
@Service
class MicrometerEventProcessorMetricsProvider(
    private val eventProcessingConfiguration: EventProcessingConfiguration,
    private val meterRegistry: MeterRegistry
) : EventProcessorMetricsProvider {
    override fun provide(): Map<String, EventProcessorMetrics> {
        return eventProcessingConfiguration.eventProcessors().keys.associateWith {
            EventProcessorMetrics(
                meterRegistry.find("eventProcessor.capacity").tag("processorName", it).gauge()?.value(),
                meterRegistry.find("eventProcessor.latency").tag("processorName", it).gauge()?.value(),
            )
        }
    }
}
