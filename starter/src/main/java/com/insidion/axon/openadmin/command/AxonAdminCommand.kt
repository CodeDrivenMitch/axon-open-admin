package com.insidion.axon.openadmin.command

data class AxonAdminCommand(
        val nodeId: String? = null,
        val type: AxonAdminCommmandType,
        val processorName: String,
        val segment: Int?,
)
