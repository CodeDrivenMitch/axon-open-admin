package com.insidion.axon.openadmin.tokens

import com.fasterxml.jackson.databind.ObjectMapper
import com.insidion.axon.openadmin.metrics.TokenStatusService
import com.insidion.axon.openadmin.processors.ProcessorStatusService
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("\${axon.admin.base-url:axon-admin}")
class AxonOpenAdminTokenEndpoint(
    private val tokenStatusService: TokenStatusService,
    private val processorStatusService: ProcessorStatusService,
    @Qualifier("axonOpenAdmin")
    private val objectMapper: ObjectMapper,
) {
    @GetMapping("/tokens")
    fun getTokens() = objectMapper.writeValueAsString(tokenStatusService.getTokenInformation())

    @GetMapping("/processors")
    fun getProcessors() = objectMapper.writeValueAsString(processorStatusService.getStatus())
}
