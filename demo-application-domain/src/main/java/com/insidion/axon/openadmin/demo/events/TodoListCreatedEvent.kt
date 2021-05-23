package com.insidion.axon.openadmin.demo.events

data class TodoListCreatedEvent(
    val id: String,
    val name: String,
)
