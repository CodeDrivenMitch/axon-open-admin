package com.insidion.axon.openadmin.demo

import com.insidion.axon.openadmin.demo.commands.CreateTodoListCommand
import org.axonframework.commandhandling.gateway.CommandGateway
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class CommandSimulator(
    private val commandGateway: CommandGateway
) {
    @Scheduled(fixedRate = 1000)
    fun simulate() {
        commandGateway.send<Any>(CreateTodoListCommand("My awesome todo-list"))
    }
}
