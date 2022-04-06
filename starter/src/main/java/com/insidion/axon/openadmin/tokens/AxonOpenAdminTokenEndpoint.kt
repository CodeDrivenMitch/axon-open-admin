package com.insidion.axon.openadmin.tokens

import com.insidion.axon.openadmin.metrics.TokenStatusService
import com.insidion.axon.openadmin.model.TokenInformationDTO
import com.insidion.axon.openadmin.processors.ProcessorStatusService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("\${axon.admin.base-url:axon-admin}")
class AxonOpenAdminTokenEndpoint(
        private val tokenStatusService: TokenStatusService,
        private val processorStatusService: ProcessorStatusService,
) {
    @GetMapping("/tokens")
    fun getTokens(): TokenInformationDTO {
        return tokenStatusService.getTokenInformation()
    }

    @GetMapping("/processors")
    fun getProcessors() = processorStatusService.getStatus()
}
