package com.insidion.axon.openadmin.overview

import com.insidion.axon.openadmin.dlq.DlqGenericInformation
import com.insidion.axon.openadmin.insights.InsightOverview
import com.insidion.axon.openadmin.metrics.EventProcessorMetrics
import com.insidion.axon.openadmin.processors.ProcessorStatusDTO

data class Overview(
    val nodeId: String,
    val service: String,
    val processors: List<ProcessorOverview>,
    val insight: InsightOverview,
)

data class ProcessorOverview(
    val name: String,
    val status: ProcessorStatusDTO,
    val dlq: DlqGenericInformation?,
    val metrics: EventProcessorMetrics?,
)
