package com.insidion.axon.openadmin.processors

data class ProcessorStatusDTO(
    val name: String,
    val running: Boolean,
    val error: Boolean,
    val resettable: Boolean,
)
