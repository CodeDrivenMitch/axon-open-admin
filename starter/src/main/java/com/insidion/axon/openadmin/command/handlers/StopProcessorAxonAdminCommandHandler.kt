package com.insidion.axon.openadmin.command.handlers

import com.insidion.axon.openadmin.command.AxonAdminCommand
import com.insidion.axon.openadmin.command.AxonAdminCommandHandler
import com.insidion.axon.openadmin.command.AxonAdminCommmandType
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.eventhandling.StreamingEventProcessor
import org.springframework.stereotype.Component

@Component
class StopProcessorAxonAdminCommandHandler(
    eventProcessingModule: EventProcessingConfiguration,
) : AxonAdminCommandHandler(eventProcessingModule) {
    override fun executeCommand(command: AxonAdminCommand, eventProcessor: StreamingEventProcessor) {
        eventProcessor.shutDown()
    }

    override val commandType = AxonAdminCommmandType.STOP_PROCESSOR
}
