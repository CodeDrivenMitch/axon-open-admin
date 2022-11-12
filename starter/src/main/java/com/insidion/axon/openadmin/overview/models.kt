package com.insidion.axon.openadmin.overview

import com.insidion.axon.openadmin.dlq.DlqGenericInformation
import com.insidion.axon.openadmin.processors.ProcessorStatusDTO

data class Overview(
    val nodeId: String,
    val service: String,
    val processors: List<ProcessorOverview>,
)

data class ProcessorOverview(
    val name: String,
    val status: ProcessorStatusDTO,
    val dlq: DlqGenericInformation?,
)
