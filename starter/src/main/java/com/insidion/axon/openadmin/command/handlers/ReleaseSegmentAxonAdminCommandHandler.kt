package com.insidion.axon.openadmin.command.handlers

import com.insidion.axon.openadmin.command.AxonAdminCommand
import com.insidion.axon.openadmin.command.AxonAdminCommandHandler
import com.insidion.axon.openadmin.command.AxonAdminCommmandType
import org.axonframework.config.EventProcessingConfiguration
import org.axonframework.eventhandling.StreamingEventProcessor
import org.springframework.stereotype.Component

@Component
class ReleaseSegmentAxonAdminCommandHandler(
    eventProcessingModule: EventProcessingConfiguration,
) : AxonAdminCommandHandler(eventProcessingModule) {
    override fun executeCommand(command: AxonAdminCommand, eventProcessor: StreamingEventProcessor) {
        val segment = command.segment ?: throw IllegalArgumentException("No segment supplied in command")
        eventProcessor.processingStatus()[segment]
            ?: throw IllegalStateException("No segment ${segment} present on this node")
        eventProcessor.releaseSegment(segment)
    }

    override val commandType = AxonAdminCommmandType.RELEASE_SEGMENT
}
