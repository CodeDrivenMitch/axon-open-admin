package com.insidion.axon.openadmin.overview

import com.insidion.axon.openadmin.AxonAdminProperties
import com.insidion.axon.openadmin.EndpointService
import com.insidion.axon.openadmin.NodeIdProvider
import com.insidion.axon.openadmin.dlq.DlqInformationService
import com.insidion.axon.openadmin.metrics.EventProcessorMetricsProvider
import com.insidion.axon.openadmin.processors.ProcessorStatusService
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("\${axon.admin.base-url:axon-admin}/overview")
@CrossOrigin
class OverviewEndpoint(
    private val endpointService: EndpointService,
    private val processorStatusService: ProcessorStatusService,
    private val dlqInformationService: DlqInformationService,
    private val axonAdminProperties: AxonAdminProperties,
    private val nodeIdProvider: NodeIdProvider,
    private val metricsProvider: EventProcessorMetricsProvider,
) {
    @GetMapping("", produces = ["application/json"])
    fun overview() = endpointService.ifReady {
        val dlqOverview = dlqInformationService.getOverview()
        val metrics = metricsProvider.provide()
        Overview(
            nodeId = nodeIdProvider.getNodeId(),
            service = axonAdminProperties.component,
            processors = processorStatusService.getStatus().map {
                ProcessorOverview(
                    name = it.name,
                    status = it,
                    dlq = dlqOverview[it.name],
                    metrics = metrics[it.name],
                )
            }
        )
    }
}
