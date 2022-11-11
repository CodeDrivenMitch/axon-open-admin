package com.insidion.axon.openadmin.command.handlers

import com.insidion.axon.openadmin.command.AxonAdminCommand
import com.insidion.axon.openadmin.command.AxonAdminCommandHandler
import com.insidion.axon.openadmin.command.AxonAdminCommmandType
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.eventhandling.StreamingEventProcessor
import org.springframework.stereotype.Component

@Component
class ResetProcessorAxonAdminCommandHandler(
    eventProcessingModule: EventProcessingConfiguration
) : AxonAdminCommandHandler(eventProcessingModule) {
    override fun executeCommand(command: AxonAdminCommand, eventProcessor: StreamingEventProcessor) {
        if (eventProcessor.isRunning) {
            throw IllegalStateException("Event processor is still running. Shut down the processor first")
        }
        eventProcessor.resetTokens { it.createTailToken() }
    }

    override val commandType = AxonAdminCommmandType.RESET_PROCESSOR
}
