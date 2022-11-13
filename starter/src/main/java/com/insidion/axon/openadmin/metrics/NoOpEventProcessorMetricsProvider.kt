package com.insidion.axon.openadmin.metrics

import io.micrometer.core.instrument.MeterRegistry
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.stereotype.Service

@ConditionalOnMissingBean(MeterRegistry::class)
@Service
class NoOpEventProcessorMetricsProvider : EventProcessorMetricsProvider {
    override fun provide(): Map<String, EventProcessorMetrics> {
        return emptyMap()
    }
}
