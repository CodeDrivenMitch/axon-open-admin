package com.insidion.axon.openadmin.command

import com.insidion.axon.openadmin.metrics.TokenStatusService
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.config.EventProcessingModule
import org.axonframework.eventhandling.StreamingEventProcessor

abstract class AxonAdminCommandHandler(
        protected val eventProcessingModule: EventProcessingConfiguration,
        protected val tokenStatusService: TokenStatusService,
) {

    public fun executeCommand(command: AxonAdminCommand) {
        val eventProcessor = eventProcessingModule.eventProcessor(command.processorName, StreamingEventProcessor::class.java)
        if (!eventProcessor.isPresent) {
            throw IllegalStateException("Event processor is not present on this node.")
        }

        executeCommand(command, eventProcessor.get())

        // Update new state in cache
        tokenStatusService.updateCachedInformation()
    }

    public abstract val commandType: AxonAdminCommmandType

    protected abstract fun executeCommand(command: AxonAdminCommand, eventProcessor: StreamingEventProcessor)
}
