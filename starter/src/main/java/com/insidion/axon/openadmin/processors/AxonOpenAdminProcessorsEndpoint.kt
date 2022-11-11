package com.insidion.axon.openadmin.processors

import com.insidion.axon.openadmin.EndpointService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("\${axon.admin.base-url:axon-admin}")
class AxonOpenAdminProcessorsEndpoint(
    private val processorStatusService: ProcessorStatusService,
    private val endpointService: EndpointService
) {

    @GetMapping("/processors")
    fun getProcessors() = endpointService.ifReady { processorStatusService.getStatus() }
}
