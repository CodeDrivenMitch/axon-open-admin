package com.insidion.axon.openadmin.model

import org.axonframework.eventhandling.tokenstore.AbstractTokenEntry

data class ProcessorId(
    val name: String,
    val segment: Int,
)


fun AbstractTokenEntry<*>.toId() = ProcessorId(processorName, segment)
