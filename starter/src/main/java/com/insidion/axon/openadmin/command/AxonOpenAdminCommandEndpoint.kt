package com.insidion.axon.openadmin.command

import com.insidion.axon.openadmin.NodeIdProvider
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("\${axon.admin.base-url:axon-admin}")
@CrossOrigin
class AxonOpenAdminCommandEndpoint(
    private val handlers: List<AxonAdminCommandHandler>,
    private val nodeIdProvider: NodeIdProvider,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/command")
    fun executeCommand(@RequestBody command: AxonAdminCommand): ResponseEntity<Unit> {
        if (command.nodeId != null && command.nodeId != nodeIdProvider.nodeId) {
            return ResponseEntity.noContent().build()
        }

        logger.info("Executing command for Axon Admin: {}", command)
        val axonAdminCommandHandler = handlers.firstOrNull { it.commandType == command.type }
                ?: throw IllegalArgumentException("No known handler for command type ${command.type}")
        axonAdminCommandHandler.executeCommand(command)

        return ResponseEntity.ok().build()
    }
}
