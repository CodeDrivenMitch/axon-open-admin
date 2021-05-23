package com.insidion.axon.openadmin.model

import org.axonframework.eventhandling.tokenstore.GenericTokenEntry

data class ProcessorId(
    val name: String,
    val segment: Int,
)


fun GenericTokenEntry<*>.toId() = ProcessorId(processorName, segment)
