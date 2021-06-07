package com.insidion.axon.openadmin.demo.model

import com.insidion.axon.openadmin.demo.commands.CreateTodoListCommand
import com.insidion.axon.openadmin.demo.events.TodoListCreatedEvent
import org.axonframework.commandhandling.CommandHandler
import org.axonframework.common.IdentifierFactory
import org.axonframework.eventsourcing.EventSourcingHandler
import org.axonframework.modelling.command.AggregateIdentifier
import org.axonframework.modelling.command.AggregateLifecycle
import org.axonframework.spring.stereotype.Aggregate

@Aggregate
class TodoList {
    @AggregateIdentifier
    lateinit var id: String
    lateinit var name: String

    constructor()// Here for axon

    @CommandHandler
    constructor(command: CreateTodoListCommand) {
        AggregateLifecycle.apply(TodoListCreatedEvent(IdentifierFactory.getInstance().generateIdentifier(), command.name))
    }

    @EventSourcingHandler
    fun onEvent(event: TodoListCreatedEvent) {
        this.id = event.id
        this.name = event.name
    }
}
