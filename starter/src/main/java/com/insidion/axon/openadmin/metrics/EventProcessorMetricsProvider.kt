package com.insidion.axon.openadmin.metrics

interface EventProcessorMetricsProvider {
    fun provide(): Map<String, EventProcessorMetrics>
}
