package com.insidion.axon.openadmin.command.handlers

import com.insidion.axon.openadmin.command.AxonAdminCommand
import com.insidion.axon.openadmin.command.AxonAdminCommandHandler
import com.insidion.axon.openadmin.command.AxonAdminCommmandType
import com.insidion.axon.openadmin.metrics.TokenStatusService
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.StreamingEventProcessor
import org.springframework.stereotype.Component

@Component
class StartProcessorAxonAdminCommandHandler(
        eventProcessingModule: EventProcessingConfiguration,
        tokenStatusService: TokenStatusService
) : AxonAdminCommandHandler(eventProcessingModule, tokenStatusService) {
    override fun executeCommand(command: AxonAdminCommand, eventProcessor: StreamingEventProcessor) {
        eventProcessor.start()
    }

    override val commandType = AxonAdminCommmandType.START_PROCESSOR
}
